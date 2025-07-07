"use client";
import { CloudinaryUploadResponse } from "@/shared/types";
import { useLoopItStore } from "@/store";
import Button, {
  ButtonSize,
  ButtonVariant,
} from "@/tailwind/components/elements/Button";
import {
  Typography,
  TypographyVariant,
} from "@/tailwind/components/elements/Typography";
import {
  faCamera,
  faCheck,
  faCrop,
  faSpinner,
  faTrash,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useRef, useState } from "react";
interface ProfilePhotoUploadProps {
  currentPhoto?: string;
  onPhotoChange?: (photoUrl: string) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
}
const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({
  currentPhoto,
  onPhotoChange,
  onError,
  disabled = false,
  className = "",
}) => {
  const { user, updateProfile } = useLoopItStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        const errorMsg = "Please select a valid image file";
        setError(errorMsg);
        onError?.(errorMsg);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        const errorMsg = "Image size must be less than 5MB";
        setError(errorMsg);
        onError?.(errorMsg);
        return;
      }
      setError(null);
      setIsUploading(true);
      setUploadProgress(0);
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "loopit_profile");
        formData.append("cloud_name", "your-cloud-name");
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        clearInterval(progressInterval);
        setUploadProgress(100);
        const mockResponse: CloudinaryUploadResponse = {
          public_id: `profile_${Date.now()}`,
          secure_url: previewUrl || "",
          url: previewUrl || "",
          width: 400,
          height: 400,
        };
        if (user) {
          await updateProfile({
            avatar: mockResponse.secure_url,
          });
        }
        onPhotoChange?.(mockResponse.secure_url);
        setError(null);
      } catch (err) {
        const errorMsg = "Failed to upload image. Please try again.";
        setError(errorMsg);
        onError?.(errorMsg);
        setPreviewUrl(null);
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [user, updateProfile, onPhotoChange, onError, previewUrl]
  );
  const handleRemovePhoto = useCallback(async () => {
    try {
      if (user) {
        await updateProfile({
          avatar: undefined,
        });
      }
      setPreviewUrl(null);
      onPhotoChange?.("");
      setError(null);
    } catch (err) {
      const errorMsg = "Failed to remove photo. Please try again.";
      setError(errorMsg);
      onError?.(errorMsg);
    }
  }, [user, updateProfile, onPhotoChange, onError]);
  const handleCropPhoto = useCallback(() => {
    alert("Photo cropping feature coming soon!");
  }, []);
  const triggerFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);
  const currentPhotoUrl = previewUrl || currentPhoto || user?.avatar;
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-3">
        <Typography as={TypographyVariant.H4} className="font-semibold">
          Profile Photo
        </Typography>
        {currentPhotoUrl && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full" />
            <Typography as={TypographyVariant.SMALL} className="text-success">
              Photo uploaded
            </Typography>
          </div>
        )}
      </div>
      {}
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-secondary/20 border-2 border-border">
            {currentPhotoUrl ? (
              <img
                src={currentPhotoUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faCamera}
                  className="w-8 h-8 text-text-muted"
                />
              </div>
            )}
          </div>
          {}
          {isUploading && (
            <div className="absolute inset-0 bg-background/80 rounded-full flex items-center justify-center">
              <div className="text-center">
                <FontAwesomeIcon
                  icon={faSpinner}
                  className="w-6 h-6 text-primary animate-spin mb-2"
                />
                <Typography
                  as={TypographyVariant.SMALL}
                  className="text-primary"
                >
                  {uploadProgress}%
                </Typography>
              </div>
            </div>
          )}
          {}
          {uploadProgress === 100 && !isUploading && (
            <div className="absolute inset-0 bg-success/20 rounded-full flex items-center justify-center">
              <FontAwesomeIcon
                icon={faCheck}
                className="w-6 h-6 text-success"
              />
            </div>
          )}
        </div>
        {}
        <div className="flex flex-col gap-2">
          <Button
            variant={ButtonVariant.OUTLINE}
            size={ButtonSize.SM}
            onClick={triggerFileSelect}
            disabled={isUploading || disabled}
            className="flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faUpload} className="w-4 h-4" />
            {currentPhotoUrl ? "Change Photo" : "Upload Photo"}
          </Button>
          {currentPhotoUrl && (
            <>
              <Button
                variant={ButtonVariant.OUTLINE}
                size={ButtonSize.SM}
                onClick={handleCropPhoto}
                disabled={isUploading || disabled}
                className="flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faCrop} className="w-4 h-4" />
                Crop Photo
              </Button>
              <Button
                variant={ButtonVariant.OUTLINE}
                size={ButtonSize.SM}
                onClick={handleRemovePhoto}
                disabled={isUploading || disabled}
                className="flex items-center gap-2 text-error hover:text-error"
              >
                <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                Remove Photo
              </Button>
            </>
          )}
        </div>
      </div>
      {}
      <input ref={fileInputRef} type="file" accept="image/*" className="" />
      {error && (
        <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
          <Typography as={TypographyVariant.SMALL} className="text-error">
            {error}
          </Typography>
        </div>
      )}
      {}
      <div className="p-4 bg-secondary/10 rounded-lg">
        <Typography as={TypographyVariant.SMALL} className="text-text-muted">
          <strong>Upload Guidelines:</strong>
        </Typography>
        <ul className="mt-2 space-y-1 text-sm text-text-muted">
          <li>• Supported formats: JPG, PNG, GIF</li>
          <li>• Maximum file size: 5MB</li>
          <li>• Recommended size: 400x400 pixels</li>
          <li>• Clear, well-lit photos work best</li>
        </ul>
      </div>
      {}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <Typography
              as={TypographyVariant.SMALL}
              className="text-text-muted"
            >
              Uploading...
            </Typography>
            <Typography as={TypographyVariant.SMALL} className="text-primary">
              {uploadProgress}%
            </Typography>
          </div>
          <div className="w-full bg-secondary/20 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default ProfilePhotoUpload;
