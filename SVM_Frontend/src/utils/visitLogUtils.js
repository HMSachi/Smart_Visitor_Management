export const unwrapApiList = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data?.ResultSet)) {
    return payload.data.ResultSet;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.ResultSet)) {
    return payload.ResultSet;
  }

  return [];
};

export const toLocalApiDateTime = (date = new Date()) => {
  const pad = (value) => String(value).padStart(2, "0");
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join("-") + `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

export const formatDateOnly = (date = new Date()) => {
  const pad = (value) => String(value).padStart(2, "0");
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join("-");
};

export const parseDateValue = (value) => {
  if (!value) return null;

  // Try standard parse
  let parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) return parsed;

  if (typeof value === "string") {
    // Try DD/MM/YYYY
    const parts = value.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})(.*)/);
    if (parts) {
      parsed = new Date(`${parts[3]}/${parts[2]}/${parts[1]}${parts[4]}`);
      if (!Number.isNaN(parsed.getTime())) return parsed;
      
      parsed = new Date(`${parts[3]}/${parts[1]}/${parts[2]}${parts[4]}`);
      if (!Number.isNaN(parsed.getTime())) return parsed;
    }
    
    // Try time only
    const timeMatch = value.match(/^(\d{2}):(\d{2})(?::(\d{2}))?$/);
    if (timeMatch) {
      const today = new Date();
      today.setHours(parseInt(timeMatch[1], 10));
      today.setMinutes(parseInt(timeMatch[2], 10));
      today.setSeconds(timeMatch[3] ? parseInt(timeMatch[3], 10) : 0);
      return today;
    }
  }

  return null;
};

export const formatDisplayDate = (value) => {
  const parsed = parseDateValue(value);
  if (!parsed) {
    return "N/A";
  }

  return parsed.toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

export const formatDisplayTime = (value) => {
  const parsed = parseDateValue(value);
  if (!parsed) {
    return "N/A";
  }

  return parsed.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export const formatDurationFrom = (value) => {
  const startedAt = parseDateValue(value);
  if (!startedAt) {
    return "N/A";
  }

  const diffMs = Math.max(0, Date.now() - startedAt.getTime());
  const hours = Math.floor(diffMs / 3600000);
  const minutes = Math.floor((diffMs % 3600000) / 60000);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
};

export const getVisitLogId = (log) =>
  log?.VVL_Visit_id ||
  log?.VVL_Visit_Id ||
  log?.Visit_id ||
  log?.VisitLogId ||
  log?.id ||
  null;

export const getVisitLogPassId = (log) =>
  log?.VVL_Pass_id ||
  log?.VVL_Pass_Id ||
  log?.VGP_Pass_id ||
  log?.Pass_id ||
  log?.PassId ||
  null;

export const getVisitLogCheckInTime = (log) =>
  log?.VVL_Check_in_Time ||
  log?.VVL_Check_In_Time ||
  log?.VVL_CheckInTime ||
  log?.VVL_In_Time ||
  log?.VVL_Entry_Time ||
  log?.Check_In_Time ||
  log?.CheckInTime ||
  log?.VVL_Created_Date ||
  log?.Created_Date ||
  log?.CreatedDate ||
  null;

export const getVisitLogCheckOutTime = (log) =>
  log?.VVL_Check_out_Time ||
  log?.VVL_Check_Out_Time ||
  log?.VVL_CheckOutTime ||
  log?.VVL_Out_Time ||
  log?.VVL_Exit_Time ||
  log?.Check_Out_Time ||
  log?.CheckOutTime ||
  null;

export const getVisitLogAreas = (log, pass = {}) =>
  log?.VVL_Accessed_Areas ||
  log?.Accessed_Areas ||
  pass?.VVR_Places_to_Visit ||
  pass?.VGP_Visiting_Area ||
  pass?.Visitor_Places_to_Visit ||
  "Main Premises";

export const getPassAccessAreas = (pass = {}) =>
  pass?.VVR_Places_to_Visit ||
  pass?.VGP_Visiting_Area ||
  pass?.Visitor_Places_to_Visit ||
  pass?.Places_to_Visit ||
  "Main Premises";

export const getVisitExpiryDate = (pass = {}) => {
  const directExpiry =
    pass?.VVL_Expiry_Date ||
    pass?.VGP_Expiry_Date ||
    pass?.VGP_Expire_Date ||
    pass?.VVR_Expiry_Date;

  if (directExpiry) {
    const parsed = parseDateValue(directExpiry);
    if (parsed) {
      return formatDateOnly(parsed);
    }
  }

  const base =
    parseDateValue(pass?.VVR_Visit_Date) ||
    parseDateValue(pass?.VGP_Issue_Date) ||
    new Date();
  const expiry = new Date(base);
  expiry.setDate(expiry.getDate() + 1);
  return formatDateOnly(expiry);
};

export const hasVisitLogCheckedOut = (log) => Boolean(getVisitLogCheckOutTime(log));

export const findOpenVisitLog = (logs, passId) =>
  unwrapApiList(logs).find(
    (log) =>
      String(getVisitLogPassId(log)) === String(passId) &&
      !hasVisitLogCheckedOut(log),
  ) || null;

export const cleanPassId = (id) => {
  if (!id) return "";
  return String(id).replace(/^(PASS|GP|gp)-/i, "").trim();
};

export const createPassLookup = (passes) => {
  const lookup = new Map();
  unwrapApiList(passes).forEach((pass) => {
    const passId = pass?.VGP_Pass_id || pass?.Pass_id || pass?.id;
    if (passId !== undefined && passId !== null) {
      lookup.set(cleanPassId(passId), pass);
    }
  });
  return lookup;
};

export const normalizeVisitLog = (log, pass = {}) => {
  const passId = cleanPassId(getVisitLogPassId(log));
  const checkInTime = getVisitLogCheckInTime(log);
  const checkOutTime = getVisitLogCheckOutTime(log);
  const accessedAreas = getVisitLogAreas(log, pass);
  const name =
    log?.Visitor_Name ||
    log?.VV_Name ||
    log?.VVL_Visitor_Name ||
    pass?.Visitor_Name ||
    pass?.VV_Name ||
    "Unknown Visitor";

  return {
    raw: log,
    pass,
    id: getVisitLogId(log),
    passId,
    name,
    nic:
      log?.Visitor_NIC ||
      log?.VV_NIC_Passport_NO ||
      log?.NIC ||
      pass?.Visitor_NIC ||
      pass?.VV_NIC_Passport_NO ||
      pass?.NIC ||
      "N/A",
    phone:
      log?.Visitor_Phone ||
      log?.VV_Phone ||
      log?.Phone ||
      pass?.Visitor_Phone ||
      pass?.VV_Phone ||
      pass?.Phone ||
      "N/A",
    company:
      log?.Visitor_Company ||
      log?.VV_Company ||
      pass?.Visitor_Company ||
      pass?.VV_Company ||
      "N/A",
    vehicle:
      log?.Visitor_Vehicle_No ||
      log?.VV_Vehicle_No ||
      pass?.Visitor_Vehicle_No ||
      pass?.VV_Vehicle_No ||
      "N/A",
    purpose:
      log?.VVR_Purpose ||
      log?.VVR_Visiting_Purpose ||
      pass?.VVR_Purpose ||
      pass?.VVR_Visiting_Purpose ||
      "N/A",
    accessedAreas,
    areas: String(accessedAreas)
      .split(/[,|]/)
      .map((area) => area.trim())
      .filter(Boolean),
    checkInTime,
    checkOutTime,
    entryTime: formatDisplayTime(checkInTime),
    exitTime: formatDisplayTime(checkOutTime),
    date: formatDisplayDate(checkInTime || log?.VVL_Expiry_Date),
    duration: formatDurationFrom(checkInTime),
    status: checkOutTime ? "Left" : "Active",
    ref: passId ? `Pass ID: ${passId}` : "Pass ID: N/A",
    node: log?.VVL_Node || pass?.VGP_Node || "Gate 01",
    remarks: log?.VVL_Remarks || log?.Remarks || "",
  };
};

export const sortVisitLogsNewestFirst = (items) =>
  [...items].sort((a, b) => {
    const aTime = parseDateValue(a.checkOutTime || a.checkInTime)?.getTime() || 0;
    const bTime = parseDateValue(b.checkOutTime || b.checkInTime)?.getTime() || 0;
    return bTime - aTime;
  });
