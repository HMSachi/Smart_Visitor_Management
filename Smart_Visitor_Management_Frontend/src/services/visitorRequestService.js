const STORAGE_KEY = 'svm_visitor_requests_v1';
const LAST_REQUEST_KEY = 'svm_last_request_id';
const SEQUENCE_KEY = 'svm_request_sequence';

const parseJSON = (value, fallback) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
};

const loadRequests = () => {
  if (typeof window === 'undefined') {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  const parsed = parseJSON(raw, []);
  return Array.isArray(parsed) ? parsed : [];
};

const saveRequests = (requests) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
};

const nextSequence = () => {
  if (typeof window === 'undefined') {
    return Date.now() % 1000;
  }

  const current = Number(window.localStorage.getItem(SEQUENCE_KEY) || '0');
  const next = current + 1;
  window.localStorage.setItem(SEQUENCE_KEY, String(next));
  return next;
};

const formatPurpose = (purpose, purposeOther) => {
  if (purpose === 'other') {
    return (purposeOther || 'OTHER').toUpperCase();
  }

  return (purpose || 'GENERAL VISIT').replace(/_/g, ' ').toUpperCase();
};

const toDateLabel = (value) => {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) {
    return 'N/A';
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
};

const toIsoDate = (value) => {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }

  return date.toISOString().slice(0, 10);
};

const toTimeLabel = (value) => {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) {
    return 'N/A';
  }

  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const toRelativeTime = (value) => {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) {
    return 'just now';
  }

  const diffMinutes = Math.max(1, Math.floor((Date.now() - date.getTime()) / 60000));
  if (diffMinutes < 60) {
    return `${diffMinutes} mins ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hours ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} days ago`;
};

export const getAllVisitorRequests = () => {
  return loadRequests().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const createVisitorRequest = (step1Data) => {
  const sequence = String(nextSequence()).padStart(3, '0');
  const year = new Date().getFullYear();
  const now = new Date().toISOString();

  const newRequest = {
    id: `VR-${year}-${sequence}`,
    batchId: `BATCH-${year}-${sequence}`,
    fullName: step1Data.fullName,
    nic: step1Data.nic,
    contact: step1Data.contact,
    email: step1Data.email,
    visitDate: step1Data.visitDate,
    purpose: step1Data.purpose,
    purposeOther: step1Data.purposeOther || '',
    isCompanyRelated: Boolean(step1Data.isCompanyRelated),
    visitorCount: Number(step1Data.visitorCount || 1),
    vehicleNumber: step1Data.vehicleNumber,
    vehicleType: step1Data.vehicleType,
    selectedAreas: step1Data.selectedAreas || [],
    additionalVisitors: [],
    equipment: [],
    uploadedFile: '',
    status: 'Pending',
    phase: 'Step 1',
    contactStatus: 'Pending',
    adminStatus: 'Pending',
    createdAt: now,
    updatedAt: now,
  };

  const requests = loadRequests();
  requests.unshift(newRequest);
  saveRequests(requests);

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(LAST_REQUEST_KEY, newRequest.id);
  }

  return newRequest;
};

export const getLastRequestId = () => {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.localStorage.getItem(LAST_REQUEST_KEY) || '';
};

export const getVisitorRequestById = (requestId) => {
  if (!requestId) {
    return null;
  }

  return loadRequests().find((item) => item.id === requestId) || null;
};

export const updateVisitorRequestStep2 = (requestId, details) => {
  const requests = loadRequests();
  const fallbackId = requests[0]?.id;
  const targetId = requestId || fallbackId;

  if (!targetId) {
    return null;
  }

  const visitors = (details.visitors || []).filter((visitor) => {
    return visitor.fullName || visitor.nic || visitor.contact;
  });

  const equipment = (details.equipment || []).filter((item) => {
    return item.itemName || item.quantity || item.description;
  });

  const updated = requests.map((request) => {
    if (request.id !== targetId) {
      return request;
    }

    return {
      ...request,
      additionalVisitors: visitors,
      equipment,
      uploadedFile: details.uploadedFile || request.uploadedFile || '',
      phase: 'Step 2',
      updatedAt: new Date().toISOString(),
    };
  });

  saveRequests(updated);
  return updated.find((item) => item.id === targetId) || null;
};

export const updateVisitorRequestStatus = (requestId, status, metadata = {}) => {
  const requests = loadRequests();

  const updated = requests.map((request) => {
    if (request.id !== requestId) {
      return request;
    }

    return {
      ...request,
      status,
      contactStatus: status,
      rejectionReason: metadata.reason || request.rejectionReason || '',
      rejectionComment: metadata.comment || request.rejectionComment || '',
      updatedAt: new Date().toISOString(),
    };
  });

  saveRequests(updated);
  return updated.find((item) => item.id === requestId) || null;
};

export const mapRequestsToContactInbox = (requests = getAllVisitorRequests()) => {
  return requests.map((request) => ({
    id: request.id,
    name: request.fullName || 'UNKNOWN VISITOR',
    type: formatPurpose(request.purpose, request.purposeOther),
    step: request.phase || 'Step 1',
    status: request.status || 'Pending',
    time: toRelativeTime(request.updatedAt || request.createdAt),
    date: toDateLabel(request.visitDate || request.createdAt),
  }));
};

export const mapRequestsToAdminVisitors = (requests = getAllVisitorRequests()) => {
  return requests.map((request) => ({
    batchId: request.batchId || request.id,
    id: request.id,
    name: request.fullName || 'UNKNOWN VISITOR',
    isLeader: true,
    nic: request.nic || 'N/A',
    contact: request.contact || 'N/A',
    email: request.email || 'N/A',
    date: toIsoDate(request.visitDate || request.createdAt),
    timeIn: toTimeLabel(request.createdAt),
    purpose: formatPurpose(request.purpose, request.purposeOther),
    visitorCount: Number(request.visitorCount || 1),
    vehicle: request.vehicleNumber ? `${request.vehicleNumber} (${request.vehicleType || 'N/A'})` : 'None',
    areas: request.selectedAreas && request.selectedAreas.length > 0 ? request.selectedAreas : ['N/A'],
    status: request.status || 'Pending',
    contactPerson: 'Assigned Contact',
    equipment: (request.equipment || []).map((item) => `${item.itemName || 'Item'} (${item.quantity || '1'})`),
    members: request.additionalVisitors || [],
  }));
};

export const getStep1SummaryFromLatest = () => {
  const latest = getAllVisitorRequests()[0];
  if (!latest) {
    return {
      date: toIsoDate(new Date()),
      purpose: 'GENERAL VISIT',
      visitors: 1,
      areas: ['MAIN RECEPTION'],
    };
  }

  return {
    date: toIsoDate(latest.visitDate || latest.createdAt),
    purpose: formatPurpose(latest.purpose, latest.purposeOther),
    visitors: Number(latest.visitorCount || 1),
    areas: latest.selectedAreas && latest.selectedAreas.length > 0 ? latest.selectedAreas : ['N/A'],
  };
};