import CryptoJS from "crypto-js";

const ENCRYPTION_KEY =
  process.env.REACT_APP_ENCRYPTION_KEY || "frontend_default_key_change_this";

export function encryptFormData(data) {
  const encrypted = {};
  for (const key in data) {
    const value = data[key] == null ? "" : String(data[key]);
    encrypted[key] = CryptoJS.AES.encrypt(value, ENCRYPTION_KEY).toString();
  }
  return encrypted;
}
