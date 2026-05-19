/**
 * Comprehensive Validation Utility for MAS Visitor Management System
 * Includes validators and sanitizers for all field types
 */

// ═══════════════════════════════════════════════════════════
// TEXT VALIDATIONS (Letters and spaces only)
// ═══════════════════════════════════════════════════════════

export const validateName = (name) => {
  if (!name) return "Name is required";
  const nameRegex = /^[A-Za-z\s]+$/;
  if (!nameRegex.test(name)) return "Name should only contain letters and spaces";
  return "";
};

export const validateTextOnly = (text, fieldName = "Field") => {
  if (!text) return `${fieldName} is required`;
  const textRegex = /^[A-Za-z\s]+$/;
  if (!textRegex.test(text)) return `${fieldName} should only contain letters and spaces`;
  return "";
};

export const validateCompanyName = (company) => {
  if (!company) return "Organization name is required";
  if (company.length < 2) return "Organization name must be at least 2 characters";
  if (company.length > 100) return "Organization name must not exceed 100 characters";
  // Allow letters, spaces, and common business symbols like &, -, .
  const companyRegex = /^[A-Za-z\s\-\.&]+$/;
  if (!companyRegex.test(company)) return "Organization name contains invalid characters";
  return "";
};

export const validateVehicleType = (vehicleType) => {
  if (!vehicleType) return "Vehicle type is required";
  const validTypes = ["car", "van", "truck", "motorbike", "bus", "bike", "motorcycle"];
  if (!validTypes.includes(vehicleType.toLowerCase())) {
    return "Vehicle type must be: Car, Van, Truck, Motorbike, Bus, Bike, or Motorcycle";
  }
  return "";
};

export const validatePlaceName = (place) => {
  if (!place) return "Place name is required";
  const placeRegex = /^[A-Za-z0-9\s\-\.]+$/;
  if (!placeRegex.test(place)) return "Place name contains invalid characters";
  return "";
};

// ═══════════════════════════════════════════════════════════
// NUMBER VALIDATIONS (Numbers only)
// ═══════════════════════════════════════════════════════════

export const validatePhone = (phone) => {
  if (!phone) return "Phone number is required";
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone)) return "Phone number must be exactly 10 digits (numbers only)";
  return "";
};

export const validateNIC = (nic) => {
  if (!nic) return "NIC/Passport is required";
  const nicRegex = /^[0-9]{10,12}$/;
  if (!nicRegex.test(nic)) return "NIC/Passport must be 10-12 digits (numbers only)";
  return "";
};

export const validateNumbersOnly = (value, fieldName = "Field", minLength = 1, maxLength = 20) => {
  if (!value) return `${fieldName} is required`;
  const numberRegex = /^[0-9]+$/;
  if (!numberRegex.test(value)) return `${fieldName} must contain numbers only`;
  if (value.length < minLength) return `${fieldName} must be at least ${minLength} digits`;
  if (value.length > maxLength) return `${fieldName} must not exceed ${maxLength} digits`;
  return "";
};

// ═══════════════════════════════════════════════════════════
// EMAIL & PASSWORD VALIDATIONS
// ═══════════════════════════════════════════════════════════

export const validateEmail = (email) => {
  if (!email) return "Email is required";
  if (!email.includes("@") || !email.toLowerCase().endsWith(".com")) {
    return "Email must contain @ and end with .com";
  }
  return "";
};

export const validatePassword = (password) => {
  if (!password) return "Password is required";
  
  // Requirement: Max 5 characters
  if (password.length > 5) return "Password must be maximum 5 characters";
  
  // Requirement: At least one capital letter
  const hasCapital = /[A-Z]/.test(password);
  if (!hasCapital) return "Password must have at least one capital letter";
  
  // Requirement: At least one special character
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  if (!hasSpecial) return "Password must have at least one special character";
  
  return "";
};

// ═══════════════════════════════════════════════════════════
// VEHICLE & PLATE VALIDATIONS
// ═══════════════════════════════════════════════════════════

export const validatePlateNumber = (plateNumber) => {
  if (!plateNumber) return "Plate number is required";
  
  // Format: 3-4 letters, optional separator (space or dash), 3-4 numbers
  // Examples: "WP CAS 1234", "WP-CAS-1234", "ABC 123"
  const plateRegex = /^[A-Z]{3,4}[\s\-]?[0-9]{3,4}$/i;
  if (!plateRegex.test(plateNumber.trim())) {
    return "Plate number must be 3-4 letters followed by 3-4 numbers (e.g., WP CAS 1234)";
  }
  return "";
};

// ═══════════════════════════════════════════════════════════
// FIELD SANITIZERS (Real-time input filtering)
// ═══════════════════════════════════════════════════════════

export const sanitizeTextInput = (value) => {
  // Allow only letters and spaces
  return value.replace(/[^A-Za-z\s]/g, "");
};

export const sanitizeNumberInput = (value) => {
  // Allow only numbers
  return value.replace(/[^0-9]/g, "");
};

export const sanitizePlateInput = (value) => {
  // Allow only letters, numbers, spaces, and dashes
  return value.replace(/[^A-Za-z0-9\s\-]/g, "").toUpperCase();
};

export const sanitizePhoneInput = (value) => {
  // Allow only numbers, max 10 digits
  return value.replace(/[^0-9]/g, "").slice(0, 10);
};

export const sanitizeNICInput = (value) => {
  // Allow only numbers, max 12 digits
  return value.replace(/[^0-9]/g, "").slice(0, 12);
};
