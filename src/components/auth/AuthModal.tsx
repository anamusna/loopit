"use client";

import { getDemoEmails, isDemoAccount } from "@/data/users";
import { sanitizeEmail } from "@/helpers/validation";
import { useEmailVerification } from "@/hooks/useEmailVerification";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { usePasswordReset } from "@/hooks/usePasswordReset";
import type {
  AuthValidationErrors,
  LoginFormData,
  RegisterFormData,
  ValidationErrors,
} from "@/shared/types";
import { UserRole } from "@/shared/types";
import { useLoopItStore } from "@/store";
import Button, {
  ButtonSize,
  ButtonVariant,
} from "@/tailwind/components/elements/Button";
import Modal, { ModalSize } from "@/tailwind/components/layout/Modal";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

export enum AuthMode {
  LOGIN = "login",
  REGISTER = "register",
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: AuthMode;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode,
}) => {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const { login, register, isLoading, error, clearError } = useLoopItStore();
  const { sendVerificationEmail, isSending: isSendingVerification } =
    useEmailVerification();
  const { requestPasswordReset, isSending: isResettingPassword } =
    usePasswordReset();

  // Common state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  // Storage hooks
  const [savedEmail, setSavedEmail] = useLocalStorage<string>("LAST_LOGIN", "");
  const [rememberMeSetting, setRememberMeSetting] = useLocalStorage<boolean>(
    "REMEMBER_ME",
    false
  );
  const [savedName, setSavedName] = useLocalStorage<string>(
    "USER_PREFERENCES",
    ""
  );

  // Form data state
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    agreedToTerms: false,
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>();
  const [registrationStep, setRegistrationStep] = useState<
    "form" | "verification"
  >("form");

  // Effect to load saved credentials
  useEffect(() => {
    if (mode === AuthMode.LOGIN && rememberMeSetting && savedEmail) {
      setLoginData((prev) => ({ ...prev, email: savedEmail }));
    } else if (mode === AuthMode.REGISTER && savedEmail && savedName) {
      setRegisterData((prev) => ({
        ...prev,
        email: savedEmail,
        name: savedName,
      }));
    }
  }, [mode, rememberMeSetting, savedEmail, savedName]);

  // Effect to update mode when initialMode prop changes
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Effect to reset form data when mode changes
  useEffect(() => {
    if (mode === AuthMode.LOGIN) {
      setLoginData({ email: "", password: "" });
      setValidationErrors(undefined);
    } else if (mode === AuthMode.REGISTER) {
      setRegisterData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        location: "",
        agreedToTerms: false,
      });
      setValidationErrors(undefined);
    }
  }, [mode]);

  // Validation functions
  const validateLoginForm = (data: LoginFormData): AuthValidationErrors => {
    const errors: AuthValidationErrors = {};
    if (!data.email.trim()) {
      errors.email = "Email is required";
    } else if (!isDemoAccount(data.email)) {
      errors.email = "Please use one of the demo accounts listed below";
    }
    if (!data.password) {
      errors.password = "Password is required";
    }
    return errors;
  };

  const validateRegisterForm = (data: RegisterFormData): ValidationErrors => {
    const errors: ValidationErrors = {};
    if (!data.name.trim()) {
      errors.name = "Full name is required";
    } else if (data.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }
    if (!data.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!data.password) {
      errors.password = "Password is required";
    } else if (data.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.password)) {
      errors.password =
        "Password must contain uppercase, lowercase, and number";
    }
    if (!data.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (data.password !== data.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (!data.location.trim()) {
      errors.location = "Location is required";
    }
    if (!data.agreedToTerms) {
      errors.agreedToTerms = "You must agree to the terms and conditions";
    }
    return errors;
  };

  // Form validity checks
  const isLoginFormValid = useMemo(() => {
    if (!loginData.email.trim() || !loginData.password) {
      return false;
    }
    return isDemoAccount(loginData.email);
  }, [loginData]);

  const isRegisterFormValid = useMemo(() => {
    if (
      !registerData.name.trim() ||
      !registerData.email.trim() ||
      !registerData.password ||
      !registerData.confirmPassword ||
      !registerData.location.trim() ||
      !registerData.agreedToTerms
    ) {
      return false;
    }
    const errors = validateRegisterForm(registerData);
    return Object.keys(errors).length === 0;
  }, [registerData]);

  // Handler functions
  const handleLoginInputChange = (
    field: keyof LoginFormData,
    value: string
  ) => {
    const sanitizedValue = field === "email" ? sanitizeEmail(value) : value;
    setLoginData((prev) => ({ ...prev, [field]: sanitizedValue }));
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

  const handleRegisterInputChange = (
    field: keyof RegisterFormData,
    value: string | boolean
  ) => {
    setRegisterData((prev) => ({ ...prev, [field]: value }));
    if (validationErrors?.[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (error) {
      clearError();
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDemoAccount(loginData.email)) {
      setValidationErrors({
        email: "Please use one of the demo accounts listed below",
      });
      return;
    }
    try {
      await login({
        email: loginData.email,
        password: loginData.password,
      });
      if (rememberMeSetting) {
        setSavedEmail(loginData.email);
      } else {
        setSavedEmail("");
        setRememberMeSetting(false);
      }
      onClose();
      router.push("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateRegisterForm(registerData);
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }
    try {
      const verificationSent = await sendVerificationEmail(registerData.email);
      if (verificationSent) {
        setRegistrationStep("verification");
      } else {
        throw new Error("Failed to send verification email");
      }
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  const handleVerificationComplete = async () => {
    try {
      await register({
        ...registerData,
        role: UserRole.USER,
        avatar: undefined,
        bio: undefined,
      });
      setSavedEmail(registerData.email);
      setSavedName(registerData.name);
      onClose();
      router.push("/profile-setup");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email.trim()) {
      setValidationErrors({ email: "Please enter your email address" });
      return;
    }
    try {
      const success = await requestPasswordReset(loginData.email);
      if (success) {
        setShowPasswordReset(false);
      }
    } catch (error) {
      console.error("Password reset failed:", error);
    }
  };

  const handleSocialAuth = async (provider: "google" | "apple") => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log(`${provider} ${mode} clicked`);
    } catch (error) {
      console.error(`${provider} ${mode} failed:`, error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={ModalSize.MD}
      title={mode === AuthMode.LOGIN ? "Welcome Back" : "Join LoopIt"}
      subtitle={
        mode === AuthMode.LOGIN
          ? "Sign in with a demo account to explore LoopIt"
          : "Start swapping with your community today"
      }
    >
      <div className="space-y-4 sm:space-y-6">
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive-subtle border border-destructive/20">
            <span className="text-destructive text-lg">⚠️</span>
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <Button
            type="button"
            onClick={() => handleSocialAuth("google")}
            disabled={isLoading}
            variant={ButtonVariant.SECONDARY}
            size={ButtonSize.SM}
            className="flex items-center justify-center gap-2 text-xs sm:text-sm"
          >
            <span className="text-sm sm:text-base">🔍</span>
            <span className="hidden sm:inline">Google</span>
          </Button>
          <Button
            type="button"
            onClick={() => handleSocialAuth("apple")}
            disabled={isLoading}
            variant={ButtonVariant.SECONDARY}
            size={ButtonSize.SM}
            className="flex items-center justify-center gap-2 text-xs sm:text-sm"
          >
            <span className="text-sm sm:text-base">🍎</span>
            <span className="hidden sm:inline">Apple</span>
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-2 text-text-muted">
              Or continue with email
            </span>
          </div>
        </div>

        {mode === AuthMode.LOGIN ? (
          <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
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
                  value={loginData.email}
                  onChange={(e) =>
                    handleLoginInputChange("email", e.target.value)
                  }
                  className={`block w-full pl-10 pr-3 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm ${
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
                  {validationErrors.email}
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
                  value={loginData.password}
                  onChange={(e) =>
                    handleLoginInputChange("password", e.target.value)
                  }
                  className={`block w-full pl-10 pr-12 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm ${
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

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
              <div className="flex items-center space-x-2">
                <input
                  id="rememberMe"
                  type="checkbox"
                  checked={rememberMeSetting}
                  onChange={(e) => setRememberMeSetting(e.target.checked)}
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
                className="text-xs text-primary hover:text-primary-hover transition-colors underline self-start sm:self-auto"
                disabled={isLoading}
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading || !isLoginFormValid}
              variant={ButtonVariant.PRIMARY}
              size={ButtonSize.MD}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>

            <div className="text-center">
              <p className="text-xs text-text-secondary">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode(AuthMode.REGISTER)}
                  className="font-medium text-primary hover:text-primary-hover transition-colors underline"
                  disabled={isLoading}
                >
                  Register here
                </button>
              </p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-text-primary"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-text-muted text-base">👤</span>
                </div>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={registerData.name}
                  onChange={(e) =>
                    handleRegisterInputChange("name", e.target.value)
                  }
                  className={`block w-full pl-10 pr-3 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm ${
                    validationErrors?.name
                      ? "border-destructive bg-destructive-subtle"
                      : "border-border hover:border-border-hover bg-background"
                  }`}
                  placeholder="Enter your full name"
                  disabled={isLoading}
                />
              </div>
              {validationErrors?.name && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <span>❌</span>
                  {validationErrors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="register-email"
                className="block text-sm font-medium text-text-primary"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-text-muted text-base">✉️</span>
                </div>
                <input
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  value={registerData.email}
                  onChange={(e) =>
                    handleRegisterInputChange("email", e.target.value)
                  }
                  className={`block w-full pl-10 pr-3 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm ${
                    validationErrors?.email
                      ? "border-destructive bg-destructive-subtle"
                      : "border-border hover:border-border-hover bg-background"
                  }`}
                  placeholder="Enter your email address"
                  disabled={isLoading}
                />
              </div>
              {validationErrors?.email && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <span>❌</span>
                  {validationErrors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="register-password"
                className="block text-sm font-medium text-text-primary"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-text-muted text-base">🔒</span>
                </div>
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={registerData.password}
                  onChange={(e) =>
                    handleRegisterInputChange("password", e.target.value)
                  }
                  className={`block w-full pl-10 pr-12 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm ${
                    validationErrors?.password
                      ? "border-destructive bg-destructive-subtle"
                      : "border-border hover:border-border-hover bg-background"
                  }`}
                  placeholder="Create a strong password"
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

            <div className="space-y-2">
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-text-primary"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-text-muted text-base">🔐</span>
                </div>
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={registerData.confirmPassword}
                  onChange={(e) =>
                    handleRegisterInputChange("confirmPassword", e.target.value)
                  }
                  className={`block w-full pl-10 pr-12 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm ${
                    validationErrors?.confirmPassword
                      ? "border-destructive bg-destructive-subtle"
                      : "border-border hover:border-border-hover bg-background"
                  }`}
                  placeholder="Confirm your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-primary transition-colors min-w-[44px] justify-center"
                  disabled={isLoading}
                >
                  <span className="text-base">
                    {showConfirmPassword ? "🙈" : "👁️"}
                  </span>
                </button>
              </div>
              {validationErrors?.confirmPassword && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <span>❌</span>
                  {validationErrors.confirmPassword}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="location"
                className="block text-sm font-medium text-text-primary"
              >
                Location
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-text-muted text-base">📍</span>
                </div>
                <input
                  id="location"
                  type="text"
                  autoComplete="address-level2"
                  value={registerData.location}
                  onChange={(e) =>
                    handleRegisterInputChange("location", e.target.value)
                  }
                  className={`block w-full pl-10 pr-3 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm ${
                    validationErrors?.location
                      ? "border-destructive bg-destructive-subtle"
                      : "border-border hover:border-border-hover bg-background"
                  }`}
                  placeholder="e.g., Banjul, Serrekunda, Brikama"
                  disabled={isLoading}
                />
              </div>
              {validationErrors?.location && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <span>❌</span>
                  {validationErrors.location}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <input
                  id="agreedToTerms"
                  type="checkbox"
                  checked={registerData.agreedToTerms}
                  onChange={(e) =>
                    handleRegisterInputChange("agreedToTerms", e.target.checked)
                  }
                  className="mt-1 h-4 w-4 text-primary focus:ring-primary border-border rounded flex-shrink-0"
                  disabled={isLoading}
                />
                <label
                  htmlFor="agreedToTerms"
                  className="text-xs text-text-secondary leading-relaxed cursor-pointer"
                >
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => window.open("/terms", "_blank")}
                    className="text-primary hover:text-primary-hover underline"
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    onClick={() => window.open("/privacy", "_blank")}
                    className="text-primary hover:text-primary-hover underline"
                  >
                    Privacy Policy
                  </button>
                </label>
              </div>
              {validationErrors?.agreedToTerms && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <span>❌</span>
                  {validationErrors.agreedToTerms}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading || !isRegisterFormValid}
              variant={ButtonVariant.PRIMARY}
              size={ButtonSize.MD}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>

            <div className="text-center">
              <p className="text-xs text-text-secondary">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode(AuthMode.LOGIN)}
                  className="font-medium text-primary hover:text-primary-hover transition-colors underline"
                  disabled={isLoading}
                >
                  Sign in here
                </button>
              </p>
            </div>
          </form>
        )}

        {mode === AuthMode.LOGIN && (
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
                    onClick={() => handleLoginInputChange("email", email)}
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
        )}

        {showPasswordReset && (
          <Modal
            isOpen={showPasswordReset}
            onClose={() => setShowPasswordReset(false)}
            size={ModalSize.SM}
            title="Reset Password"
            subtitle="Enter your email address and we'll send you a link to reset your password."
          >
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="resetEmail"
                  className="block text-sm font-medium text-text-primary"
                >
                  Email Address
                </label>
                <input
                  id="resetEmail"
                  type="email"
                  value={loginData.email}
                  onChange={(e) =>
                    handleLoginInputChange("email", e.target.value)
                  }
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
                  disabled={isResettingPassword || !loginData.email.trim()}
                  variant={ButtonVariant.PRIMARY}
                  size={ButtonSize.SM}
                  className="flex-1"
                >
                  Send Reset Link
                </Button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </Modal>
  );
};

export default AuthModal;
