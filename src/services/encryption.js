// src/services/encryption.js

// NOTE: Actual production encryption ke liye audited crypto library use karni chahiye.
// Ye sirf structure dikhane ke liye simple Base64 placeholder hai.

export function encryptData(object) {
  const json = JSON.stringify(object);
  const encoded = btoa(unescape(encodeURIComponent(json)));
  return encoded;
}

export function decryptData(encoded) {
  try {
    const json = decodeURIComponent(escape(atob(encoded)));
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}
