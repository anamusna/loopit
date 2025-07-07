import type { CloudinaryUploadResponse } from "@/shared/types";
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
export class CloudinaryService {
  private static instance: CloudinaryService;
  private cloudName: string | null;
  private uploadPreset: string | null;
  private isConfigured: boolean;
  private constructor() {
    this.cloudName = CLOUDINARY_CLOUD_NAME || null;
    this.uploadPreset = CLOUDINARY_UPLOAD_PRESET || null;
    this.isConfigured = !!(this.cloudName && this.uploadPreset);
  }
  public static getInstance(): CloudinaryService {
    if (!CloudinaryService.instance) {
      CloudinaryService.instance = new CloudinaryService();
    }
    return CloudinaryService.instance;
  }
  public isCloudinaryConfigured(): boolean {
    return this.isConfigured;
  }
  public getConfigurationStatus(): {
    isConfigured: boolean;
    missingVariables: string[];
    message: string;
  } {
    const missingVariables: string[] = [];
    if (!this.cloudName) {
      missingVariables.push("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME");
    }
    if (!this.uploadPreset) {
      missingVariables.push("NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET");
    }
    const message = this.isConfigured
      ? "Cloudinary is properly configured"
      : `Cloudinary is not configured. Missing environment variables: ${missingVariables.join(
          ", "
        )}`;
    return {
      isConfigured: this.isConfigured,
      missingVariables,
      message,
    };
  }
  async uploadImage(
    file: File,
    folder = "profile-photos"
  ): Promise<CloudinaryUploadResponse> {
    if (!this.isConfigured) {
      const { message } = this.getConfigurationStatus();
      throw new Error(`Cloudinary configuration error: ${message}`);
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", this.uploadPreset!);
    formData.append("folder", folder);
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Upload failed");
      }
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Upload failed due to network error");
    }
  }
  async deleteImage(publicId: string): Promise<void> {
    if (!this.isConfigured) {
      console.warn("Cloudinary not configured - cannot delete image");
      return;
    }
    console.warn(
      `Image deletion for ${publicId} should be handled by backend for security`
    );
  }
  getImageUrl(
    publicId: string,
    transformations: string = "c_fill,w_400,h_400,q_auto,f_auto"
  ): string {
    if (!this.cloudName) {
      console.warn(
        "Cloudinary cloud name not configured - returning original URL"
      );
      return publicId;
    }
    return `https://res.cloudinary.com/${this.cloudName}/image/upload/${transformations}/${publicId}`;
  }
  validateImageFile(file: File): { isValid: boolean; error?: string } {
    const MAX_SIZE = 5 * 1024 * 1024;
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        isValid: false,
        error: "Only JPEG, PNG, and WebP images are allowed",
      };
    }
    if (file.size > MAX_SIZE) {
      return {
        isValid: false,
        error: "Image must be smaller than 5MB",
      };
    }
    return { isValid: true };
  }
  createMockUploadResponse(file: File): CloudinaryUploadResponse {
    const mockUrl = URL.createObjectURL(file);
    return {
      public_id: `mock_${Date.now()}`,
      secure_url: mockUrl,
      url: mockUrl,
      width: 400,
      height: 400,
    };
  }
}
export const cloudinaryService = CloudinaryService.getInstance();
