"use client";
import { getDemoEmails, isDemoAccount } from "@/data/users";
import { sanitizeEmail } from "@/helpers/validation";
import { useEmailVerification } from "@/hooks/useEmailVerification";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { usePasswordReset } from "@/hooks/usePasswordReset";
import type { AuthValidationErrors, LoginFormData } from "@/shared/types";
import { useLoopItStore } from "@/store";
import Button, {
  ButtonSize,
  ButtonVariant,
} from "@/tailwind/components/elements/Button";
import Card from "@/tailwind/components/layout/Card";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
const LoginForm: React.FC = React.memo(() => {
  const router = useRouter();
  const { login, isLoading, error, clearError, checkEmailVerification } =
    useLoopItStore();
  const { isEmailVerified } = useEmailVerification();
  const { requestPasswordReset, isSending: isResettingPassword } =
    usePasswordReset();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [validationErrors, setValidationErrors] =
    useState<AuthValidationErrors>();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [savedEmail, setSavedEmail] = useLocalStorage<string>("LAST_LOGIN", "");
  const [rememberMeSetting, setRememberMeSetting] = useLocalStorage<boolean>(
    "REMEMBER_ME",
    false
  );
  useEffect(() => {
    if (rememberMeSetting && savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, [rememberMeSetting, savedEmail]);
  const isFormValid = React.useMemo(() => {
    if (!formData.email.trim() || !formData.password) {
      return false;
    }
    if (!isDemoAccount(formData.email)) {
      return false;
    }
    return true;
  }, [formData]);
  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    const sanitizedValue = field === "email" ? sanitizeEmail(value) : value;
    setFormData((prev) => ({ ...prev, [field]: sanitizedValue }));
    if (field === "email") {
      const isDemo = isDemoAccount(sanitizedValue);
      setValidationErrors((prev) => ({
        ...prev,
        [field]:
          !isDemo && sanitizedValue.length > 0
            ? "Please use one of the demo accounts listed below"
            : undefined,
      }));
    }
    if (error) {
      clearError();
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDemoAccount(formData.email)) {
      setValidationErrors({
        email: "Please use one of the demo accounts listed below",
      });
      return;
    }
    try {
      await login({
        email: formData.email,
        password: formData.password,
      });
      if (rememberMe) {
        setSavedEmail(formData.email);
        setRememberMeSetting(true);
      } else {
        setSavedEmail("");
        setRememberMeSetting(false);
      }
      const destination =
        typeof window !== "undefined"
          ? sessionStorage.getItem("intendedDestination")
          : null;
      if (destination) {
        sessionStorage.removeItem("intendedDestination");
        router.push(destination);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };
  const handleSocialLogin = async (provider: "google" | "apple") => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log(`${provider} login clicked`);
    } catch (error) {
      console.error(`${provider} login failed:`, error);
    }
  };
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      setValidationErrors({ email: "Please enter your email address" });
      return;
    }
    try {
      const success = await requestPasswordReset(resetEmail);
      if (success) {
        setShowPasswordReset(false);
        setResetEmail("");
      }
    } catch (error) {
      console.error("Password reset failed:", error);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 bg-background">
      <Card className="w-full max-w-md mx-auto">
        <div className="p-4 sm:p-5 lg:p-6 space-y-4 sm:space-y-5">
          <div className="text-center space-y-2">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              Welcome Back
            </h1>
            <p className="text-sm text-text-secondary leading-relaxed">
              Sign in with a demo account to explore LoopIt
            </p>
          </div>
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive-subtle border border-destructive/20">
              <span className="text-destructive text-lg">⚠️</span>
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-2 text-text-muted">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                onClick={() => handleSocialLogin("google")}
                disabled={isLoading}
                variant={ButtonVariant.SECONDARY}
                size={ButtonSize.SM}
                className="flex items-center justify-center gap-2"
              >
                <span className="text-base">🔍</span>
                <span className="hidden sm:inline">Google</span>
              </Button>
              <Button
                type="button"
                onClick={() => handleSocialLogin("apple")}
                disabled={isLoading}
                variant={ButtonVariant.SECONDARY}
                size={ButtonSize.SM}
                className="flex items-center justify-center gap-2"
              >
                <span className="text-base">🍎</span>
                <span className="hidden sm:inline">Apple</span>
              </Button>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-primary"
              >
                Demo Account Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-text-muted text-base">✉️</span>
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm ${
                    validationErrors?.email
                      ? "border-destructive bg-destructive-subtle"
                      : "border-border hover:border-border-hover bg-background"
                  }`}
                  placeholder="Select a demo account email"
                  disabled={isLoading}
                />
              </div>
              {validationErrors?.email && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <span>❌</span>
                  {validationErrors?.email}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text-primary"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-text-muted text-base">🔒</span>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm ${
                    validationErrors?.password
                      ? "border-destructive bg-destructive-subtle"
                      : "border-border hover:border-border-hover bg-background"
                  }`}
                  placeholder="Enter demo password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-primary transition-colors min-w-[44px] justify-center"
                  disabled={isLoading}
                >
                  <span className="text-base">
                    {showPassword ? "🙈" : "👁️"}
                  </span>
                </button>
              </div>
              {validationErrors?.password && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <span>❌</span>
                  {validationErrors.password}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  id="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                  disabled={isLoading}
                />
                <label
                  htmlFor="rememberMe"
                  className="text-xs text-text-secondary cursor-pointer"
                >
                  Remember me
                </label>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordReset(true)}
                className="text-xs text-primary hover:text-primary-hover transition-colors underline"
                disabled={isLoading}
              >
                Forgot password?
              </button>
            </div>
            <Button
              type="submit"
              className="w-full min-h-[44px] text-sm"
              isLoading={isLoading}
              disabled={isLoading || !isFormValid}
              variant={ButtonVariant.PRIMARY}
              size={ButtonSize.MD}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          {showPasswordReset && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-background rounded-lg p-4 max-w-sm w-full space-y-4">
                <h3 className="text-base font-semibold text-foreground">
                  Reset Password
                </h3>
                <p className="text-xs text-text-secondary">
                  Enter your email address and we&apos;ll send you a link to
                  reset your password.
                </p>
                <form onSubmit={handlePasswordReset} className="space-y-3">
                  <div>
                    <label
                      htmlFor="resetEmail"
                      className="block text-xs font-medium text-text-primary mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      id="resetEmail"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="block w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={() => setShowPasswordReset(false)}
                      variant={ButtonVariant.SECONDARY}
                      size={ButtonSize.SM}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      isLoading={isResettingPassword}
                      disabled={isResettingPassword || !resetEmail.trim()}
                      variant={ButtonVariant.PRIMARY}
                      size={ButtonSize.SM}
                      className="flex-1"
                    >
                      Send Reset Link
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
          <div className="p-3 rounded-lg bg-info-subtle border border-info/20">
            <div className="space-y-2">
              <div className="text-center">
                <p className="text-xs font-medium text-info">
                  🔐 Available Demo Accounts
                </p>
                <p className="text-xs text-info/80 mt-1">
                  All accounts use password: <strong>demo1234</strong>
                </p>
              </div>
              <div className="grid grid-cols-1 gap-1 text-xs">
                {getDemoEmails().map((email, index) => (
                  <button
                    key={email}
                    type="button"
                    onClick={() => handleInputChange("email", email)}
                    className="bg-background/50 hover:bg-background/80 rounded-lg p-2 text-left transition-colors border border-info/20 hover:border-info/40"
                    disabled={isLoading}
                  >
                    <p className="text-info font-medium truncate">{email}</p>
                    {index === 0 && (
                      <p className="text-xs text-info/70 mt-1">
                        ⭐ Main demo account
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="text-center pt-3 border-t border-border">
            <p className="text-xs text-text-secondary">
              Want to create your own account?{" "}
              <button
                type="button"
                onClick={() => router.push("/register")}
                className="font-medium text-primary hover:text-primary-hover transition-colors underline"
                disabled={isLoading}
              >
                Register here
              </button>
            </p>
            <p className="text-xs text-text-muted mt-1">
              Note: This is a demo app - registration creates temporary accounts
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
});
LoginForm.displayName = "LoginForm";
export default LoginForm;
