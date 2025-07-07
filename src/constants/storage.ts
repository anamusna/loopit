export const STORAGE_KEYS = {
  THEME: "theme",
  FONT_SIZE: "fontSize",
  CONTRAST: "contrast",
  LANGUAGE: "language",
  ACCESSIBILITY_SETTINGS: "accessibilitySettings",
  DISPLAY_SETTINGS: "displaySettings",
  NAVIGATION_SETTINGS: "navigationSettings",
  SEARCH_SETTINGS: "searchSettings",
  SAVED_SEARCHES: "savedSearches",
  NOTIFICATION_SETTINGS: "notificationSettings",
  PRIVACY_SETTINGS: "privacySettings",
  SECURITY_SETTINGS: "securitySettings",
  USER_PREFERENCES: "userPreferences",
  PERMISSIONS: "permissions",
  AUTH_TOKEN: "authToken",
  USER_SESSION: "userSession",
  LAST_LOGIN: "lastLogin",
  REMEMBER_ME: "rememberMe",
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  EMAIL_VERIFICATION_TOKEN: "emailVerificationToken",
  PASSWORD_RESET_TOKEN: "passwordResetToken",
  TUTORIAL_SEEN: "tutorialSeen",
  TERMS_ACCEPTED: "termsAccepted",
  PROFILE_SETUP_COMPLETED: "profileSetupCompleted",
  LOCATION_PERMISSION_GRANTED: "locationPermissionGranted",
  CHAT_TEMPLATES: "chatTemplates",
  CHAT_SETTINGS: "chatSettings",
  STORE: "loopit-store",
} as const;
export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
export type StorageKeyType = keyof typeof STORAGE_KEYS;
export type EncryptedKey = "userPreferences" | "authToken" | "userSession";
export const TOKEN_KEYS = {
  ACCESS: "accessToken",
  REFRESH: "refreshToken",
} as const;
export const SETTINGS_KEYS = {
  THEME: "theme",
  FONT_SIZE: "fontSize",
  LANGUAGE: "language",
} as const;
export const ENCRYPTED_KEYS = [
  "userPreferences",
  "authToken",
  "userSession",
] as const;
