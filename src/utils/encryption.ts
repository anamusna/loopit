import { ENCRYPTION_CONFIG } from "@/constants/chatConfig";
export const encryptMessage = async (
  message: string,
  key?: string
): Promise<string> => {
  try {
    if (!ENCRYPTION_CONFIG.ALGORITHM) {
      return message; 
    }
    const encoded = btoa(unescape(encodeURIComponent(message)));
    return encoded;
  } catch (error) {
    console.warn("Encryption failed, sending unencrypted:", error);
    return message;
  }
};
export const decryptMessage = async (
  encryptedMessage: string,
  key?: string
): Promise<string> => {
  try {
    if (!ENCRYPTION_CONFIG.ALGORITHM) {
      return encryptedMessage; 
    }
    const decoded = decodeURIComponent(escape(atob(encryptedMessage)));
    return decoded;
  } catch (error) {
    console.warn("Decryption failed, returning original:", error);
    return encryptedMessage;
  }
};
export const generateEncryptionKey = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};
export const isMessageEncrypted = (message: string): boolean => {
  try {
    return btoa(atob(message)) === message;
  } catch {
    return false;
  }
};
export const generateSecureKey = async (): Promise<CryptoKey> => {
  if (!window.crypto?.subtle) {
    throw new Error("Web Crypto API not available");
  }
  return await window.crypto.subtle.generateKey(
    {
      name: ENCRYPTION_CONFIG.ALGORITHM,
      length: ENCRYPTION_CONFIG.KEY_LENGTH,
    },
    true,
    ["encrypt", "decrypt"]
  );
};
export const encryptMessageSecure = async (
  message: string,
  key: CryptoKey
): Promise<{ encrypted: ArrayBuffer; iv: Uint8Array }> => {
  if (!window.crypto?.subtle) {
    throw new Error("Web Crypto API not available");
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const iv = window.crypto.getRandomValues(
    new Uint8Array(ENCRYPTION_CONFIG.IV_LENGTH)
  );
  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: ENCRYPTION_CONFIG.ALGORITHM,
      iv: iv,
    },
    key,
    data
  );
  return { encrypted, iv };
};
export const decryptMessageSecure = async (
  encryptedData: ArrayBuffer,
  key: CryptoKey,
  iv: Uint8Array
): Promise<string> => {
  if (!window.crypto?.subtle) {
    throw new Error("Web Crypto API not available");
  }
  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: ENCRYPTION_CONFIG.ALGORITHM,
      iv: iv,
    },
    key,
    encryptedData
  );
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
};
