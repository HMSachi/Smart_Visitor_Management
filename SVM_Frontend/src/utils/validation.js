/**
 * Validation utility for MAS Visitor Management System
 */

export const validateName = (name) => {
  if (!name) return "Name is required";
  const nameRegex = /^[A-Za-z\s]+$/;
  if (!nameRegex.test(name)) return "Name should only contain letters";
  return "";
};

export const validatePhone = (phone) => {
  if (!phone) return "Phone number is required";
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone)) return "Phone number must be exactly 10 digits";
  return "";
};

export const validateNIC = (nic) => {
  if (!nic) return "NIC is required";
  const nicRegex = /^[0-9]{10}$/;
  if (!nicRegex.test(nic)) return "NIC must be exactly 10 digits";
  return "";
};

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
