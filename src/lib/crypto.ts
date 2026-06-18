// src/lib/crypto.ts
import CryptoJS from 'crypto-js';

// This MUST match the secret in your generator script
const SECRET_KEY = 'TAILOR_OFFLINE_SECRET_2026-Taleeb';

export function validateRechargeCode(appId: string, code: string): { isValid: boolean; credits?: number; error?: string } {
  // 1. Check format (now expecting 2 parts: Amount-HashString)
  const parts = code.split('-');
  if (parts.length !== 2) {
    return { isValid: false, error: 'Invalid code format.' };
  }

  const [creditsStr, hashString] = parts;
  const credits = parseInt(creditsStr, 10);

  if (isNaN(credits) || credits <= 0) {
    return { isValid: false, error: 'Invalid credit amount.' };
  }

  if (hashString.length !== 7) {
    return { isValid: false, error: 'Code length is incorrect.' };
  }

  // 2. Extract the 3-char nonce and 4-char signature from the compacted string
  const nonce = hashString.substring(0, 3);
  const signature = hashString.substring(3, 7);

  // 3. Reconstruct the payload and hash it
  const payload = `${appId}:${credits}:${nonce}`;
  const expectedHash = CryptoJS.HmacSHA256(payload, SECRET_KEY).toString(CryptoJS.enc.Hex).toUpperCase();
  
  // 4. Verify against a 4-character signature
  const expectedSignature = expectedHash.substring(0, 4);

  if (signature === expectedSignature) {
    return { isValid: true, credits };
  } else {
    return { isValid: false, error: 'Invalid code for this device.' };
  }
}