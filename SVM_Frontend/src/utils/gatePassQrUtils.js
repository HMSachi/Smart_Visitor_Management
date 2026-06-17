import { encodeSecureQrPayload } from "./secureQrPayload";

const unwrapJointRows = (visitorJointData) => {
  if (!visitorJointData) return [];

  if (Array.isArray(visitorJointData)) {
    return visitorJointData;
  }

  if (Array.isArray(visitorJointData.ResultSet)) {
    return visitorJointData.ResultSet;
  }

  if (Array.isArray(visitorJointData.data)) {
    return visitorJointData.data;
  }

  if (typeof visitorJointData === "object") {
    return [visitorJointData];
  }

  return [];
};

export const mapJointRowsToSubVisitors = (visitorJointData) => {
  const rows = unwrapJointRows(visitorJointData);
  const seen = new Set();
  const visitors = [];

  for (const row of rows) {
    const name =
      row.Visitor_Group_Name ||
      row.Group_Members ||
      row.VVG_Visitor_Name ||
      row.name;
    const nic =
      row.Visit_Group_NIC_Passport_Number ||
      row.Members_NIC_Passport_Number ||
      row.VVG_NIC_Passport_Number ||
      row.nic ||
      "N/A";

    if (!name) continue;

    const key = nic || name;
    if (seen.has(key)) continue;

    seen.add(key);
    visitors.push({ name, nic });
  }

  return visitors;
};

export const getGatePassQrIssuedAt = (gatePass = {}) => {
  const raw =
    gatePass.VGP_Issue_Date ||
    gatePass.VVR_Visit_Date ||
    gatePass.issueDate ||
    gatePass.visitDate;

  if (raw) {
    const parsed = new Date(raw).getTime();
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  const passId = gatePass.VGP_Pass_id || gatePass.id;
  const numericPassId = Number(passId);
  return Number.isFinite(numericPassId) ? numericPassId : 0;
};

export const buildGatePassQrPayload = (
  gatePassId,
  subVisitors = [],
  gatePassMeta = {},
) => {
  if (!gatePassId) {
    return null;
  }

  const payload = {
    id: gatePassId,
    v: 1,
    iat: getGatePassQrIssuedAt(gatePassMeta),
  };

  if (subVisitors.length > 0) {
    payload.subVisitors = subVisitors.map((sv) => ({
      name: sv.name || sv.Visitor_Group_Name || sv.Group_Members || "N/A",
      nic:
        sv.nic ||
        sv.Visit_Group_NIC_Passport_Number ||
        sv.Members_NIC_Passport_Number ||
        "N/A",
    }));
  }

  return payload;
};

export const encodeGatePassQr = async (
  gatePassId,
  subVisitors = [],
  gatePassMeta = {},
) => {
  const payload = buildGatePassQrPayload(gatePassId, subVisitors, gatePassMeta);
  if (!payload) {
    return "";
  }

  return encodeSecureQrPayload(payload);
};

export const getGatePassQrCacheKey = (gatePassId) =>
  `svm.gatepass.qr.${gatePassId}`;

export const readCachedGatePassQr = (gatePassId) => {
  if (!gatePassId || typeof window === "undefined") {
    return "";
  }

  try {
    return window.localStorage.getItem(getGatePassQrCacheKey(gatePassId)) || "";
  } catch {
    return "";
  }
};

export const cacheGatePassQr = (gatePassId, encodedValue) => {
  if (!gatePassId || !encodedValue || typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(getGatePassQrCacheKey(gatePassId), encodedValue);
  } catch {
    // ignore storage failures
  }
};

export const resolveGatePassQrValue = async ({
  gatePassId,
  subVisitors = [],
  gatePassMeta = {},
  preferCache = true,
}) => {
  if (!gatePassId) {
    return "";
  }

  if (preferCache) {
    const cached = readCachedGatePassQr(gatePassId);
    if (cached) {
      return cached;
    }
  }

  const encoded = await encodeGatePassQr(gatePassId, subVisitors, gatePassMeta);
  if (encoded) {
    cacheGatePassQr(gatePassId, encoded);
  }

  return encoded;
};
