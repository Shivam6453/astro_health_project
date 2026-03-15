// backend/utils/encryption.js

const CryptoJS = require('crypto-js');

// Ye key .env se lena best hai
// .env me: ENCRYPTION_KEY=your_strong_secret_key
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'change_this_default_key';

// Pure object ko field-wise encrypt karega
function encryptObject(obj) {
  const encrypted = {};
  for (const key in obj) {
    const value = obj[key] == null ? '' : String(obj[key]);
    encrypted[key] = CryptoJS.AES.encrypt(value, ENCRYPTION_KEY).toString();
  }
  return encrypted;
}

// Decrypt karne ke liye (legacy simple form ke liye)
function decryptObject(obj) {
  const decrypted = {};
  for (const key in obj) {
    if (!obj[key]) {
      decrypted[key] = '';
      continue;
    }
    const bytes = CryptoJS.AES.decrypt(obj[key], ENCRYPTION_KEY);
    decrypted[key] = bytes.toString(CryptoJS.enc.Utf8);
  }
  return decrypted;
}

module.exports = { encryptObject, decryptObject };
