const CryptoJS = require('crypto-js');

// .env me FRONTEND_ENCRYPTION_KEY ko React ke REACT_APP_ENCRYPTION_KEY ke same rakho
const FRONTEND_KEY =
  process.env.FRONTEND_ENCRYPTION_KEY || 'frontend_default_key_change_this';

function decryptField(cipherText) {
  if (!cipherText) return '';
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, FRONTEND_KEY);
    const plain = bytes.toString(CryptoJS.enc.Utf8);
    return plain || '';
  } catch (e) {
    console.error('Decrypt error for field:', e.message);
    return '';
  }
}

function decryptNumberField(cipherText) {
  const str = decryptField(cipherText);
  if (str === '' || str === null || str === undefined) return null;
  const num = Number(str);
  return Number.isNaN(num) ? null : num;
}

function decryptAstronautDoc(astro) {
  return {
    fullName: decryptField(astro.fullName),
    age: decryptNumberField(astro.age),
    height: decryptNumberField(astro.height),
    weight: decryptNumberField(astro.weight),
    bloodType: decryptField(astro.bloodType),
    medicalHistory: decryptField(astro.medicalHistory),
    allergies: decryptField(astro.allergies),
    medications: decryptField(astro.medications),
    fitnessLevel: decryptField(astro.fitnessLevel),
    previousMissions: decryptField(astro.previousMissions),
    emergencyContact: decryptField(astro.emergencyContact),
    notes: decryptField(astro.notes)
  };
}

module.exports = { decryptAstronautDoc };
