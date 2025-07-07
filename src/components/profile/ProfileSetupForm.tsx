"use client";
import { useProfile } from "@/hooks/useProfile";
import type {
  ProfileSetupFormData,
  ProfileSetupValidationErrors,
} from "@/shared/types";
import { useLoopItStore } from "@/store";
import Button, {
  ButtonSize,
  ButtonVariant,
} from "@/tailwind/components/elements/Button";
import Card from "@/tailwind/components/layout/Card";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import LocationInput from "./LocationInput";
import ProfilePhotoUpload from "./ProfilePhotoUpload";
const ProfileSetupForm: React.FC = React.memo(() => {
  const router = useRouter();
  const { user, setupProfile, isLoading, error, clearError } = useProfile();
  const [formData, setFormData] = useState<ProfileSetupFormData>({
    name: user?.name || "",
    location: user?.location || "",
    bio: user?.bio || "",
    profilePhoto: user?.avatar || "",
  });
  const [validationErrors, setValidationErrors] =
    useState<ProfileSetupValidationErrors>({});
  const [photoError, setPhotoError] = useState<string>("");
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        location: user.location || "",
        bio: user.bio || "",
        profilePhoto: user.avatar || "",
      });
    }
  }, [user]);
  const validateForm = useMemo(() => {
    return (data: ProfileSetupFormData): ProfileSetupValidationErrors => {
      const errors: ProfileSetupValidationErrors = {};
      if (!data.name.trim()) {
        errors.name = "Name is required";
      } else if (data.name.trim().length < 2) {
        errors.name = "Name must be at least 2 characters";
      } else if (data.name.trim().length > 50) {
        errors.name = "Name must be less than 50 characters";
      }
      if (!data.location.trim()) {
        errors.location = "Location is required";
      }
      if (data.bio && data.bio.length > 150) {
        errors.bio = "Bio must be less than 150 characters";
      }
      return errors;
    };
  }, []);
  const isFormValid = useMemo(() => {
    if (!formData.name.trim() || !formData.location.trim()) return false;
    const currentErrors = validateForm(formData);
    return Object.keys(currentErrors).length === 0;
  }, [formData, validateForm]);
  const handleInputChange = useCallback(
    (field: keyof ProfileSetupFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (
        field in validationErrors &&
        validationErrors[field as keyof ProfileSetupValidationErrors]
      ) {
        setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
      }
      if (error) clearError();
    },
    [validationErrors, error, clearError]
  );
  const handlePhotoChange = useCallback((photoUrl: string) => {
    setFormData((prev) => ({ ...prev, profilePhoto: photoUrl }));
    setPhotoError("");
  }, []);
  const handlePhotoError = useCallback((error: string) => {
    setPhotoError(error);
  }, []);
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const errors = validateForm(formData);
      setValidationErrors(errors);
      if (Object.keys(errors).length > 0) return;
      try {
        await setupProfile(formData);
        const { completeProfileSetup } = useLoopItStore.getState();
        await completeProfileSetup();
        router.push("/dashboard");
      } catch (err) {
        console.error("Profile setup failed:", err);
      }
    },
    [formData, validateForm, setupProfile, router]
  );
  const handleSkip = useCallback(() => {
    router.push("/dashboard");
  }, [router]);
  const skipButtonText = "Skip for Now";
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 bg-background">
      <Card className="w-full container">
        <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
          <div className="text-center space-y-2 sm:space-y-3">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
              Complete Your Profile
            </h1>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
              Tell us a bit about yourself to get started with LoopIt
            </p>
            {user && (
              <div className="text-xs sm:text-sm text-text-muted mt-2 leading-relaxed">
                Welcome back, {user.email}! Let&apos;s complete your profile.
              </div>
            )}
          </div>
          {error && (
            <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg bg-destructive-subtle border border-destructive/20">
              <span className="text-destructive text-lg sm:text-xl">⚠️</span>
              <p className="text-sm sm:text-base text-destructive">{error}</p>
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 sm:space-y-6 lg:space-y-8"
          >
            <div className="space-y-2">
              <label className="block text-sm sm:text-base font-medium text-text-primary">
                Profile Photo (Optional)
              </label>
              <ProfilePhotoUpload
                currentPhoto={formData.profilePhoto as string}
                onPhotoChange={handlePhotoChange}
                onError={handlePhotoError}
                disabled={isLoading}
              />
              {photoError && (
                <p className="text-sm text-destructive flex items-center gap-1 sm:gap-2">
                  <span>❌</span> {photoError}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm sm:text-base font-medium text-text-primary"
              >
                Full Name <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <span className="text-text-muted text-base sm:text-lg">
                    👤
                  </span>
                </div>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`block w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm sm:text-base ${
                    validationErrors.name
                      ? "border-destructive bg-destructive-subtle"
                      : "border-border hover:border-border-hover bg-background"
                  }`}
                  placeholder="Enter your full name"
                  disabled={isLoading}
                  maxLength={50}
                />
              </div>
              {validationErrors.name && (
                <p className="text-sm text-destructive flex items-center gap-1 sm:gap-2">
                  <span>❌</span> {validationErrors.name}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="location"
                className="block text-sm sm:text-base font-medium text-text-primary"
              >
                Location <span className="text-destructive">*</span>
              </label>
              <LocationInput
                value={formData.location}
                onChange={(value) => handleInputChange("location", value)}
                hasError={!!validationErrors.location}
                disabled={isLoading}
                placeholder="e.g., Banjul, Serrekunda, Brikama"
                className="w-full py-3 sm:py-4 text-sm sm:text-base"
                showLocationPermissionButton={true}
                onLocationPermissionRequest={async () => {
                  const { requestLocationPermission } =
                    useLoopItStore.getState();
                  return await requestLocationPermission();
                }}
              />
              {validationErrors.location && (
                <p className="text-sm text-destructive flex items-center gap-1 sm:gap-2">
                  <span>❌</span> {validationErrors.location}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="bio"
                className="block text-sm sm:text-base font-medium text-text-primary"
              >
                Bio (Optional)
              </label>
              <div className="relative">
                <textarea
                  id="bio"
                  value={formData.bio || ""}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  className={`block w-full px-3 sm:px-4 py-3 sm:py-4 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-none text-sm sm:text-base ${
                    validationErrors.bio
                      ? "border-destructive bg-destructive-subtle"
                      : "border-border hover:border-border-hover bg-background"
                  }`}
                  placeholder="Tell us a bit about yourself and what you're interested in swapping..."
                  disabled={isLoading}
                  maxLength={150}
                  rows={3}
                />
                <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 text-xs sm:text-sm text-text-muted">
                  {(formData.bio || "").length}/150
                </div>
              </div>
              {validationErrors.bio && (
                <p className="text-sm text-destructive flex items-center gap-1 sm:gap-2">
                  <span>❌</span> {validationErrors.bio}
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
              <Button
                type="button"
                onClick={handleSkip}
                className="order-2 sm:order-1 min-h-[44px] sm:min-h-[48px] text-sm sm:text-base"
                variant={ButtonVariant.OUTLINE}
                disabled={isLoading}
              >
                {skipButtonText}
              </Button>
              <Button
                type="submit"
                className="order-1 sm:order-2 flex-1 min-h-[44px] sm:min-h-[48px] text-sm sm:text-base"
                isLoading={isLoading}
                disabled={isLoading || !isFormValid}
                variant={ButtonVariant.PRIMARY}
                size={ButtonSize.MD}
              >
                {isLoading ? "Saving Profile..." : "Complete Profile"}
              </Button>
            </div>
          </form>
          {}
          <div className="text-center pt-2 sm:pt-4 border-t border-border">
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              You can always update your profile later in Settings
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
});
ProfileSetupForm.displayName = "ProfileSetupForm";
export default ProfileSetupForm;
