import { PasswordResetData } from "@/shared/types";
import { useCallback, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
export const usePasswordReset = () => {
  const [resetData, setResetData] = useLocalStorage<PasswordResetData | null>(
    "PASSWORD_RESET_TOKEN",
    null
  );
  const [isSending, setIsSending] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const generateResetToken = useCallback((): string => {
    return `reset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);
  const requestPasswordReset = useCallback(
    async (email: string): Promise<boolean> => {
      setIsSending(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const token = generateResetToken();
        const expiresAt = Date.now() + 60 * 60 * 1000; 
        const resetData: PasswordResetData = {
          email,
          token,
          expiresAt,
          used: false,
        };
        setResetData(resetData);
        console.log(
          `Password reset email sent to ${email} with token: ${token}`
        );
        return true;
      } catch (error) {
        console.error("Failed to send password reset email:", error);
        return false;
      } finally {
        setIsSending(false);
      }
    },
    [generateResetToken, setResetData]
  );
  const validateResetToken = useCallback(
    (token: string): boolean => {
      if (!resetData || resetData.token !== token) {
        return false;
      }
      if (Date.now() > resetData.expiresAt) {
        return false;
      }
      if (resetData.used) {
        return false;
      }
      return true;
    },
    [resetData]
  );
  const resetPassword = useCallback(
    async (token: string, newPassword: string): Promise<boolean> => {
      setIsResetting(true);
      try {
        if (!validateResetToken(token)) {
          throw new Error("Invalid or expired reset token");
        }
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const updatedData: PasswordResetData = {
          ...resetData!,
          used: true,
        };
        setResetData(updatedData);
        console.log(`Password reset successful for ${resetData!.email}`);
        return true;
      } catch (error) {
        console.error("Password reset failed:", error);
        return false;
      } finally {
        setIsResetting(false);
      }
    },
    [resetData, validateResetToken, setResetData]
  );
  const isResetTokenExpired = useCallback((): boolean => {
    return resetData ? Date.now() > resetData.expiresAt : true;
  }, [resetData]);
  const isResetTokenUsed = useCallback((): boolean => {
    return resetData?.used || false;
  }, [resetData]);
  const clearResetData = useCallback(() => {
    setResetData(null);
  }, [setResetData]);
  return {
    resetData,
    isSending,
    isResetting,
    requestPasswordReset,
    validateResetToken,
    resetPassword,
    isResetTokenExpired,
    isResetTokenUsed,
    clearResetData,
  };
};
