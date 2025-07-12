"use client";
import { useAuthModal } from "@/components/auth/AuthModalContext";
import { usePasswordReset } from "@/hooks/usePasswordReset";
import { useLoopItStore } from "@/store";
import Button, {
  ButtonSize,
  ButtonVariant,
} from "@/tailwind/components/elements/Button";
import Card from "@/tailwind/components/layout/Card";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

const PasswordResetContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { validateResetToken, resetPassword, isResetting } = usePasswordReset();
  const { validatePasswordResetToken } = useLoopItStore();
  const { openLogin } = useAuthModal();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [validationErrors, setValidationErrors] = useState<{
    password?: string;
    confirmPassword?: string;
    token?: string;
  }>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (token) {
      const valid = validatePasswordResetToken(token);
      setIsTokenValid(valid);
      if (!valid) {
        setValidationErrors({ token: "Invalid or expired reset token" });
      }
    } else {
      setIsTokenValid(false);
      setValidationErrors({ token: "No reset token provided" });
    }
  }, [token, validatePasswordResetToken]);

  const validateForm = () => {
    const errors: typeof validationErrors = {};
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password =
        "Password must contain uppercase, lowercase, and number";
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !token || !isTokenValid) {
      return;
    }
    try {
      const success = await resetPassword(token, formData.password);
      if (success) {
        openLogin();
      } else {
        setValidationErrors({
          token: "Password reset failed. Please try again.",
        });
      }
    } catch (error) {
      console.error("Password reset failed:", error);
      setValidationErrors({
        token: "Password reset failed. Please try again.",
      });
    }
  };

  const isFormValid =
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword &&
    formData.password.length >= 8 &&
    /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password);

  if (isTokenValid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 bg-background">
        <Card className="w-full container mx-auto max-w-md">
          <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="text-center space-y-2 sm:space-y-3">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                Validating Reset Token
              </h1>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                Please wait while we verify your reset token...
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!isTokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 bg-background">
        <Card className="w-full container mx-auto max-w-md">
          <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="text-center space-y-2 sm:space-y-3">
              <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">❌</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                Invalid Reset Token
              </h1>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                {validationErrors?.token ||
                  "The password reset link is invalid or has expired."}
              </p>
            </div>
            <div className="space-y-3">
              <Button
                onClick={openLogin}
                variant={ButtonVariant.PRIMARY}
                size={ButtonSize.MD}
                className="w-full"
              >
                Return to Login
              </Button>
              <Button
                onClick={openLogin}
                variant={ButtonVariant.SECONDARY}
                size={ButtonSize.MD}
                className="w-full"
              >
                Request New Reset Link
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
            <div className="w-16 h-16 mx-auto bg-success/10 rounded-full flex items-center justify-center">
              <span className="text-2xl">🔐</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
              Reset Your Password
            </h1>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
              Enter your new password below
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="space-y-4 sm:space-y-5 lg:space-y-6"
          >
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm sm:text-base font-medium text-text-primary"
              >
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <span className="text-text-muted text-base sm:text-lg">
                    🔒
                  </span>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className={`block w-full pl-10 sm:pl-12 pr-12 sm:pr-14 py-3 sm:py-4 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm sm:text-base ${
                    validationErrors?.password
                      ? "border-destructive bg-destructive-subtle"
                      : "border-border hover:border-border-hover bg-background"
                  }`}
                  placeholder="Enter your new password"
                  disabled={isResetting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-text-muted hover:text-text-primary transition-colors min-w-[44px] sm:min-w-[48px] justify-center"
                  disabled={isResetting}
                >
                  <span className="text-base sm:text-lg">
                    {showPassword ? "🙈" : "👁️"}
                  </span>
                </button>
              </div>
              {validationErrors?.password && (
                <p className="text-sm text-destructive flex items-center gap-1 sm:gap-2">
                  <span>❌</span> {validationErrors?.password}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm sm:text-base font-medium text-text-primary"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <span className="text-text-muted text-base sm:text-lg">
                    🔐
                  </span>
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  className={`block w-full pl-10 sm:pl-12 pr-12 sm:pr-14 py-3 sm:py-4 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm sm:text-base ${
                    validationErrors?.confirmPassword
                      ? "border-destructive bg-destructive-subtle"
                      : "border-border hover:border-border-hover bg-background"
                  }`}
                  placeholder="Confirm your new password"
                  disabled={isResetting}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-text-muted hover:text-text-primary transition-colors min-w-[44px] sm:min-w-[48px] justify-center"
                  disabled={isResetting}
                >
                  <span className="text-base sm:text-lg">
                    {showConfirmPassword ? "🙈" : "👁️"}
                  </span>
                </button>
              </div>
              {validationErrors?.confirmPassword && (
                <p className="text-sm text-destructive flex items-center gap-1 sm:gap-2">
                  <span>❌</span> {validationErrors?.confirmPassword}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full min-h-[44px] sm:min-h-[48px] text-sm sm:text-base lg:text-lg"
              isLoading={isResetting}
              disabled={isResetting || !isFormValid}
              variant={ButtonVariant.PRIMARY}
              size={ButtonSize.MD}
            >
              {isResetting ? "Resetting Password..." : "Reset Password"}
            </Button>
          </form>
          <div className="text-center pt-2 sm:pt-4 border-t border-border">
            <p className="text-xs sm:text-sm text-text-secondary">
              Remember your password?{" "}
              <button
                type="button"
                onClick={openLogin}
                className="font-medium text-primary hover:text-primary-hover transition-colors underline"
                disabled={isResetting}
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

const PasswordResetPage: React.FC = () => {
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
                  Please wait while we load the password reset page...
                </p>
              </div>
            </div>
          </Card>
        </div>
      }
    >
      <PasswordResetContent />
    </Suspense>
  );
};

export default PasswordResetPage;
