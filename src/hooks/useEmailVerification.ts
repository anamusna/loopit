import { EmailVerificationData } from "@/shared/types";
import { useCallback, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
export const useEmailVerification = () => {
  const [verificationData, setVerificationData] =
    useLocalStorage<EmailVerificationData | null>(
      "EMAIL_VERIFICATION_TOKEN",
      null
    );
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const generateVerificationToken = useCallback((): string => {
    return `verify_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);
  const sendVerificationEmail = useCallback(
    async (email: string): Promise<boolean> => {
      setIsSending(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const token = generateVerificationToken();
        const expiresAt = Date.now() + 24 * 60 * 60 * 1000; 
        const verificationData: EmailVerificationData = {
          email,
          token,
          expiresAt,
          verified: false,
        };
        setVerificationData(verificationData);
        console.log(`Verification email sent to ${email} with token: ${token}`);
        return true;
      } catch (error) {
        console.error("Failed to send verification email:", error);
        return false;
      } finally {
        setIsSending(false);
      }
    },
    [generateVerificationToken, setVerificationData]
  );
  const resendVerificationEmail = useCallback(async (): Promise<boolean> => {
    if (!verificationData) return false;
    setVerificationData(null);
    return await sendVerificationEmail(verificationData.email);
  }, [verificationData, sendVerificationEmail, setVerificationData]);
  const verifyEmail = useCallback(
    async (token: string): Promise<boolean> => {
      setIsVerifying(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (!verificationData || verificationData.token !== token) {
          throw new Error("Invalid verification token");
        }
        if (Date.now() > verificationData.expiresAt) {
          throw new Error("Verification token has expired");
        }
        if (verificationData.verified) {
          throw new Error("Email already verified");
        }
        const updatedData: EmailVerificationData = {
          ...verificationData,
          verified: true,
        };
        setVerificationData(updatedData);
        return true;
      } catch (error) {
        console.error("Email verification failed:", error);
        return false;
      } finally {
        setIsVerifying(false);
      }
    },
    [verificationData, setVerificationData]
  );
  const isEmailVerified = useCallback(
    (email: string): boolean => {
      return (
        verificationData?.email === email && verificationData?.verified === true
      );
    },
    [verificationData]
  );
  const isVerificationExpired = useCallback((): boolean => {
    return verificationData ? Date.now() > verificationData.expiresAt : true;
  }, [verificationData]);
  const clearVerificationData = useCallback(() => {
    setVerificationData(null);
  }, [setVerificationData]);
  return {
    verificationData,
    isSending,
    isVerifying,
    sendVerificationEmail,
    resendVerificationEmail,
    verifyEmail,
    isEmailVerified,
    isVerificationExpired,
    clearVerificationData,
  };
};
