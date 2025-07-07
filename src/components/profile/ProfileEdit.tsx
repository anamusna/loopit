"use client";
import { useProfile } from "@/hooks/useProfile";
import type {
  ProfileSetupFormData,
  ProfileSetupValidationErrors,
} from "@/shared/types";
import Badge, { BadgeVariant } from "@/tailwind/components/elements/Badge";
import Button, {
  ButtonSize,
  ButtonVariant,
} from "@/tailwind/components/elements/Button";
import {
  Typography,
  TypographyVariant,
} from "@/tailwind/components/elements/Typography";
import {
  faCheck,
  faGlobe,
  faPhone,
  faPlus,
  faTimes,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import LocationInput from "./LocationInput";
import ProfilePhotoUpload from "./ProfilePhotoUpload";
interface ProfileEditProps {
  onSave?: () => void;
  onCancel?: () => void;
}
const ProfileEdit: React.FC<ProfileEditProps> = React.memo(
  ({ onSave, onCancel }) => {
    const { user, updateProfile, isLoading, error, clearError } = useProfile();
    const [formData, setFormData] = useState<
      ProfileSetupFormData & {
        phone?: string;
        interests: string[];
        website?: string;
      }
    >({
      name: "",
      location: "",
      bio: "",
      interests: [],
      phone: "",
      website: "",
    });
    const [validationErrors, setValidationErrors] =
      useState<ProfileSetupValidationErrors>({});
    const [photoError, setPhotoError] = useState<string>("");
    const [hasChanges, setHasChanges] = useState(false);
    const [newInterest, setNewInterest] = useState("");
    useEffect(() => {
      if (user) {
        const initialData = {
          name: user.name || "",
          location: user.location || "",
          bio: user.bio || "",
          profilePhoto: user.avatar || "",
          phone: user.phone || "",
          interests: user.interests || [],
          website: user.website || "",
        };
        setFormData(initialData);
      }
    }, [user]);
    const validateForm = useMemo(() => {
      return (data: typeof formData): ProfileSetupValidationErrors => {
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
        if (
          data.phone &&
          !/^[\+]?[1-9][\d]{0,15}$/.test(data.phone.replace(/\s/g, ""))
        ) {
          errors.phone = "Please enter a valid phone number";
        }
        if (data.website && !/^https?:\/\/.+/.test(data.website)) {
          errors.website = "Please enter a valid website URL";
        }
        return errors;
      };
    }, []);
    const isFormValid = useMemo(() => {
      if (!formData.name.trim() || !formData.location.trim()) return false;
      const currentErrors = validateForm(formData);
      return Object.keys(currentErrors).length === 0;
    }, [formData, validateForm]);
    useEffect(() => {
      if (user) {
        const hasFormChanges =
          formData.name !== (user.name || "") ||
          formData.location !== (user.location || "") ||
          formData.bio !== (user.bio || "") ||
          formData.profilePhoto !== (user.avatar || "") ||
          formData.phone !== (user.phone || "") ||
          formData.website !== (user.website || "") ||
          JSON.stringify(formData.interests) !==
            JSON.stringify(user.interests || []);
        setHasChanges(hasFormChanges);
      }
    }, [formData, user]);
    const handleInputChange = useCallback(
      (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (validationErrors[field as keyof ProfileSetupValidationErrors]) {
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
    const handleAddInterest = useCallback(() => {
      if (
        newInterest.trim() &&
        !formData.interests.includes(newInterest.trim())
      ) {
        setFormData((prev) => ({
          ...prev,
          interests: [...prev.interests, newInterest.trim()],
        }));
        setNewInterest("");
      }
    }, [newInterest, formData.interests]);
    const handleRemoveInterest = useCallback((interest: string) => {
      setFormData((prev) => ({
        ...prev,
        interests: prev.interests.filter((i) => i !== interest),
      }));
    }, []);
    const handleKeyPress = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleAddInterest();
        }
      },
      [handleAddInterest]
    );
    const handleSubmit = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault();
        const errors = validateForm(formData);
        setValidationErrors(errors);
        if (Object.keys(errors).length > 0) return;
        try {
          await updateProfile({
            name: formData.name,
            location: formData.location,
            bio: formData.bio,
            profilePhoto: formData.profilePhoto,
          });
          onSave?.();
        } catch (err) {
          console.error("Profile update failed:", err);
        }
      },
      [formData, validateForm, updateProfile, onSave]
    );
    const handleCancel = useCallback(() => {
      if (user) {
        setFormData({
          name: user.name || "",
          location: user.location || "",
          bio: user.bio || "",
          profilePhoto: user.avatar || "",
          phone: user.phone || "",
          interests: user.interests || [],
          website: user.website || "",
        });
        setValidationErrors({});
        setPhotoError("");
        setNewInterest("");
      }
      onCancel?.();
    }, [user, onCancel]);
    if (!user) return null;
    return (
      <div className="p-6">
        {error && (
          <div className="flex items-center gap-2 p-4 mb-6 rounded-lg bg-destructive/10 border border-destructive/20">
            <span className="text-destructive text-lg">⚠️</span>
            <p className="text-sm text-destructive font-medium">{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Photo Section */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-text-primary">
              Profile Photo
            </label>
            <ProfilePhotoUpload
              currentPhoto={formData.profilePhoto as string}
              onPhotoChange={handlePhotoChange}
              onError={handlePhotoError}
              disabled={isLoading}
              className="w-full"
            />
            {photoError && (
              <p className="text-sm text-destructive flex items-center gap-2">
                <span>❌</span> {photoError}
              </p>
            )}
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label
                htmlFor="edit-name"
                className="block text-sm font-medium text-text-primary"
              >
                Full Name <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faUser} className="text-text-muted" />
                </div>
                <input
                  id="edit-name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-background text-text-primary placeholder-text-muted transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                    validationErrors.name
                      ? "border-destructive bg-destructive/5"
                      : "border-border hover:border-border-hover"
                  }`}
                  placeholder="Enter your full name"
                  disabled={isLoading}
                />
              </div>
              {validationErrors.name && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <span>❌</span> {validationErrors.name}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label
                htmlFor="edit-phone"
                className="block text-sm font-medium text-text-primary"
              >
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faPhone} className="text-text-muted" />
                </div>
                <input
                  id="edit-phone"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-background text-text-primary placeholder-text-muted transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                    validationErrors.phone
                      ? "border-destructive bg-destructive/5"
                      : "border-border hover:border-border-hover"
                  }`}
                  placeholder="Enter your phone number"
                  disabled={isLoading}
                />
              </div>
              {validationErrors.phone && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <span>❌</span> {validationErrors.phone}
                </p>
              )}
            </div>
          </div>

          {/* Location Field */}
          <div className="space-y-2">
            <label
              htmlFor="edit-location"
              className="block text-sm font-medium text-text-primary"
            >
              Location <span className="text-destructive">*</span>
            </label>
            <LocationInput
              value={formData.location}
              onChange={(value) => handleInputChange("location", value)}
              hasError={!!validationErrors.location}
              disabled={isLoading}
              placeholder="City, State, Country"
              className="w-full"
            />
            {validationErrors.location && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <span>❌</span> {validationErrors.location}
              </p>
            )}
          </div>
          {}
          <div className="space-y-2">
            <label
              htmlFor="edit-website"
              className="block text-sm font-medium text-text-primary"
            >
              Website
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faGlobe} className="text-text-muted" />
              </div>
              <input
                id="edit-website"
                type="url"
                autoComplete="url"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-background text-text-primary placeholder-text-muted transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                  validationErrors.website
                    ? "border-destructive bg-destructive/5"
                    : "border-border hover:border-border-hover"
                }`}
                placeholder="https://www.example.com"
                disabled={isLoading}
              />
            </div>
            {validationErrors.website && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <span>❌</span> {validationErrors.website}
              </p>
            )}
          </div>
          {}
          <div className="space-y-2">
            <label
              htmlFor="edit-bio"
              className="block text-sm font-medium text-text-primary"
            >
              Bio <span className="text-text-muted">(Optional)</span>
            </label>
            <div className="relative">
              <textarea
                id="edit-bio"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                className={`block w-full px-3 py-3 border rounded-lg bg-background text-text-primary placeholder-text-muted transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none ${
                  validationErrors.bio
                    ? "border-destructive bg-destructive/5"
                    : "border-border hover:border-border-hover"
                }`}
                placeholder="Tell us a bit about yourself..."
                rows={3}
                maxLength={150}
                disabled={isLoading}
              />
              <div className="absolute bottom-2 right-2 text-xs text-text-muted">
                {(formData.bio || "").length}/150
              </div>
            </div>
            {validationErrors.bio && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <span>❌</span> {validationErrors.bio}
              </p>
            )}
          </div>

          {/* Interests Section */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-text-primary">
              Interests <span className="text-text-muted">(Optional)</span>
            </label>
            <div className="space-y-3">
              {/* Interest Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Add an interest..."
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant={ButtonVariant.OUTLINE}
                  size={ButtonSize.SM}
                  onClick={handleAddInterest}
                  disabled={isLoading || !newInterest.trim()}
                >
                  <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
                </Button>
              </div>

              {/* Interest Tags */}
              {formData.interests.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.interests.map((interest, index) => (
                    <Badge
                      key={index}
                      variant={BadgeVariant.PRIMARY}
                      className="flex items-center gap-1 px-3 py-1"
                    >
                      <span>{interest}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveInterest(interest)}
                        className="ml-1 hover:text-destructive transition-colors"
                        disabled={isLoading}
                      >
                        <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Verification Status */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-text-primary">
              Verification Status
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    user.security?.emailVerified
                      ? "bg-success text-white"
                      : "bg-secondary text-text-muted"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={user.security?.emailVerified ? faCheck : faUser}
                    className="w-4 h-4"
                  />
                </div>
                <div>
                  <Typography as={TypographyVariant.P} className="font-medium">
                    Email Verified
                  </Typography>
                  <Typography
                    as={TypographyVariant.SMALL}
                    className="text-text-muted"
                  >
                    {user.security?.emailVerified ? "Verified" : "Not verified"}
                  </Typography>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    user.security?.phoneVerified
                      ? "bg-success text-white"
                      : "bg-secondary text-text-muted"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={user.security?.phoneVerified ? faCheck : faPhone}
                    className="w-4 h-4"
                  />
                </div>
                <div>
                  <Typography as={TypographyVariant.P} className="font-medium">
                    Phone Verified
                  </Typography>
                  <Typography
                    as={TypographyVariant.SMALL}
                    className="text-text-muted"
                  >
                    {user.security?.phoneVerified ? "Verified" : "Not verified"}
                  </Typography>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
            <Button
              type="button"
              variant={ButtonVariant.OUTLINE}
              size={ButtonSize.LG}
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 sm:flex-none sm:min-w-[120px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={ButtonVariant.PRIMARY}
              size={ButtonSize.LG}
              disabled={!isFormValid || !hasChanges || isLoading}
              isLoading={isLoading}
              className="flex-1 sm:flex-none sm:min-w-[120px]"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>

          {/* Save Reminder */}
          {hasChanges && (
            <div className="p-3 bg-info/10 border border-info/20 rounded-lg">
              <p className="text-sm text-info">
                💡 You have unsaved changes. Remember to save your updates.
              </p>
            </div>
          )}
        </form>
      </div>
    );
  }
);
ProfileEdit.displayName = "ProfileEdit";
export default ProfileEdit;
