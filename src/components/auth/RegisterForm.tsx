"use client";
import { getDemoEmails } from "@/data";
import { useEmailVerification } from "@/hooks/useEmailVerification";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { RegisterFormData, ValidationErrors } from "@/shared/types";
import { UserRole } from "@/shared/types";
import { useLoopItStore } from "@/store";
import Button, {
  ButtonSize,
  ButtonVariant,
} from "@/tailwind/components/elements/Button";
import Card from "@/tailwind/components/layout/Card";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
const RegisterForm: React.FC = React.memo(() => {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useLoopItStore();
  const {
    sendVerificationEmail: sendEmailVerification,
    isSending: isSendingVerification,
  } = useEmailVerification();
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    agreedToTerms: false,
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [registrationStep, setRegistrationStep] = useState<
    "form" | "verification"
  >("form");
  const [savedEmail, setSavedEmail] = useLocalStorage<string>("LAST_LOGIN", "");
  const [savedName, setSavedName] = useLocalStorage<string>(
    "USER_PREFERENCES",
    ""
  );
  useEffect(() => {
    if (savedEmail && savedName) {
      setFormData((prev) => ({
        ...prev,
        email: savedEmail,
        name: savedName,
      }));
    }
  }, [savedEmail, savedName]);
  const validateForm = useMemo(() => {
    return (data: RegisterFormData): ValidationErrors => {
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
  }, []);
  const isFormValid = React.useMemo(() => {
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.location.trim() ||
      !formData.agreedToTerms
    ) {
      return false;
    }
    const currentErrors = validateForm(formData);
    return Object.keys(currentErrors).length === 0;
  }, [formData, validateForm]);
  const handleInputChange = (
    field: keyof RegisterFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (validationErrors?.[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (error) {
      clearError();
    }
  };
  const handleSocialRegistration = async (provider: "google" | "apple") => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log(`${provider} registration clicked`);
    } catch (error) {
      console.error(`${provider} registration failed:`, error);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm(formData);
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }
    try {
      const { acceptTermsAndPrivacy } = useLoopItStore.getState();
      acceptTermsAndPrivacy();
      const verificationSent = await sendEmailVerification(formData.email);
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
        name: formData.name,
        email: formData.email,
        location: formData.location,
        role: UserRole.USER,
        avatar: undefined,
        bio: undefined,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        agreedToTerms: formData.agreedToTerms,
      });
      setSavedEmail(formData.email);
      setSavedName(formData.name);
      router.push("/profile-setup");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };
  const handleResendVerification = async () => {
    try {
      await sendEmailVerification(formData.email);
    } catch (error) {
      console.error("Failed to resend verification email:", error);
    }
  };
  if (registrationStep === "verification") {
    return (
      <div className="min-h-screen flex items-center justify-center px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 bg-background">
        <Card className="w-full max-w-md mx-auto">
          <div className="p-4 sm:p-5 lg:p-6 space-y-4 sm:space-y-5">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto bg-success/10 rounded-full flex items-center justify-center">
                <span className="text-xl">✉️</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                Check Your Email
              </h1>
              <p className="text-sm text-text-secondary leading-relaxed">
                We&apos;ve sent a verification link to{" "}
                <strong>{formData.email}</strong>
              </p>
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-info-subtle border border-info/20">
                <p className="text-xs text-info">
                  Click the link in your email to verify your account and
                  complete registration.
                </p>
              </div>
              <div className="space-y-2">
                <Button
                  onClick={handleVerificationComplete}
                  isLoading={isLoading}
                  disabled={isLoading}
                  variant={ButtonVariant.PRIMARY}
                  size={ButtonSize.MD}
                  className="w-full"
                >
                  I&apos;ve Verified My Email
                </Button>
                <Button
                  onClick={handleResendVerification}
                  isLoading={isSendingVerification}
                  disabled={isSendingVerification}
                  variant={ButtonVariant.SECONDARY}
                  size={ButtonSize.MD}
                  className="w-full"
                >
                  Resend Verification Email
                </Button>
                <Button
                  onClick={() => setRegistrationStep("form")}
                  variant={ButtonVariant.SECONDARY}
                  size={ButtonSize.SM}
                  className="w-full"
                >
                  Back to Registration
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex items-center justify-center px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 bg-background">
      <Card className="w-full max-w-lg mx-auto">
        <div className="p-4 sm:p-5 lg:p-6 space-y-4 sm:space-y-5">
          <div className="text-center space-y-2">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              Join LoopIt
            </h1>
            <p className="text-sm text-text-secondary leading-relaxed">
              Start swapping with your community today
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
                onClick={() => handleSocialRegistration("google")}
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
                onClick={() => handleSocialRegistration("apple")}
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
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm ${
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
                  {validationErrors?.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-primary"
              >
                Email Address
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
                  placeholder="Enter your email address"
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
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm ${
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
                  {validationErrors?.password}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-text-primary"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-text-muted text-base">🔐</span>
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm ${
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
                  {validationErrors?.confirmPassword}
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
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm ${
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
                  {validationErrors?.location}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <input
                  id="agreedToTerms"
                  type="checkbox"
                  checked={formData.agreedToTerms}
                  onChange={(e) =>
                    handleInputChange("agreedToTerms", e.target.checked)
                  }
                  className="mt-1 h-4 w-4 text-primary focus:ring-primary border-border rounded"
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
                  {validationErrors?.agreedToTerms}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full min-h-[44px] text-sm"
              isLoading={isLoading}
              disabled={isLoading || !isFormValid}
              variant={ButtonVariant.PRIMARY}
              size={ButtonSize.MD}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          {showTermsModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-background rounded-lg p-4 max-w-lg w-full max-h-[80vh] overflow-y-auto">
                <h3 className="text-base font-semibold text-foreground mb-3">
                  Terms of Service
                </h3>
                <div className="text-xs text-text-secondary space-y-3">
                  <p>By using LoopIt, you agree to these terms of service...</p>
                </div>
                <Button
                  onClick={() => setShowTermsModal(false)}
                  variant={ButtonVariant.PRIMARY}
                  size={ButtonSize.SM}
                  className="mt-3"
                >
                  I Understand
                </Button>
              </div>
            </div>
          )}

          {showPrivacyModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-background rounded-lg p-4 max-w-lg w-full max-h-[80vh] overflow-y-auto">
                <h3 className="text-base font-semibold text-foreground mb-3">
                  Privacy Policy
                </h3>
                <div className="text-xs text-text-secondary space-y-3">
                  <p>
                    Your privacy is important to us. This policy describes how
                    we collect and use your information...
                  </p>
                </div>
                <Button
                  onClick={() => setShowPrivacyModal(false)}
                  variant={ButtonVariant.PRIMARY}
                  size={ButtonSize.SM}
                  className="mt-3"
                >
                  I Understand
                </Button>
              </div>
            </div>
          )}

          <div className="p-3 rounded-lg bg-success-subtle border border-success/20">
            <div className="space-y-2">
              <div className="text-center">
                <p className="text-xs font-medium text-success">
                  🚀 Try Before You Register
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-success leading-relaxed">
                  Want to explore LoopIt first? Use any of our demo accounts:
                </p>
                <div className="mt-2 flex flex-wrap justify-center gap-1 text-xs">
                  {getDemoEmails().map((email, index) => (
                    <span
                      key={index}
                      className="bg-success/10 px-2 py-1 rounded text-success font-medium"
                    >
                      {email}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-success mt-2 opacity-75">
                  All demo accounts use password: <strong>demo1234</strong>
                </p>
              </div>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="text-xs font-medium text-success hover:text-success/80 transition-colors underline"
                  disabled={isLoading}
                >
                  Go to Login Page →
                </button>
              </div>
            </div>
          </div>

          <div className="text-center pt-3 border-t border-border">
            <p className="text-xs text-text-secondary">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="font-medium text-primary hover:text-primary-hover transition-colors underline"
                disabled={isLoading}
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
});
RegisterForm.displayName = "RegisterForm";
export default RegisterForm;
