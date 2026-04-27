const QR_PREFIX = "SVMQR1";

let cachedKeyPromise = null;

const toBase64 = (bytes) => {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const fromBase64 = (value) => {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

const getCrypto = () => {
  if (!window?.crypto?.subtle) {
    throw new Error("Secure QR is not supported in this browser.");
  }
  return window.crypto;
};

const getSecret = () =>
  process.env.REACT_APP_QR_SECRET ||
  "SVM_CHANGE_THIS_SECRET_FOR_PRODUCTION_QR_SECURITY";

const getAesKey = async () => {
  if (!cachedKeyPromise) {
    cachedKeyPromise = (async () => {
      const crypto = getCrypto();
      const encodedSecret = new TextEncoder().encode(getSecret());
      const hash = await crypto.subtle.digest("SHA-256", encodedSecret);
      return crypto.subtle.importKey("raw", hash, { name: "AES-GCM" }, false, [
        "encrypt",
        "decrypt",
      ]);
    })();
  }

  return cachedKeyPromise;
};

export const isSecureQrPayload = (value) =>
  typeof value === "string" && value.startsWith(`${QR_PREFIX}.`);

export const encodeSecureQrPayload = async (payload) => {
  try {
    console.log("[SecureQR] Encoding payload:", payload);
    const crypto = getCrypto();
    const key = await getAesKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const plainText = new TextEncoder().encode(JSON.stringify(payload));
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      plainText,
    );

    const result = `${QR_PREFIX}.${toBase64(iv)}.${toBase64(new Uint8Array(encrypted))}`;
    console.log("[SecureQR] Encoded result length:", result.length);
    return result;
  } catch (err) {
    console.error("[SecureQR] Encoding failed:", err);
    throw err;
  }
};

export const decodeSecureQrPayload = async (encodedValue) => {
  try {
    console.log("[SecureQR] Decoding value length:", encodedValue?.length);
    if (!isSecureQrPayload(encodedValue)) {
      throw new Error("This QR code does not use the secure SVM format.");
    }

    const parts = encodedValue.split(".");
    console.log("[SecureQR] Parts count:", parts.length);
    if (parts.length !== 3) {
      throw new Error("Invalid secure QR data format.");
    }

    const [, ivBase64, cipherBase64] = parts;
    const iv = fromBase64(ivBase64);
    const cipherBytes = fromBase64(cipherBase64);
    const key = await getAesKey();
    const crypto = getCrypto();

    console.log("[SecureQR] Starting decryption...");
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      cipherBytes,
    );
    const plainText = new TextDecoder().decode(decrypted);
    const payload = JSON.parse(plainText);

    if (!payload || typeof payload !== "object") {
      throw new Error("Decoded secure QR payload is invalid.");
    }

    console.log("[SecureQR] Decoded successfully:", payload);
    return payload;
  } catch (err) {
    console.error("[SecureQR] Decoding failed:", err);
    throw err;
  }
};
