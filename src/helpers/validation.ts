import type {
  AuthValidationErrors,
  ItemListingFormData,
  ItemListingValidationErrors,
  LoginFormData,
  RegisterFormData,
} from "@/shared/types";
import { ItemCategory, ItemCondition } from "@/shared/types";
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const PASSWORD_REGEX = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
export function validateLoginForm(data: LoginFormData): AuthValidationErrors {
  const errors: AuthValidationErrors = {};
  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.email = "Please enter a valid email address";
  }
  if (!data.password) {
    errors.password = "Password is required";
  } else if (data.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }
  return errors;
}
export function validateRegisterForm(
  data: RegisterFormData
): AuthValidationErrors {
  const errors: AuthValidationErrors = {};
  if (!data.name.trim()) {
    errors.name = "Full name is required";
  } else if (data.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  } else if (data.name.trim().length > 100) {
    errors.name = "Name must be less than 100 characters";
  } else if (!/^[a-zA-Z\s'-]+$/.test(data.name.trim())) {
    errors.name =
      "Name can only contain letters, spaces, hyphens, and apostrophes";
  }
  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.email = "Please enter a valid email address";
  } else if (data.email.length > 254) {
    errors.email = "Email address is too long";
  }
  if (!data.password) {
    errors.password = "Password is required";
  } else if (data.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  } else if (data.password.length > 128) {
    errors.password = "Password must be less than 128 characters";
  } else if (!PASSWORD_REGEX.test(data.password)) {
    errors.password = "Password must contain uppercase, lowercase, and number";
  } else if (/\s/.test(data.password)) {
    errors.password = "Password cannot contain spaces";
  }
  if (!data.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }
  if (!data.location.trim()) {
    errors.location = "Location is required to connect with your community";
  } else if (data.location.trim().length < 2) {
    errors.location = "Please enter a valid location";
  } else if (data.location.trim().length > 100) {
    errors.location = "Location must be less than 100 characters";
  }
  if (!data.agreedToTerms) {
    errors.agreedToTerms =
      "You must agree to the terms and conditions to join LoopIt";
  }
  return errors;
}
export function validateLoginField(
  field: keyof LoginFormData,
  value: string
): string | undefined {
  const tempData: LoginFormData = {
    email: field === "email" ? value : "",
    password: field === "password" ? value : "",
  };
  const errors = validateLoginForm(tempData);
  return errors[field];
}
export function validateRegisterField(
  field: keyof RegisterFormData,
  value: string | boolean,
  allData?: Partial<RegisterFormData>
): string | undefined {
  const tempData: RegisterFormData = {
    name: field === "name" ? (value as string) : allData?.name || "",
    email: field === "email" ? (value as string) : allData?.email || "",
    password:
      field === "password" ? (value as string) : allData?.password || "",
    confirmPassword:
      field === "confirmPassword"
        ? (value as string)
        : allData?.confirmPassword || "",
    location:
      field === "location" ? (value as string) : allData?.location || "",
    agreedToTerms:
      field === "agreedToTerms"
        ? (value as boolean)
        : allData?.agreedToTerms || false,
  };
  const errors = validateRegisterForm(tempData);
  return errors[field];
}
export function hasValidationErrors(errors: AuthValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}
export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
export function sanitizeName(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
export function sanitizeLocation(location: string): string {
  return location
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
export function validateItemListingForm(
  data: ItemListingFormData
): ItemListingValidationErrors {
  const errors: ItemListingValidationErrors = {};
  if (!data.title.trim()) {
    errors.title = "Title is required";
  } else if (data.title.trim().length < 3) {
    errors.title = "Title must be at least 3 characters";
  } else if (data.title.trim().length > 100) {
    errors.title = "Title must be less than 100 characters";
  }
  if (!data.category) {
    errors.category = "Category is required";
  } else if (
    !Object.values(ItemCategory).includes(data.category as ItemCategory)
  ) {
    errors.category = "Please select a valid category";
  }
  if (!data.condition) {
    errors.condition = "Condition is required";
  } else if (
    !Object.values(ItemCondition).includes(data.condition as ItemCondition)
  ) {
    errors.condition = "Please select a valid condition";
  }
  if (data.description && data.description.length > 500) {
    errors.description = "Description must be less than 500 characters";
  }
  if (!data.location.trim()) {
    errors.location = "Location is required";
  } else if (data.location.trim().length < 2) {
    errors.location = "Please enter a valid location";
  } else if (data.location.trim().length > 100) {
    errors.location = "Location must be less than 100 characters";
  }
  if (!data.images || data.images.length === 0) {
    errors.images = "At least one image is required";
  } else if (data.images.length > 5) {
    errors.images = "Maximum 5 images allowed";
  } else {
    for (const image of data.images) {
      if (typeof image === "object" && "type" in image && "size" in image) {
        if (!image.type.startsWith("image/")) {
          errors.images = "Only image files are allowed";
          break;
        }
        if (image.size > 5 * 1024 * 1024) {
          errors.images = "Images must be smaller than 5MB";
          break;
        }
      } else if (typeof image === "string") {
        if (!image.trim()) {
          errors.images = "Invalid image URL";
          break;
        }
      } else {
        errors.images = "Invalid image format";
        break;
      }
    }
  }
  if (data.tags && data.tags.length > 10) {
    errors.tags = "Maximum 10 tags allowed";
  }
  return errors;
}
export function validateItemListingField(
  field: keyof ItemListingFormData,
  value: string | ItemCategory | ItemCondition | (File | string)[] | string[],
  allData?: Partial<ItemListingFormData>
): string | undefined {
  const tempData: ItemListingFormData = {
    title: field === "title" ? (value as string) : allData?.title || "",
    category:
      field === "category" ? (value as ItemCategory) : allData?.category || "",
    condition:
      field === "condition"
        ? (value as ItemCondition)
        : allData?.condition || "",
    description:
      field === "description" ? (value as string) : allData?.description || "",
    location:
      field === "location" ? (value as string) : allData?.location || "",
    images:
      field === "images" ? (value as (File | string)[]) : allData?.images || [],
    tags: field === "tags" ? (value as string[]) : allData?.tags || [],
    expiresAt: allData?.expiresAt || new Date(),
  };
  const errors = validateItemListingForm(tempData);
  const errorKey = field as keyof ItemListingValidationErrors;
  return errors[errorKey];
}
export function sanitizeItemTitle(title: string): string {
  return title.trim().replace(/\s+/g, " ");
}
export function sanitizeItemDescription(description: string): string {
  return description.trim().replace(/\s+/g, " ");
}
export function sanitizeTags(tagsInput: string): string[] {
  return tagsInput
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag) => tag.length > 0 && tag.length <= 20)
    .slice(0, 10); 
}
