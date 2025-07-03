// Auth status constants
export const AUTH_STATUS = {
  IDLE: "idle",
  SIGNED_IN: "signIn",
  SIGNED_OUT: "signOut",
} as const;

// Type for auth status
export type AuthStatus = (typeof AUTH_STATUS)[keyof typeof AUTH_STATUS];

// Auth storage keys
export const AUTH_STORAGE_KEYS = {
  TOKEN: "auth_token",
  USER: "auth_user",
  REFRESH_TOKEN: "auth_refresh_token",
} as const; 

// Token related constants
export const TOKEN_CONFIG = {
  DEFAULT_EXPIRES_IN: 3600, // 1 hour
  REFRESH_THRESHOLD: 300, // 5 minutes before expiry
} as const;
