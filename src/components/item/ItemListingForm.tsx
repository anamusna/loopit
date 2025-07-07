"use client";
import { getCarbonSavingsForCategory } from "@/constants/environmentalImpact";
import { sanitizeTags } from "@/helpers/validation";
import { useItemForm } from "@/hooks/useItemForm";
import { calculateCarbonSaved } from "@/lib/utils/itemStatus";
import {
  ImageUploadState,
  ItemCategory,
  ItemCondition,
  ItemListingFormData,
  ItemListingValidationErrors,
  ItemStatus,
} from "@/shared/types";
import { useLoopItStore } from "@/store";
import Button, { ButtonVariant } from "@/tailwind/components/elements/Button";
import {
  Typography,
  TypographyVariant,
} from "@/tailwind/components/elements/Typography";
import Input from "@/tailwind/components/forms/Input";
import Select, { SelectState } from "@/tailwind/components/forms/Select";
import Textarea from "@/tailwind/components/forms/Textarea";
import Toggle from "@/tailwind/components/forms/Toggle";
import Alert, { AlertVariant } from "@/tailwind/components/layout/Alert";
import Card, { CardBody, CardHeader } from "@/tailwind/components/layout/Card";
import Container from "@/tailwind/components/layout/Container";
import Modal, { ModalSize } from "@/tailwind/components/layout/Modal";
import {
  faArrowLeft,
  faArrowRight,
  faCheck,
  faClock,
  faExclamationTriangle,
  faLeaf,
  faRocket,
  faSave,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import LocationInput from "../profile/LocationInput";
import { CATEGORY_OPTIONS, CONDITION_OPTIONS } from "./CategoryOptions";
import { ImageUpload } from "./ImageUpload";
import { ItemDetail } from "./ItemDetail";
export interface ItemListingFormProps {
  className?: string;
}
const FORM_STEPS = [
  {
    id: "basic",
    title: "Basic Information",
    description: "Tell us about your item",
    icon: "📝",
  },
  {
    id: "images",
    title: "Photos",
    description: "Add clear photos of your item",
    icon: "📸",
  },
  {
    id: "details",
    title: "Details & Location",
    description: "Add description and location",
    icon: "📍",
  },
  {
    id: "settings",
    title: "Settings & Boost",
    description: "Configure listing options",
    icon: "⚙️",
  },
  {
    id: "preview",
    title: "Preview & Submit",
    description: "Review and publish your listing",
    icon: "👁️",
  },
];
const StepIndicator: React.FC<{
  currentStep: number;
  totalSteps: number;
  steps: typeof FORM_STEPS;
}> = ({ currentStep, totalSteps, steps }) => (
  <div className="mb-8">
    <div className="flex items-center justify-between mb-4">
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={clsx(
            "flex flex-col items-center flex-1 relative",
            index < steps.length - 1 &&
              "after:content-[''] after:absolute after:top-4 after:left-1/2 after:w-full after:h-0.5 after:bg-border after:z-0"
          )}
        >
          <div
            className={clsx(
              "relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
              index < currentStep
                ? "bg-success text-white"
                : index === currentStep
                ? "bg-primary text-white ring-4 ring-primary/20"
                : "bg-secondary text-text-muted"
            )}
          >
            {index < currentStep ? (
              <FontAwesomeIcon icon={faCheck} className="w-3 h-3" />
            ) : (
              <span>{step.icon}</span>
            )}
          </div>
          <div className="mt-2 text-center">
            <Typography
              as={TypographyVariant.SMALL}
              className={clsx(
                "font-medium",
                index <= currentStep ? "text-text-primary" : "text-text-muted"
              )}
            >
              {step.title}
            </Typography>
            <Typography
              as={TypographyVariant.SMALL}
              className="text-text-muted text-xs hidden sm:block"
            >
              {step.description}
            </Typography>
          </div>
        </div>
      ))}
    </div>
    <div className="w-full bg-secondary rounded-full h-2">
      <div
        className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all duration-500 ease-out"
        style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
      />
    </div>
  </div>
);
const BasicInfoStep: React.FC<{
  formData: ItemListingFormData;
  validationErrors: ItemListingValidationErrors;
  onFieldChange: (field: keyof ItemListingFormData, value: any) => void;
  isDisabled?: boolean;
}> = ({ formData, validationErrors, onFieldChange, isDisabled = false }) => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <Typography as={TypographyVariant.H3}>Basic Information</Typography>
        <Typography as={TypographyVariant.P} className="text-text-muted">
          Start with the essentials about your item
        </Typography>
      </CardHeader>
      <CardBody className="space-y-6">
        <Input
          label="Title"
          placeholder="What are you offering? (e.g., Vintage Denim Jacket, iPhone 12, Wooden Coffee Table)"
          value={formData.title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onFieldChange("title", e.target.value)
          }
          errorMessage={validationErrors.title}
          hasError={!!validationErrors.title}
          isRequired
          maxLength={100}
          description="Give your item a clear, descriptive title that will help others find it"
          disabled={isDisabled}
        />
        {}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Category"
            options={CATEGORY_OPTIONS}
            value={formData.category}
            onValueChange={(value) => onFieldChange("category", value)}
            errorMessage={validationErrors.category}
            state={
              validationErrors.category
                ? SelectState.ERROR
                : SelectState.DEFAULT
            }
            isRequired
            disabled={isDisabled}
          />
          <Select
            label="Condition"
            options={CONDITION_OPTIONS}
            value={formData.condition}
            onValueChange={(value) => onFieldChange("condition", value)}
            errorMessage={validationErrors.condition}
            state={
              validationErrors.condition
                ? SelectState.ERROR
                : SelectState.DEFAULT
            }
            isRequired
            disabled={isDisabled}
          />
        </div>
        {}
        {formData.category && formData.condition && (
          <div className="bg-success/5 border border-success/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FontAwesomeIcon icon={faLeaf} className="w-4 h-4 text-success" />
              <Typography
                as={TypographyVariant.P}
                className="font-medium text-success"
              >
                Environmental Impact Preview
              </Typography>
            </div>
            <Typography
              as={TypographyVariant.P}
              className="text-sm text-text-muted"
            >
              This item will save approximately{" "}
              <span className="font-bold text-success">
                {(() => {
                  const baseSavings = getCarbonSavingsForCategory(
                    formData.category as ItemCategory
                  );
                  const conditionMultiplier =
                    {
                      excellent: 1.2,
                      good: 1.0,
                      fair: 0.8,
                      needs_repair: 0.6,
                    }[formData.condition as ItemCondition] || 1.0;
                  const estimatedSavings = Math.round(
                    baseSavings * conditionMultiplier
                  );
                  return `${estimatedSavings}kg CO₂`;
                })()}
              </span>{" "}
              compared to buying new
            </Typography>
          </div>
        )}
      </CardBody>
    </Card>
    {}
    <Card className="bg-info/5 border-info/20">
      <CardBody>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-info/20 rounded-full flex items-center justify-center flex-shrink-0">
            <FontAwesomeIcon icon={faLeaf} className="w-4 h-4 text-info" />
          </div>
          <div className="space-y-2">
            <Typography
              as={TypographyVariant.H4}
              className="font-semibold text-info"
            >
              Environmental Impact
            </Typography>
            <Typography
              as={TypographyVariant.P}
              className="text-sm text-text-muted"
            >
              By listing this item, you&apos;re helping save approximately{" "}
              <strong className="text-info">
                {formData.category
                  ? calculateCarbonSaved(formData.category)
                  : 0}
                kg of CO₂
              </strong>{" "}
              that would be emitted from producing a new item.
            </Typography>
          </div>
        </div>
      </CardBody>
    </Card>
  </div>
);
const ImagesStep: React.FC<{
  imageStates: ImageUploadState[];
  validationErrors: ItemListingValidationErrors;
  onImagesAdd: (files: File[]) => void;
  onImageRemove: (index: number) => void;
  onImageReorder: (fromIndex: number, toIndex: number) => void;
  isDisabled?: boolean;
}> = ({
  imageStates,
  validationErrors,
  onImagesAdd,
  onImageRemove,
  onImageReorder,
  isDisabled = false,
}) => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <Typography as={TypographyVariant.H3}>Photos</Typography>
        <Typography as={TypographyVariant.P} className="text-text-muted">
          Add clear, high-quality photos of your item
        </Typography>
      </CardHeader>
      <CardBody>
        <ImageUpload
          images={imageStates}
          onImagesAdd={onImagesAdd}
          onImageRemove={onImageRemove}
          onImageReorder={onImageReorder}
          isDisabled={isDisabled}
          maxImages={5}
        />
        {validationErrors.images && (
          <Alert
            variant={AlertVariant.ERROR}
            message={validationErrors.images}
            className="mt-4"
          />
        )}
      </CardBody>
    </Card>
  </div>
);
const DetailsStep: React.FC<{
  formData: ItemListingFormData;
  validationErrors: ItemListingValidationErrors;
  onFieldChange: (field: keyof ItemListingFormData, value: any) => void;
  isDisabled?: boolean;
}> = ({ formData, validationErrors, onFieldChange, isDisabled = false }) => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <Typography as={TypographyVariant.H3}>
          Description & Location
        </Typography>
        <Typography as={TypographyVariant.P} className="text-text-muted">
          Provide detailed information about your item
        </Typography>
      </CardHeader>
      <CardBody className="space-y-6">
        {}
        <Textarea
          label="Description"
          placeholder="Describe your item's features, history, condition, and any other relevant details..."
          value={formData.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            onFieldChange("description", e.target.value)
          }
          errorMessage={validationErrors.description}
          hasError={!!validationErrors.description}
          maxLength={500}
          showCharCount
          rows={4}
          description="Help others understand what makes your item special"
          disabled={isDisabled}
        />
        {}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-primary">
            Location <span className="text-destructive">*</span>
          </label>
          <LocationInput
            value={formData.location}
            onChange={(value) => onFieldChange("location", value)}
            hasError={!!validationErrors.location}
            disabled={isDisabled}
            placeholder="City, neighborhood, or general area"
            className="w-full"
            showLocationPermissionButton={true}
            onLocationPermissionRequest={async () => {
              const { requestLocationPermission } = useLoopItStore.getState();
              return await requestLocationPermission();
            }}
          />
          {validationErrors.location && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <span>❌</span> {validationErrors.location}
            </p>
          )}
        </div>
        {}
        <Input
          label="Tags"
          placeholder="vintage, handmade, collectible, eco-friendly..."
          value={formData.tags.join(", ")}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const tags = sanitizeTags(e.target.value);
            onFieldChange("tags", tags);
          }}
          errorMessage={validationErrors.tags}
          hasError={!!validationErrors.tags}
          description="Add keywords to help people discover your item (optional, max 10)"
          disabled={isDisabled}
        />
      </CardBody>
    </Card>
  </div>
);
const SettingsStep: React.FC<{
  formData: ItemListingFormData;
  onFieldChange: (field: keyof ItemListingFormData, value: any) => void;
  isDisabled?: boolean;
}> = ({ formData, onFieldChange, isDisabled = false }) => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <Typography as={TypographyVariant.H3}>Listing Settings</Typography>
        <Typography as={TypographyVariant.P} className="text-text-muted">
          Configure how your listing appears and behaves
        </Typography>
      </CardHeader>
      <CardBody className="space-y-6">
        {}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon
              icon={faClock}
              className="w-5 h-5 text-text-muted"
            />
            <div>
              <Typography as={TypographyVariant.H4} className="font-semibold">
                Listing Expiration
              </Typography>
              <Typography
                as={TypographyVariant.P}
                className="text-sm text-text-muted"
              >
                Choose how long your listing stays active
              </Typography>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { days: 7, label: "1 Week", description: "Quick swaps" },
              { days: 30, label: "1 Month", description: "Standard listing" },
              { days: 90, label: "3 Months", description: "Long-term listing" },
            ].map((option) => (
              <button
                key={option.days}
                type="button"
                onClick={() => {
                  const expiresAt = new Date();
                  expiresAt.setDate(expiresAt.getDate() + option.days);
                  onFieldChange("expiresAt", expiresAt);
                }}
                className={clsx(
                  "p-4 border rounded-lg text-left transition-all duration-200",
                  formData.expiresAt &&
                    new Date(formData.expiresAt).getTime() ===
                      new Date(
                        Date.now() + option.days * 24 * 60 * 60 * 1000
                      ).getTime()
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-primary/5"
                )}
                disabled={isDisabled}
              >
                <div className="font-semibold text-text-primary">
                  {option.label}
                </div>
                <div className="text-sm text-text-muted">
                  {option.description}
                </div>
              </button>
            ))}
          </div>
        </div>
        {}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faRocket} className="w-5 h-5 text-warning" />
            <div>
              <Typography as={TypographyVariant.H4} className="font-semibold">
                Boost Your Listing
              </Typography>
              <Typography
                as={TypographyVariant.P}
                className="text-sm text-text-muted"
              >
                Get more visibility for your item
              </Typography>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-warning/5 border border-warning/20 rounded-lg">
            <div className="flex-1">
              <Typography as={TypographyVariant.P} className="font-medium">
                Featured Listing
              </Typography>
              <Typography
                as={TypographyVariant.P}
                className="text-sm text-text-muted"
              >
                Appears at the top of search results for 7 days
              </Typography>
            </div>
            <Toggle
              checked={formData.isBoosted || false}
              onChange={(e) => onFieldChange("isBoosted", e.target.checked)}
              disabled={isDisabled}
            />
          </div>
        </div>
      </CardBody>
    </Card>
  </div>
);
const PreviewStep: React.FC<{
  formData: ItemListingFormData;
  imageStates: ImageUploadState[];
  onEditStep: (step: number) => void;
}> = ({ formData, imageStates, onEditStep }) => {
  const previewItem = useMemo(
    () => ({
      id: "preview",
      title: formData.title,
      description: formData.description,
      category: formData.category as ItemCategory,
      condition: formData.condition as ItemCondition,
      status: ItemStatus.AVAILABLE,
      images: imageStates.map((state) => state.preview),
      location: formData.location,
      ownerId: "preview",
      ownerName: "You",
      ownerAvatar: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
      saves: 0,
      swapRequests: 0,
      tags: formData.tags,
      isBoosted: formData.isBoosted,
      carbonSaved: formData.category
        ? calculateCarbonSaved(formData.category)
        : 0,
    }),
    [formData, imageStates]
  );
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Typography as={TypographyVariant.H3}>
            Preview Your Listing
          </Typography>
          <Typography as={TypographyVariant.P} className="text-text-muted">
            This is how your item will appear to others
          </Typography>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onEditStep(0)}
                className="px-3 py-1 text-sm bg-secondary hover:bg-secondary/80 rounded-full transition-colors"
              >
                Edit Basic Info
              </button>
              <button
                type="button"
                onClick={() => onEditStep(1)}
                className="px-3 py-1 text-sm bg-secondary hover:bg-secondary/80 rounded-full transition-colors"
              >
                Edit Photos
              </button>
              <button
                type="button"
                onClick={() => onEditStep(2)}
                className="px-3 py-1 text-sm bg-secondary hover:bg-secondary/80 rounded-full transition-colors"
              >
                Edit Details
              </button>
              <button
                type="button"
                onClick={() => onEditStep(3)}
                className="px-3 py-1 text-sm bg-secondary hover:bg-secondary/80 rounded-full transition-colors"
              >
                Edit Settings
              </button>
            </div>
            <div className="border border-border rounded-lg overflow-hidden">
              <ItemDetail itemId="preview" className="p-0" />
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
export const ItemListingForm: React.FC<ItemListingFormProps> = ({
  className = "",
}) => {
  const router = useRouter();
  const { user } = useLoopItStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [showExitModal, setShowExitModal] = useState(false);
  const {
    formData,
    validationErrors,
    imageStates,
    isSubmitting,
    isValid,
    hasUnsavedChanges,
    updateField,
    addImages,
    removeImage,
    reorderImages,
    submitForm,
    resetForm,
    saveAsDraft,
    loadDraft,
  } = useItemForm({
    enableAutoSave: true,
    redirectAfterSubmit: false,
  });
  useEffect(() => {
    loadDraft();
  }, [loadDraft]);
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);
  const canProceedToNextStep = useMemo(() => {
    switch (currentStep) {
      case 0:
        return formData.title.trim() && formData.category && formData.condition;
      case 1:
        return imageStates.length > 0;
      case 2:
        return formData.location.trim();
      case 3:
        return true;
      default:
        return true;
    }
  }, [currentStep, formData, imageStates]);
  const canGoToPreviousStep = currentStep > 0;
  const handleNextStep = useCallback(() => {
    if (canProceedToNextStep && currentStep < FORM_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, [canProceedToNextStep, currentStep]);
  const handlePreviousStep = useCallback(() => {
    if (canGoToPreviousStep) {
      setCurrentStep(currentStep - 1);
    }
  }, [canGoToPreviousStep, currentStep]);
  const handleEditStep = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);
  const handleSubmit = useCallback(async () => {
    try {
      await submitForm();
      router.push("/dashboard");
    } catch (error) {
      console.error("Form submission failed:", error);
    }
  }, [submitForm, router]);
  const handleSaveDraft = useCallback(async () => {
    try {
      await saveAsDraft();
      setShowExitModal(false);
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to save draft:", error);
    }
  }, [saveAsDraft, router]);
  const handleExit = useCallback(() => {
    if (hasUnsavedChanges) {
      setShowExitModal(true);
    } else {
      router.push("/dashboard");
    }
  }, [hasUnsavedChanges, router]);
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfoStep
            formData={formData}
            validationErrors={validationErrors}
            onFieldChange={updateField}
            isDisabled={isSubmitting}
          />
        );
      case 1:
        return (
          <ImagesStep
            imageStates={imageStates}
            validationErrors={validationErrors}
            onImagesAdd={addImages}
            onImageRemove={removeImage}
            onImageReorder={reorderImages}
            isDisabled={isSubmitting}
          />
        );
      case 2:
        return (
          <DetailsStep
            formData={formData}
            validationErrors={validationErrors}
            onFieldChange={updateField}
            isDisabled={isSubmitting}
          />
        );
      case 3:
        return (
          <SettingsStep
            formData={formData}
            onFieldChange={updateField}
            isDisabled={isSubmitting}
          />
        );
      case 4:
        return (
          <PreviewStep
            formData={formData}
            imageStates={imageStates}
            onEditStep={handleEditStep}
          />
        );
      default:
        return null;
    }
  };
  return (
    <Container className={clsx("py-6 sm:py-8 lg:py-12", className)}>
      <div className="max-w-4xl mx-auto">
        {}
        <div className="text-center mb-8">
          <Typography
            as={TypographyVariant.H1}
            className="text-3xl sm:text-4xl font-bold mb-4"
          >
            List Your Item
          </Typography>
          <Typography
            as={TypographyVariant.P}
            className="text-text-muted max-w-2xl mx-auto"
          >
            Share something you no longer need with your community. Help reduce
            waste and connect with neighbors.
          </Typography>
        </div>
        {}
        <StepIndicator
          currentStep={currentStep}
          totalSteps={FORM_STEPS.length}
          steps={FORM_STEPS}
        />
        {}
        <div className="mb-8">{renderCurrentStep()}</div>
        {}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t border-border">
          <div className="flex gap-3">
            <Button
              variant={ButtonVariant.OUTLINE}
              onClick={handleExit}
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              <FontAwesomeIcon icon={faTimes} className="w-4 h-4 mr-2" />
              Exit
            </Button>
            {currentStep === 4 && (
              <Button
                variant={ButtonVariant.SECONDARY}
                onClick={handleSaveDraft}
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                <FontAwesomeIcon icon={faSave} className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            {canGoToPreviousStep && (
              <Button
                variant={ButtonVariant.OUTLINE}
                onClick={handlePreviousStep}
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 mr-2" />
                Previous
              </Button>
            )}
            {currentStep < FORM_STEPS.length - 1 ? (
              <Button
                variant={ButtonVariant.PRIMARY}
                onClick={handleNextStep}
                disabled={!canProceedToNextStep || isSubmitting}
                className="min-w-[120px]"
              >
                Next
                <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                variant={ButtonVariant.PRIMARY}
                onClick={handleSubmit}
                disabled={!isValid || isSubmitting}
                isLoading={isSubmitting}
                className="min-w-[120px]"
              >
                <FontAwesomeIcon icon={faCheck} className="w-4 h-4 mr-2" />
                {isSubmitting ? "Publishing..." : "Publish Item"}
              </Button>
            )}
          </div>
        </div>
        {}
        <div className="text-center mt-6">
          <Typography as={TypographyVariant.SMALL} className="text-text-muted">
            Step {currentStep + 1} of {FORM_STEPS.length} •{" "}
            {Math.round(((currentStep + 1) / FORM_STEPS.length) * 100)}%
            Complete
          </Typography>
        </div>
      </div>
      {}
      <Modal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        size={ModalSize.MD}
        className="max-w-md"
      >
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-warning/10 rounded-full flex items-center justify-center">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="w-8 h-8 text-warning"
            />
          </div>
          <div className="space-y-3">
            <Typography as={TypographyVariant.H3} className="text-xl font-bold">
              Unsaved Changes
            </Typography>
            <Typography as={TypographyVariant.P} className="text-text-muted">
              You have unsaved changes. Would you like to save as draft or
              discard them?
            </Typography>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant={ButtonVariant.OUTLINE}
              onClick={() => setShowExitModal(false)}
              className="min-w-[120px]"
            >
              Keep Editing
            </Button>
            <Button
              variant={ButtonVariant.SECONDARY}
              onClick={handleSaveDraft}
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              Save Draft
            </Button>
            <Button
              variant={ButtonVariant.DESTRUCTIVE}
              onClick={() => {
                resetForm();
                setShowExitModal(false);
                router.push("/dashboard");
              }}
              className="min-w-[120px]"
            >
              Discard
            </Button>
          </div>
        </div>
      </Modal>
    </Container>
  );
};
