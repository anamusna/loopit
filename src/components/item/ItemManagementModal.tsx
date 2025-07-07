"use client";
import {
  getCarbonSavingsForCategory,
  getOffsetComparison,
} from "@/constants/environmentalImpact";
import { useItemForm } from "@/hooks/useItemForm";
import {
  getAvailableTransitions,
  getDaysUntilExpiration,
  getItemStatusInfo,
  shouldShowExpirationWarning,
} from "@/lib/utils/itemStatus";
import {
  ImageUploadState,
  Item,
  ItemListingFormData,
  ItemListingValidationErrors,
  ItemStatus,
} from "@/shared/types";
import { useLoopItStore } from "@/store";
import Button, {
  ButtonSize,
  ButtonVariant,
} from "@/tailwind/components/elements/Button";
import {
  Typography,
  TypographyVariant,
} from "@/tailwind/components/elements/Typography";
import Input from "@/tailwind/components/forms/Input";
import Select, { SelectState } from "@/tailwind/components/forms/Select";
import Textarea from "@/tailwind/components/forms/Textarea";
import Toggle from "@/tailwind/components/forms/Toggle";
import Modal, { ModalSize } from "@/tailwind/components/layout/Modal";
import {
  faChartLine,
  faEdit,
  faLeaf,
  faRocket,
  faSave,
  faTimes,
  faTrash,
  faUndo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import React, { useCallback, useEffect, useState } from "react";
import { CATEGORY_OPTIONS, CONDITION_OPTIONS } from "./CategoryOptions";
import { ImageUpload } from "./ImageUpload";
export interface ItemManagementModalProps {
  item: Item | null;
  isOpen: boolean;
  mode?: "add" | "edit";
  onClose: () => void;
  onItemUpdate?: (updatedItem: Item) => void;
  onItemDelete?: (itemId: string) => void;
}
const AnalyticsCard: React.FC<{ item: Item }> = ({ item }) => {
  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };
  const getEngagementRate = () => {
    const totalInteractions = item.views + item.saves + item.swapRequests;
    return totalInteractions > 0
      ? (((item.saves + item.swapRequests) / totalInteractions) * 100).toFixed(
          1
        )
      : "0";
  };
  const getCarbonSavingsInfo = () => {
    const baseSavings = getCarbonSavingsForCategory(item.category);
    const conditionMultiplier =
      {
        excellent: 1.2,
        good: 1.0,
        fair: 0.8,
        needs_repair: 0.6,
      }[item.condition] || 1.0;
    const estimatedSavings = Math.round(baseSavings * conditionMultiplier);
    const offset = getOffsetComparison(estimatedSavings);
    return {
      carbonSaved: estimatedSavings,
      carRides: offset.carRides,
      homeDays: offset.homeDays,
      treeDays: offset.treeDays,
    };
  };
  const carbonInfo = getCarbonSavingsInfo();
  return (
    <div className="space-y-4">
      {}
      <div
        className="animate-elegant-fade-up opacity-0"
        style={{ animationDelay: "50ms" }}
      >
        <div className="relative bg-gradient-to-br from-blue-50/80 to-indigo-50/60 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-sm border border-blue-200/40 dark:border-blue-800/40 rounded-2xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-sm">
              <FontAwesomeIcon
                icon={faChartLine}
                className="w-3 h-3 text-white"
              />
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Performance Analytics
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="text-center p-2 bg-white/60 dark:bg-gray-800/60 rounded-lg border border-white/40 dark:border-gray-700/40">
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                {formatNumber(item.views)}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Views
              </div>
            </div>
            <div className="text-center p-2 bg-white/60 dark:bg-gray-800/60 rounded-lg border border-white/40 dark:border-gray-700/40">
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {formatNumber(item.saves)}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Saves
              </div>
            </div>
            <div className="text-center p-2 bg-white/60 dark:bg-gray-800/60 rounded-lg border border-white/40 dark:border-gray-700/40">
              <div className="text-xl font-bold text-amber-600 dark:text-amber-400">
                {formatNumber(item.swapRequests)}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Requests
              </div>
            </div>
            <div className="text-center p-2 bg-white/60 dark:bg-gray-800/60 rounded-lg border border-white/40 dark:border-gray-700/40">
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {getEngagementRate()}%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Engagement
              </div>
            </div>
          </div>
        </div>
      </div>
      {}
      <div
        className="animate-elegant-fade-up opacity-0"
        style={{ animationDelay: "100ms" }}
      >
        <div className="relative bg-gradient-to-br from-emerald-50/80 to-green-50/60 dark:from-emerald-900/20 dark:to-green-900/20 backdrop-blur-sm border border-emerald-200/40 dark:border-emerald-800/40 rounded-2xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-sm">
              <FontAwesomeIcon icon={faLeaf} className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Environmental Impact
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-emerald-100/60 dark:bg-emerald-900/30 border border-emerald-200/40 dark:border-emerald-800/40 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                {carbonInfo.carbonSaved}kg
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                CO₂ Saved
              </div>
            </div>
            <div className="bg-blue-100/60 dark:bg-blue-900/30 border border-blue-200/40 dark:border-blue-800/40 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
                {carbonInfo.carRides}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                Car Rides
              </div>
            </div>
          </div>
          <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3 border border-white/40 dark:border-gray-700/40">
            <Typography
              as={TypographyVariant.P}
              className="text-xs text-gray-700 dark:text-gray-300 text-center"
            >
              This item saves the equivalent of{" "}
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {carbonInfo.carRides} car rides
              </span>{" "}
              or powers a home for{" "}
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {carbonInfo.homeDays} days
              </span>
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};
const StatusManagementCard: React.FC<{
  item: Item;
  onStatusChange: (newStatus: ItemStatus) => void;
  isDisabled?: boolean;
}> = ({ item, onStatusChange, isDisabled = false }) => {
  const currentStatusInfo = getItemStatusInfo(item.status);
  const availableTransitions = getAvailableTransitions(item.status);
  return (
    <div
      className="animate-elegant-fade-up opacity-0"
      style={{ animationDelay: "50ms" }}
    >
      <div className="relative bg-gradient-to-br from-purple-50/80 to-pink-50/60 dark:from-purple-900/20 dark:to-pink-900/20 backdrop-blur-sm border border-purple-200/40 dark:border-purple-800/40 rounded-2xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-sm">
            <span className="text-white text-xs font-bold">⚙️</span>
          </div>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Status Management
          </span>
        </div>
        {}
        <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg border border-white/40 dark:border-gray-700/40 mb-4">
          <span className="text-2xl">{currentStatusInfo.icon}</span>
          <div className="flex-1">
            <Typography
              as={TypographyVariant.P}
              className="font-medium text-sm"
            >
              {currentStatusInfo.label}
            </Typography>
            <Typography
              as={TypographyVariant.P}
              className="text-xs text-gray-600 dark:text-gray-400"
            >
              {currentStatusInfo.description}
            </Typography>
          </div>
        </div>
        {}
        {availableTransitions.length > 0 && (
          <div className="space-y-2">
            <Typography
              as={TypographyVariant.P}
              className="font-medium text-xs text-gray-700 dark:text-gray-300"
            >
              Available Actions:
            </Typography>
            <div className="flex flex-wrap gap-2">
              {availableTransitions.map((transition) => {
                const targetStatusInfo = getItemStatusInfo(transition.to);
                return (
                  <Button
                    key={transition.to}
                    variant={ButtonVariant.OUTLINE}
                    size={ButtonSize.SM}
                    onClick={() => onStatusChange(transition.to)}
                    disabled={isDisabled}
                    className="text-xs rounded-lg hover:scale-105 active:scale-95 transition-all duration-200"
                  >
                    <span className="mr-1">{targetStatusInfo.icon}</span>
                    {targetStatusInfo.label}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
        {}
        {shouldShowExpirationWarning(item) && (
          <div className="mt-4 p-3 bg-amber-50/80 dark:bg-amber-900/20 border border-amber-200/40 dark:border-amber-800/40 rounded-lg">
            <Typography
              as={TypographyVariant.P}
              className="text-xs text-amber-800 dark:text-amber-200"
            >
              ⚠️ Your listing expires in {getDaysUntilExpiration(item)} days.
              Consider renewing to keep it active.
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};
const BoostManagementCard: React.FC<{
  item: Item;
  onBoostToggle: (isBoosted: boolean) => void;
  isDisabled?: boolean;
}> = ({ item, onBoostToggle, isDisabled = false }) => {
  const isBoostActive =
    item.isBoosted &&
    item.boostExpiresAt &&
    new Date() < new Date(item.boostExpiresAt);
  return (
    <div
      className="animate-elegant-fade-up opacity-0"
      style={{ animationDelay: "100ms" }}
    >
      <div className="relative bg-gradient-to-br from-amber-50/80 to-orange-50/60 dark:from-amber-900/20 dark:to-orange-900/20 backdrop-blur-sm border border-amber-200/40 dark:border-amber-800/40 rounded-2xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-sm">
            <FontAwesomeIcon icon={faRocket} className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Boost Your Listing
          </span>
        </div>
        <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg border border-white/40 dark:border-gray-700/40 mb-3">
          <div className="flex-1">
            <Typography
              as={TypographyVariant.P}
              className="font-medium text-sm"
            >
              Featured Listing
            </Typography>
            <Typography
              as={TypographyVariant.P}
              className="text-xs text-gray-600 dark:text-gray-400"
            >
              {isBoostActive
                ? `Active until ${new Date(
                    item.boostExpiresAt!
                  ).toLocaleDateString()}`
                : "Appears at the top of search results for 7 days"}
            </Typography>
          </div>
          <Toggle
            checked={isBoostActive}
            onChange={(e) => onBoostToggle(e.target.checked)}
            disabled={isDisabled}
          />
        </div>
        {isBoostActive && (
          <div className="p-3 bg-emerald-50/80 dark:bg-emerald-900/20 border border-emerald-200/40 dark:border-emerald-800/40 rounded-lg">
            <Typography
              as={TypographyVariant.P}
              className="text-xs text-emerald-700 dark:text-emerald-300 font-medium"
            >
              🚀 Your listing is currently boosted and getting premium
              visibility!
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};
const EditForm: React.FC<{
  item: Item;
  formData: ItemListingFormData;
  validationErrors: ItemListingValidationErrors;
  imageStates: ImageUploadState[];
  onFieldChange: (field: keyof ItemListingFormData, value: any) => void;
  onImagesAdd: (files: File[]) => void;
  onImageRemove: (index: number) => void;
  onImageReorder: (fromIndex: number, toIndex: number) => void;
  isDisabled?: boolean;
}> = ({
  item,
  formData,
  validationErrors,
  imageStates,
  onFieldChange,
  onImagesAdd,
  onImageRemove,
  onImageReorder,
  isDisabled = false,
}) => (
  <div className="space-y-4">
    {}
    <div
      className="animate-elegant-fade-up opacity-0"
      style={{ animationDelay: "50ms" }}
    >
      <div className="relative bg-gradient-to-br from-blue-50/80 to-indigo-50/60 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-sm border border-blue-200/40 dark:border-blue-800/40 rounded-2xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-sm">
            <span className="text-white text-xs font-bold">1</span>
          </div>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Basic Information
          </span>
        </div>
        <div className="space-y-3">
          <Input
            label="Title"
            value={formData.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onFieldChange("title", e.target.value)
            }
            errorMessage={validationErrors.title}
            hasError={!!validationErrors.title}
            maxLength={100}
            disabled={isDisabled}
            className="rounded-lg"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              disabled={isDisabled}
              className="rounded-lg"
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
              disabled={isDisabled}
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
    {}
    <div
      className="animate-elegant-fade-up opacity-0"
      style={{ animationDelay: "100ms" }}
    >
      <div className="relative bg-gradient-to-br from-purple-50/80 to-pink-50/60 dark:from-purple-900/20 dark:to-pink-900/20 backdrop-blur-sm border border-purple-200/40 dark:border-purple-800/40 rounded-2xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-sm">
            <span className="text-white text-xs font-bold">2</span>
          </div>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Photos
          </span>
        </div>
        <ImageUpload
          images={imageStates}
          onImagesAdd={onImagesAdd}
          onImageRemove={onImageRemove}
          onImageReorder={onImageReorder}
          isDisabled={isDisabled}
          maxImages={5}
        />
      </div>
    </div>
    {}
    <div
      className="animate-elegant-fade-up opacity-0"
      style={{ animationDelay: "150ms" }}
    >
      <div className="relative bg-gradient-to-br from-emerald-50/80 to-green-50/60 dark:from-emerald-900/20 dark:to-green-900/20 backdrop-blur-sm border border-emerald-200/40 dark:border-emerald-800/40 rounded-2xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-sm">
            <span className="text-white text-xs font-bold">3</span>
          </div>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Description
          </span>
        </div>
        <Textarea
          value={formData.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            onFieldChange("description", e.target.value)
          }
          errorMessage={validationErrors.description}
          hasError={!!validationErrors.description}
          maxLength={500}
          showCharCount
          rows={4}
          disabled={isDisabled}
          className="rounded-lg"
        />
      </div>
    </div>
  </div>
);
export const ItemManagementModal: React.FC<ItemManagementModalProps> = ({
  item,
  isOpen,
  onClose,
  mode = "edit",
  onItemUpdate,
  onItemDelete,
}) => {
  const { user } = useLoopItStore();
  const [activeTab, setActiveTab] = useState<"edit" | "analytics" | "settings">(
    "edit"
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const isEditMode = mode === "edit" && !!item;
  const {
    formData,
    validationErrors,
    imageStates,
    isValid,
    updateField,
    addImages,
    removeImage,
    reorderImages,
    submitForm,
    resetForm,
  } = useItemForm({
    enableAutoSave: false,
    redirectAfterSubmit: false,
  });
  useEffect(() => {
    if (item && mode === "edit") {
      resetForm();
      updateField("title", item.title);
      updateField("category", item.category);
      updateField("condition", item.condition);
      updateField("description", item.description);
      updateField("location", item.location);
      updateField("tags", item.tags);
    } else if (mode === "add") {
      resetForm();
    }
  }, [item, mode, updateField, resetForm]);
  const handleStatusChange = useCallback(
    async (newStatus: ItemStatus) => {
      if (!item) return;
      try {
        setIsUpdating(true);
        const { updateItem } = useLoopItStore.getState();
        await updateItem(item.id, { status: newStatus });
        const updatedItem = { ...item, status: newStatus };
        onItemUpdate?.(updatedItem);
      } catch (error) {
        console.error("Failed to update item status:", error);
      } finally {
        setIsUpdating(false);
      }
    },
    [item, onItemUpdate]
  );
  const handleBoostToggle = useCallback(
    async (isBoosted: boolean) => {
      if (!item) return;
      try {
        setIsUpdating(true);
        const boostExpiresAt = isBoosted
          ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          : undefined;
        const updatedItem = {
          ...item,
          isBoosted,
          boostExpiresAt,
        };
        const { updateItem } = useLoopItStore.getState();
        await updateItem(item.id, { isBoosted, boostExpiresAt });
        onItemUpdate?.(updatedItem);
      } catch (error) {
        console.error("Failed to update boost status:", error);
      } finally {
        setIsUpdating(false);
      }
    },
    [item, onItemUpdate]
  );
  const handleSave = useCallback(async () => {
    if (!isValid) return;
    try {
      setIsUpdating(true);
      await submitForm();
      if (item) {
        const { items } = useLoopItStore.getState();
        const updatedItem = items.find((i) => i.id === item.id);
        if (updatedItem) {
          onItemUpdate?.(updatedItem);
        }
      }
      onClose();
    } catch (error) {
      console.error("Failed to save item:", error);
    } finally {
      setIsUpdating(false);
    }
  }, [item, isValid, submitForm, onItemUpdate, onClose]);
  const handleDelete = useCallback(async () => {
    if (!item) return;
    try {
      setIsUpdating(true);
      const { deleteItem } = useLoopItStore.getState();
      await deleteItem(item.id);
      onItemDelete?.(item.id);
      setShowDeleteConfirm(false);
      onClose();
    } catch (error) {
      console.error("Failed to delete item:", error);
    } finally {
      setIsUpdating(false);
    }
  }, [item, onItemDelete, onClose]);
  const handleRenew = useCallback(async () => {
    if (!item) return;
    try {
      setIsUpdating(true);
      const renewedItem = {
        ...item,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 
        updatedAt: new Date(),
      };
      const { updateItem } = useLoopItStore.getState();
      await updateItem(item.id, {
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      });
      onItemUpdate?.(renewedItem);
    } catch (error) {
      console.error("Failed to renew item:", error);
    } finally {
      setIsUpdating(false);
    }
  }, [item, onItemUpdate]);
  const tabs = [
    { id: "edit", label: "Edit", icon: faEdit },
    { id: "analytics", label: "Analytics", icon: faChartLine },
    { id: "settings", label: "Settings", icon: faRocket },
  ] as const;
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={ModalSize.XL}
      title={isEditMode ? "Edit Your Item" : "Add New Item"}
      subtitle="Manage your item details and performance"
      icon={<FontAwesomeIcon icon={faEdit} className="w-5 h-5" />}
      className="max-w-full sm:max-w-2xl md:max-w-3xl mx-auto"
    >
      <div className="space-y-4 sm:space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
        {}
        <div
          className="animate-elegant-fade-up opacity-0"
          style={{ animationDelay: "50ms" }}
        >
          <div className="flex border-b border-gray-200/60 dark:border-gray-700/60 overflow-x-auto bg-white/90 dark:bg-gray-900/90 rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  "flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-lg transition-all duration-200 whitespace-nowrap min-w-fit text-sm font-semibold",
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-primary to-accent text-white shadow-md shadow-primary/20"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100/80 dark:hover:bg-gray-800/80"
                )}
              >
                <FontAwesomeIcon icon={tab.icon} className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        {}
        <div className="space-y-4">
          {activeTab === "edit" && (
            <EditForm
              item={item!}
              formData={formData}
              validationErrors={validationErrors}
              imageStates={imageStates}
              onFieldChange={updateField}
              onImagesAdd={addImages}
              onImageRemove={removeImage}
              onImageReorder={reorderImages}
              isDisabled={isUpdating}
            />
          )}
          {activeTab === "analytics" && item && <AnalyticsCard item={item} />}
          {activeTab === "settings" && item && (
            <div className="space-y-4">
              <StatusManagementCard
                item={item}
                onStatusChange={handleStatusChange}
                isDisabled={isUpdating}
              />
              <BoostManagementCard
                item={item}
                onBoostToggle={handleBoostToggle}
                isDisabled={isUpdating}
              />
            </div>
          )}
        </div>
        {}
        <div
          className="animate-elegant-fade-up opacity-0 pt-4 border-t border-gray-200/40 dark:border-gray-700/40"
          style={{ animationDelay: "200ms" }}
        >
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <div className="flex flex-1 flex-wrap gap-2 sm:gap-3">
              {activeTab === "edit" && (
                <Button
                  variant={ButtonVariant.PRIMARY}
                  onClick={handleSave}
                  disabled={!isValid || isUpdating}
                  isLoading={isUpdating}
                  size={ButtonSize.MD}
                  className="flex-1 min-w-[120px] rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
                >
                  <FontAwesomeIcon icon={faSave} className="w-4 h-4 mr-2" />
                  {isEditMode ? "Save Changes" : "Create Item"}
                </Button>
              )}
              {activeTab === "settings" &&
                item &&
                shouldShowExpirationWarning(item) && (
                  <Button
                    variant={ButtonVariant.SECONDARY}
                    onClick={handleRenew}
                    disabled={isUpdating}
                    isLoading={isUpdating}
                    size={ButtonSize.MD}
                    className="flex-1 min-w-[120px] rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
                  >
                    <FontAwesomeIcon icon={faUndo} className="w-4 h-4 mr-2" />
                    Renew Listing
                  </Button>
                )}
              {isEditMode && (
                <Button
                  variant={ButtonVariant.DESTRUCTIVE}
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isUpdating}
                  size={ButtonSize.MD}
                  className="flex-1 min-w-[120px] rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
                >
                  <FontAwesomeIcon icon={faTrash} className="w-4 h-4 mr-2" />
                  Delete Item
                </Button>
              )}
            </div>
            <Button
              variant={ButtonVariant.OUTLINE}
              onClick={onClose}
              disabled={isUpdating}
              size={ButtonSize.MD}
              className="flex-1 min-w-[100px] rounded-xl border hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
            >
              <FontAwesomeIcon icon={faTimes} className="w-4 h-4 mr-2" />
              Close
            </Button>
          </div>
        </div>
      </div>
      {}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        size={ModalSize.MD}
        className="max-w-md mx-auto"
      >
        <div className="text-center space-y-6 p-6">
          <div className="w-20 h-20 mx-auto bg-destructive/10 rounded-full flex items-center justify-center shadow-lg">
            <FontAwesomeIcon
              icon={faTrash}
              className="w-10 h-10 text-destructive"
            />
          </div>
          <div className="space-y-4">
            <Typography
              as={TypographyVariant.H3}
              className="text-2xl font-bold text-text-primary"
            >
              Delete Item
            </Typography>
            <Typography
              as={TypographyVariant.P}
              className="text-text-muted leading-relaxed"
            >
              Are you sure you want to delete &quot;{item?.title}&quot;? This
              action cannot be undone and will permanently remove this item from
              your listings.
            </Typography>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button
              variant={ButtonVariant.OUTLINE}
              onClick={() => setShowDeleteConfirm(false)}
              size={ButtonSize.LG}
              className="flex-1 sm:flex-none min-w-[120px]"
            >
              Cancel
            </Button>
            <Button
              variant={ButtonVariant.DESTRUCTIVE}
              onClick={handleDelete}
              disabled={isUpdating}
              isLoading={isUpdating}
              size={ButtonSize.LG}
              className="flex-1 sm:flex-none min-w-[120px]"
            >
              {isUpdating ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </Modal>
  );
};
