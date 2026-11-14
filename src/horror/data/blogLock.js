export const lockConfig = {
  credentialSalt: "dlgt::7a41f0c2::lock",
  payloadSalt: "dlgt::payload::19d3",
  usernameHash: "9f1596eb0e3352335534d6d101f22d4edefa926f0f4967ddd19783efdb7a3582",
  passwordHash: "524a82256c2b03a8badbea91a9be5a60c265bf1802a69bc003b2a9fe631753b6",
  iterations: 150000,
  iv: "Ds8ZuA4MFtxEWSi3",
  payload: "4MLXPiW/W9HTAvUnlKBJJy1H7eJmhgpjb8BuseR5u/k=",
};

const encoder = new TextEncoder();
const fromBase64 = (value) => Uint8Array.from(atob(value), (letter) => letter.charCodeAt(0));

async function digest(value) {
  const bytes = encoder.encode(`${lockConfig.credentialSalt}:${value}`);
  const result = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(result)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function credentialsMatch(username, password) {
  const [usernameHash, passwordHash] = await Promise.all([digest(username), digest(password)]);
  return usernameHash === lockConfig.usernameHash && passwordHash === lockConfig.passwordHash;
}

export async function decryptBlogPayload(password) {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode(lockConfig.payloadSalt),
      iterations: lockConfig.iterations,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"],
  );
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: fromBase64(lockConfig.iv) },
    key,
    fromBase64(lockConfig.payload),
  );
  return new TextDecoder().decode(decrypted);
}
