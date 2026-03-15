import CryptoJS from "crypto-js";

const ENCRYPTION_KEY = "your_secret_encryption_key_keep_it_safe"; // Same as backend

// Encrypt individual field
export const encryptField = (value) => {
  if (!value) return null;
  return CryptoJS.AES.encrypt(String(value), ENCRYPTION_KEY).toString();
};

// Encrypt entire form data
export const encryptFormData = (formData) => {
  const encrypted = {};
  for (let key in formData) {
    encrypted[key] = encryptField(formData[key]);
  }
  return encrypted;
};
