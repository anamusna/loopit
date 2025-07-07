"use client";
import { useEmailVerification } from "@/hooks/useEmailVerification";
import { useLoopItStore } from "@/store";
import Button, {
  ButtonSize,
  ButtonVariant,
} from "@/tailwind/components/elements/Button";
import Card from "@/tailwind/components/layout/Card";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
const EmailVerificationContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { verifyEmail, isVerifying, isEmailVerified, sendVerificationEmail } =
    useEmailVerification();
  const {
    verifyEmail: storeVerifyEmail,
    isEmailVerified: storeIsEmailVerified,
  } = useLoopItStore();
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "success" | "error" | "verifying"
  >("pending");
  const [errorMessage, setErrorMessage] = useState("");
  const handleEmailVerification = async (verificationToken: string) => {
    setVerificationStatus("verifying");
    setErrorMessage("");
    try {
      const success = await verifyEmail(verificationToken);
      if (success) {
        setVerificationStatus("success");
        setTimeout(() => {
          router.push("/login?verified=true");
        }, 2000);
      } else {
        setVerificationStatus("error");
        setErrorMessage("Email verification failed. Please try again.");
      }
    } catch (err) {
      setVerificationStatus("error");
      setErrorMessage("An error occurred during verification.");
    }
  };
  useEffect(() => {
    if (token) {
      handleEmailVerification(token);
    }
  }, [token, handleEmailVerification]);
  const handleResendVerification = async () => {
    try {
      const { user } = useLoopItStore.getState();
      if (!user?.email) {
        setErrorMessage("No email address found. Please log in again.");
        return;
      }
      const success = await sendVerificationEmail(user.email);
      if (success) {
        setErrorMessage("");
        alert("Verification email sent! Please check your inbox.");
      } else {
        setErrorMessage("Failed to send verification email. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Failed to send verification email. Please try again.");
    }
  };
  const handleBackToLogin = () => {
    router.push("/login");
  };
  if (verificationStatus === "verifying") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 bg-background">
        <Card className="w-full container mx-auto max-w-md">
          <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="text-center space-y-2 sm:space-y-3">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-2xl">⏳</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                Verifying Email
              </h1>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                Please wait while we verify your email address...
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }
  if (verificationStatus === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 bg-background">
        <Card className="w-full container mx-auto max-w-md">
          <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="text-center space-y-2 sm:space-y-3">
              <div className="w-16 h-16 mx-auto bg-success/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                Email Verified!
              </h1>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                Your email has been successfully verified. Redirecting to
                profile setup...
              </p>
            </div>
            <div className="space-y-3">
              <Button
                onClick={() => router.push("/profile-setup")}
                variant={ButtonVariant.PRIMARY}
                size={ButtonSize.MD}
                className="w-full"
              >
                Continue to Profile Setup
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }
  if (verificationStatus === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 bg-background">
        <Card className="w-full container mx-auto max-w-md">
          <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="text-center space-y-2 sm:space-y-3">
              <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">❌</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                Verification Failed
              </h1>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                {errorMessage ||
                  "The verification link is invalid or has expired."}
              </p>
            </div>
            <div className="space-y-3">
              <Button
                onClick={handleResendVerification}
                variant={ButtonVariant.PRIMARY}
                size={ButtonSize.MD}
                className="w-full"
              >
                Resend Verification Email
              </Button>
              <Button
                onClick={handleBackToLogin}
                variant={ButtonVariant.SECONDARY}
                size={ButtonSize.MD}
                className="w-full"
              >
                Back to Login
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 bg-background">
      <Card className="w-full container mx-auto max-w-md">
        <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
          <div className="text-center space-y-2 sm:space-y-3">
            <div className="w-16 h-16 mx-auto bg-info/10 rounded-full flex items-center justify-center">
              <span className="text-2xl">✉️</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
              Email Verification Required
            </h1>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
              Please check your email and click the verification link to
              continue.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-info-subtle border border-info/20">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-info text-lg">💡</span>
                <p className="text-sm font-medium text-info">
                  What to do next:
                </p>
              </div>
              <ul className="text-xs sm:text-sm text-info space-y-1 ml-6">
                <li>• Check your email inbox</li>
                <li>• Look for an email from LoopIt</li>
                <li>• Click the verification link</li>
                <li>• Complete your profile setup</li>
              </ul>
            </div>
          </div>
          <div className="space-y-3">
            <Button
              onClick={handleResendVerification}
              variant={ButtonVariant.PRIMARY}
              size={ButtonSize.MD}
              className="w-full"
            >
              Resend Verification Email
            </Button>
            <Button
              onClick={handleBackToLogin}
              variant={ButtonVariant.SECONDARY}
              size={ButtonSize.MD}
              className="w-full"
            >
              Back to Login
            </Button>
          </div>
          <div className="text-center pt-2 sm:pt-4 border-t border-border">
            <p className="text-xs sm:text-sm text-text-muted">
              Didn&apos;t receive the email? Check your spam folder or{" "}
              <button
                type="button"
                onClick={handleResendVerification}
                className="font-medium text-primary hover:text-primary-hover transition-colors underline"
              >
                request a new one
              </button>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
const EmailVerificationPage: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 bg-background">
          <Card className="w-full container mx-auto max-w-md">
            <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
              <div className="text-center space-y-2 sm:space-y-3">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-2xl">⏳</span>
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                  Loading...
                </h1>
                <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                  Please wait while we load the email verification page...
                </p>
              </div>
            </div>
          </Card>
        </div>
      }
    >
      <EmailVerificationContent />
    </Suspense>
  );
};
export default EmailVerificationPage;
