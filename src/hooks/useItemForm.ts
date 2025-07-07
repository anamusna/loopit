import {
  sanitizeItemDescription,
  sanitizeItemTitle,
  sanitizeLocation,
  validateItemListingField,
  validateItemListingForm,
} from "@/helpers/validation";
import { cloudinaryService } from "@/lib/cloudinary";
import {
  ImageUploadState,
  ItemCategory,
  ItemCondition,
  ItemListingFormData,
  ItemListingValidationErrors,
  ItemStatus,
} from "@/shared/types";
import { useLoopItStore } from "@/store";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
export interface UseItemFormOptions {
  autoSaveInterval?: number;
  enableAutoSave?: boolean;
  redirectAfterSubmit?: boolean;
}
export interface UseItemFormReturn {
  formData: ItemListingFormData;
  validationErrors: ItemListingValidationErrors;
  imageStates: ImageUploadState[];
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  hasUnsavedChanges: boolean;
  updateField: (
    field: keyof ItemListingFormData,
    value: string | ItemCategory | ItemCondition | (File | string)[] | string[]
  ) => void;
  updateTitle: (title: string) => void;
  updateCategory: (category: ItemCategory | "") => void;
  updateCondition: (condition: ItemCondition | "") => void;
  updateDescription: (description: string) => void;
  updateLocation: (location: string) => void;
  updateTags: (tags: string[]) => void;
  addImages: (files: File[]) => void;
  removeImage: (index: number) => void;
  reorderImages: (fromIndex: number, toIndex: number) => void;
  validateForm: () => boolean;
  validateField: (field: keyof ItemListingFormData) => void;
  resetForm: () => void;
  submitForm: () => Promise<void>;
  saveAsDraft: () => void;
  loadDraft: () => void;
  clearDraft: () => void;
  setupNavigationGuard: () => void;
  cleanupNavigationGuard: () => void;
}
const STORAGE_KEY = "loopit_item_form_draft";
const initialFormData: ItemListingFormData = {
  title: "",
  category: "",
  condition: "",
  description: "",
  location: "",
  images: [],
  tags: [],
};
export function useItemForm(
  options: UseItemFormOptions = {}
): UseItemFormReturn {
  const {
    autoSaveInterval: autoSaveIntervalMs = 30000, 
    enableAutoSave = true,
    redirectAfterSubmit = true,
  } = options;
  const router = useRouter();
  const { user, createItem, setError } = useLoopItStore();
  const [formData, setFormData] =
    useState<ItemListingFormData>(initialFormData);
  const [validationErrors, setValidationErrors] =
    useState<ItemListingValidationErrors>({});
  const [imageStates, setImageStates] = useState<ImageUploadState[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const autoSaveInterval = useRef<NodeJS.Timeout | null>(null);
  const beforeUnloadHandler = useRef<((e: BeforeUnloadEvent) => void) | null>(
    null
  );
  useEffect(() => {
    if (user?.location && !formData.location) {
      setFormData((prev) => ({
        ...prev,
        location: user.location,
      }));
    }
  }, [user?.location, formData.location]);
  const isValid = Object.keys(validationErrors).length === 0;
  const hasUnsavedChanges = isDirty && !isSubmitting;
  const updateField = useCallback(
    (
      field: keyof ItemListingFormData,
      value:
        | string
        | ItemCategory
        | ItemCondition
        | (File | string)[]
        | string[]
    ) => {
      setFormData((prev) => {
        const updated = { ...prev, [field]: value };
        const error = validateItemListingField(field, value, updated);
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [field]: error,
        }));
        return updated;
      });
      setIsDirty(true);
      if (field === "images" && Array.isArray(value)) {
        const imageArray = value as (File | string)[];
        setImageStates((currentImageStates) => {
          const newImageStates: ImageUploadState[] = [];
          imageArray.forEach((imageOrUrl) => {
            if (typeof imageOrUrl === "string") {
              newImageStates.push({
                file: new File([], "existing-image", { type: "image/jpeg" }), 
                preview: imageOrUrl,
                isUploading: false,
                isUploaded: true,
                uploadedUrl: imageOrUrl,
              });
            } else {
              const existingState = currentImageStates.find(
                (state) => state.file === imageOrUrl
              );
              if (existingState) {
                newImageStates.push(existingState);
              } else {
                newImageStates.push({
                  file: imageOrUrl,
                  preview: URL.createObjectURL(imageOrUrl),
                  isUploading: false,
                  isUploaded: false,
                });
              }
            }
          });
          return newImageStates;
        });
      }
    },
    [] 
  );
  const updateTitle = useCallback(
    (title: string) => {
      const sanitized = sanitizeItemTitle(title);
      updateField("title", sanitized);
    },
    [updateField]
  );
  const updateCategory = useCallback(
    (category: ItemCategory | "") => {
      updateField("category", category);
    },
    [updateField]
  );
  const updateCondition = useCallback(
    (condition: ItemCondition | "") => {
      updateField("condition", condition);
    },
    [updateField]
  );
  const updateDescription = useCallback(
    (description: string) => {
      const sanitized = sanitizeItemDescription(description);
      updateField("description", sanitized);
    },
    [updateField]
  );
  const updateLocation = useCallback(
    (location: string) => {
      const sanitized = sanitizeLocation(location);
      updateField("location", sanitized);
    },
    [updateField]
  );
  const updateTags = useCallback(
    (tags: string[]) => {
      updateField("tags", tags);
    },
    [updateField]
  );
  const addImages = useCallback((files: File[]) => {
    const newImageStates: ImageUploadState[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      isUploading: false,
      isUploaded: false,
    }));
    setImageStates((prev) => [...prev, ...newImageStates]);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
    setIsDirty(true);
  }, []);
  const removeImage = useCallback((index: number) => {
    setImageStates((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setIsDirty(true);
  }, []);
  const reorderImages = useCallback((fromIndex: number, toIndex: number) => {
    setImageStates((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
    setFormData((prev) => {
      const updated = [...prev.images];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return { ...prev, images: updated };
    });
    setIsDirty(true);
  }, []);
  const validateForm = useCallback(() => {
    const errors = validateItemListingForm(formData);
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);
  const validateField = useCallback(
    (field: keyof ItemListingFormData) => {
      const value = formData[field];
      const safeValue =
        value !== undefined
          ? value
          : ["images", "tags"].includes(field)
          ? []
          : "";
      const error = validateItemListingField(field, safeValue as any, formData);
      setValidationErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
    },
    [formData]
  );
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setValidationErrors({});
    setImageStates([]);
    setIsDirty(false);
    clearDraft();
  }, []);
  const submitForm = useCallback(async () => {
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    try {
      const uploadedImageUrls: string[] = [];
      for (let i = 0; i < formData.images.length; i++) {
        const imageOrUrl = formData.images[i];
        if (typeof imageOrUrl === "string") {
          uploadedImageUrls.push(imageOrUrl);
          continue;
        }
        const imageState = imageStates.find(
          (state) => state.file === imageOrUrl
        );
        if (!imageState) {
          console.warn("Image state not found for file:", imageOrUrl);
          continue;
        }
        if (!imageState.isUploaded) {
          setImageStates((prev) =>
            prev.map((state) =>
              state.file === imageOrUrl
                ? { ...state, isUploading: true, error: undefined }
                : state
            )
          );
          try {
            const uploadResponse = await cloudinaryService.uploadImage(
              imageState.file,
              "item-images"
            );
            uploadedImageUrls.push(uploadResponse.secure_url);
            setImageStates((prev) =>
              prev.map((state) =>
                state.file === imageOrUrl
                  ? {
                      ...state,
                      isUploading: false,
                      isUploaded: true,
                      uploadedUrl: uploadResponse.secure_url,
                    }
                  : state
              )
            );
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Upload failed";
            setImageStates((prev) =>
              prev.map((state) =>
                state.file === imageOrUrl
                  ? {
                      ...state,
                      isUploading: false,
                      error: errorMessage,
                    }
                  : state
              )
            );
            throw new Error(`Failed to upload image ${i + 1}: ${errorMessage}`);
          }
        } else {
          uploadedImageUrls.push(imageState.uploadedUrl!);
        }
      }
      await createItem({
        title: formData.title,
        description: formData.description,
        category: formData.category as ItemCategory,
        condition: formData.condition as ItemCondition,
        images: uploadedImageUrls,
        location: formData.location,
        tags: formData.tags,
        status: ItemStatus.AVAILABLE,
        environmentalImpact: {
          carbonSaved: 0,
          waterSaved: 0,
          landfillSaved: 0,
          offsetComparisons: {
            carRides: 0,
            flightHours: 0,
            homeDays: 0,
            treeDays: 0,
            lightbulbHours: 0,
            showerMinutes: 0,
            meatMeals: 0,
            coffeeCups: 0,
          },
        },
      });
      clearDraft();
      setIsDirty(false);
      if (redirectAfterSubmit) {
        router.push("/dashboard?tab=my-listings");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create item";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    formData,
    imageStates,
    validateForm,
    createItem,
    router,
    redirectAfterSubmit,
    setError,
  ]);
  const saveAsDraft = useCallback(() => {
    const draft = {
      formData,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [formData]);
  const loadDraft = useCallback(() => {
    try {
      const savedDraft = localStorage.getItem(STORAGE_KEY);
      if (savedDraft) {
        const { formData: draftData, timestamp } = JSON.parse(savedDraft);
        const isRecent = Date.now() - timestamp < 24 * 60 * 60 * 1000;
        if (isRecent) {
          setFormData(draftData);
          setIsDirty(true);
          return true;
        }
      }
    } catch (error) {
      console.warn("Failed to load draft:", error);
    }
    return false;
  }, []);
  const clearDraft = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);
  useEffect(() => {
    if (enableAutoSave && isDirty) {
      autoSaveInterval.current = setInterval(saveAsDraft, autoSaveIntervalMs);
    }
    return () => {
      if (autoSaveInterval.current) {
        clearInterval(autoSaveInterval.current);
      }
    };
  }, [enableAutoSave, isDirty, saveAsDraft, autoSaveIntervalMs]);
  const setupNavigationGuard = useCallback(() => {
    beforeUnloadHandler.current = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", beforeUnloadHandler.current);
  }, [hasUnsavedChanges]);
  const cleanupNavigationGuard = useCallback(() => {
    if (beforeUnloadHandler.current) {
      window.removeEventListener("beforeunload", beforeUnloadHandler.current);
      beforeUnloadHandler.current = null;
    }
  }, []);
  useEffect(() => {
    return () => {
      imageStates.forEach((state) => {
        URL.revokeObjectURL(state.preview);
      });
      cleanupNavigationGuard();
      if (autoSaveInterval.current) {
        clearInterval(autoSaveInterval.current);
      }
    };
  }, [imageStates, cleanupNavigationGuard]);
  return {
    formData,
    validationErrors,
    imageStates,
    isSubmitting,
    isValid,
    isDirty,
    hasUnsavedChanges,
    updateField,
    updateTitle,
    updateCategory,
    updateCondition,
    updateDescription,
    updateLocation,
    updateTags,
    addImages,
    removeImage,
    reorderImages,
    validateForm,
    validateField,
    resetForm,
    submitForm,
    saveAsDraft,
    loadDraft,
    clearDraft,
    setupNavigationGuard,
    cleanupNavigationGuard,
  };
}
