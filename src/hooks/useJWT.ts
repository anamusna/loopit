import { STORAGE_KEYS } from "@/constants/storage";
import { useLoopItStore } from "@/store";
import { useCallback, useEffect, useRef } from "react";
export const useJWT = () => {
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { refreshJWTToken, clearJWTTokens } = useLoopItStore();
  const isTokenValid = useCallback((): boolean => {
    try {
      const authToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!authToken) return false;
      const tokenData = JSON.parse(authToken);
      return Date.now() < tokenData.expiresAt;
    } catch (error) {
      console.error("Failed to validate JWT token:", error);
      return false;
    }
  }, []);
  const getAccessToken = useCallback((): string | null => {
    try {
      const authToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!authToken) return null;
      const tokenData = JSON.parse(authToken);
      return tokenData.accessToken;
    } catch (error) {
      console.error("Failed to get access token:", error);
      return null;
    }
  }, []);
  const getRefreshToken = useCallback((): string | null => {
    try {
      const authToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!authToken) return null;
      const tokenData = JSON.parse(authToken);
      return tokenData.refreshToken;
    } catch (error) {
      console.error("Failed to get refresh token:", error);
      return null;
    }
  }, []);
  const scheduleTokenRefresh = useCallback(() => {
    try {
      const authToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!authToken) return;
      const tokenData = JSON.parse(authToken);
      const timeUntilExpiry = tokenData.expiresAt - Date.now();
      const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 0);
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      refreshTimeoutRef.current = setTimeout(async () => {
        try {
          const success = await refreshJWTToken();
          if (success) {
            scheduleTokenRefresh();
          } else {
            clearJWTTokens();
          }
        } catch (error) {
          console.error("Token refresh failed:", error);
          clearJWTTokens();
        }
      }, refreshTime);
    } catch (error) {
      console.error("Failed to schedule token refresh:", error);
    }
  }, [refreshJWTToken, clearJWTTokens]);
  const clearRefreshTimeout = useCallback(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }
  }, []);
  useEffect(() => {
    if (isTokenValid()) {
      scheduleTokenRefresh();
    }
    return () => {
      clearRefreshTimeout();
    };
  }, [isTokenValid, scheduleTokenRefresh, clearRefreshTimeout]);
  return {
    isTokenValid,
    getAccessToken,
    getRefreshToken,
    scheduleTokenRefresh,
    clearRefreshTimeout,
  };
};
