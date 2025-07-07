"use client";
import { ImageUpload } from "@/components/item/ImageUpload";
import {
  ImageUploadState,
  ItemCategory,
  ItemCondition,
  OfferedItem,
} from "@/shared/types";
import Input from "@/tailwind/components/forms/Input";
import Select from "@/tailwind/components/forms/Select";
import Textarea from "@/tailwind/components/forms/Textarea";
import {
  faCheckCircle,
  faExchangeAlt,
  faImage,
  faInfoCircle,
  faMapMarkerAlt,
  faPalette,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import React, { useCallback, useMemo } from "react";
export interface OfferedItemFormProps {
  offeredItem: OfferedItem;
  onOfferedItemChange: (offeredItem: OfferedItem) => void;
  isDisabled?: boolean;
  className?: string;
}
const OfferedItemForm: React.FC<OfferedItemFormProps> = React.memo(
  ({
    offeredItem,
    onOfferedItemChange,
    isDisabled = false,
    className = "",
  }) => {
    const conditionOptions = useMemo(
      () => [
        { value: "", label: "Select condition" },
        { value: ItemCondition.EXCELLENT, label: "🌟 Excellent" },
        { value: ItemCondition.GOOD, label: "✨ Good" },
        { value: ItemCondition.FAIR, label: "👍 Fair" },
        { value: ItemCondition.NEEDS_REPAIR, label: "🔧 Needs Repair" },
      ],
      []
    );
    const categoryOptions = useMemo(
      () => [
        { value: "", label: "Select category" },
        { value: ItemCategory.CLOTHING, label: "👕 Clothing" },
        { value: ItemCategory.BOOKS, label: "📚 Books" },
        { value: ItemCategory.FURNITURE, label: "🪑 Furniture" },
        { value: ItemCategory.ELECTRONICS, label: "📱 Electronics" },
        { value: ItemCategory.TOYS, label: "🧸 Toys" },
        { value: ItemCategory.SPORTS, label: "⚽ Sports" },
        { value: ItemCategory.HOUSEHOLD, label: "🏠 Household" },
        { value: ItemCategory.OTHER, label: "📦 Other" },
      ],
      []
    );
    const handleFieldChange = useCallback(
      (
        field: keyof OfferedItem,
        value:
          | string
          | ItemCategory
          | ItemCondition
          | string[]
          | ImageUploadState[]
      ) => {
        onOfferedItemChange({
          ...offeredItem,
          [field]: value,
        });
      },
      [offeredItem, onOfferedItemChange]
    );
    const handleImagesAdd = useCallback(
      (files: File[]) => {
        const newImages = files.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
          isUploading: false,
          isUploaded: false,
        }));
        handleFieldChange("images", [...offeredItem.images, ...newImages]);
      },
      [offeredItem.images, handleFieldChange]
    );
    const handleImageRemove = useCallback(
      (index: number) => {
        const newImages = offeredItem.images.filter((_, i) => i !== index);
        handleFieldChange("images", newImages);
      },
      [offeredItem.images, handleFieldChange]
    );
    const handleImageReorder = useCallback(
      (fromIndex: number, toIndex: number) => {
        const newImages = [...offeredItem.images];
        const [movedImage] = newImages.splice(fromIndex, 1);
        newImages.splice(toIndex, 0, movedImage);
        handleFieldChange("images", newImages);
      },
      [offeredItem.images, handleFieldChange]
    );
    const handleTagsChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const tags = e.target.value
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0);
        handleFieldChange("tags", tags);
      },
      [handleFieldChange]
    );
    const completionPercentage = useMemo(() => {
      const fields = [
        offeredItem.title.trim(),
        offeredItem.category,
        offeredItem.condition,
        offeredItem.description.trim(),
        offeredItem.location.trim(),
        offeredItem.images.length > 0 ? "images" : "",
      ];
      const completed = fields.filter(Boolean).length;
      return Math.round((completed / fields.length) * 100);
    }, [offeredItem]);
    return (
      <div className={clsx("space-y-4 sm:space-y-5", className)}>
        {}
        <div className="flex items-center justify-between pb-2 border-b border-purple-200/30 dark:border-purple-800/30">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon
                icon={faExchangeAlt}
                className="w-3 h-3 text-white"
              />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Your Trade Offer
              </h3>
            </div>
          </div>
          {}
          <div className="flex items-center gap-2">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {completionPercentage}%
            </div>
            <div className="w-8 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
        {}
        <div className="space-y-4">
          {}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faTag}
                className="w-3 h-3 text-purple-500"
              />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Item Title
              </span>
            </div>
            <Input
              label=""
              placeholder="e.g., Vintage Denim Jacket"
              value={offeredItem.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              disabled={isDisabled}
              required
              className="rounded-lg border border-gray-200/60 dark:border-gray-700/60 focus:border-purple-400 dark:focus:border-purple-500 bg-white/90 dark:bg-gray-900/90 text-sm"
            />
          </div>
          {}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faPalette}
                  className="w-3 h-3 text-blue-500"
                />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Category
                </span>
              </div>
              <Select
                label=""
                value={offeredItem.category}
                onChange={(e) =>
                  handleFieldChange("category", e.target.value as ItemCategory)
                }
                disabled={isDisabled}
                required
                options={categoryOptions}
                className="rounded-lg border border-gray-200/60 dark:border-gray-700/60 focus:border-blue-400 dark:focus:border-blue-500 bg-white/90 dark:bg-gray-900/90 text-sm"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="w-3 h-3 text-emerald-500"
                />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Condition
                </span>
              </div>
              <Select
                label=""
                value={offeredItem.condition}
                onChange={(e) =>
                  handleFieldChange(
                    "condition",
                    e.target.value as ItemCondition
                  )
                }
                disabled={isDisabled}
                required
                options={conditionOptions}
                className="rounded-lg border border-gray-200/60 dark:border-gray-700/60 focus:border-emerald-400 dark:focus:border-emerald-500 bg-white/90 dark:bg-gray-900/90 text-sm"
              />
            </div>
          </div>
          {}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faInfoCircle}
                className="w-3 h-3 text-indigo-500"
              />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Description
              </span>
            </div>
            <Textarea
              label=""
              placeholder="Describe your item in detail..."
              value={offeredItem.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              rows={3}
              maxLength={500}
              showCharCount
              disabled={isDisabled}
              required
              className="rounded-lg border border-gray-200/60 dark:border-gray-700/60 focus:border-indigo-400 dark:focus:border-indigo-500 bg-white/90 dark:bg-gray-900/90 resize-none text-sm"
            />
          </div>
          {}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="w-3 h-3 text-red-500"
                />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Location
                </span>
              </div>
              <Input
                label=""
                placeholder="e.g., Downtown"
                value={offeredItem.location}
                onChange={(e) => handleFieldChange("location", e.target.value)}
                disabled={isDisabled}
                required
                className="rounded-lg border border-gray-200/60 dark:border-gray-700/60 focus:border-red-400 dark:focus:border-red-500 bg-white/90 dark:bg-gray-900/90 text-sm"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                  #
                </span>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Tags
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                  Optional
                </span>
              </div>
              <Input
                label=""
                placeholder="vintage, handmade..."
                value={offeredItem.tags.join(", ")}
                onChange={handleTagsChange}
                disabled={isDisabled}
                className="rounded-lg border border-gray-200/60 dark:border-gray-700/60 focus:border-amber-400 dark:focus:border-amber-500 bg-white/90 dark:bg-gray-900/90 text-sm"
              />
            </div>
          </div>
          {}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faImage}
                className="w-3 h-3 text-violet-500"
              />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Photos
              </span>
              <span className="text-xs text-white bg-violet-500 px-1.5 py-0.5 rounded">
                Required
              </span>
            </div>
            <div className="bg-gradient-to-br from-violet-50/60 to-purple-50/60 dark:from-violet-900/10 dark:to-purple-900/10 border border-dashed border-violet-200/60 dark:border-violet-800/60 rounded-lg p-3 transition-all duration-300 hover:border-violet-300 dark:hover:border-violet-700">
              <ImageUpload
                images={offeredItem.images}
                maxImages={5}
                onImagesAdd={handleImagesAdd}
                onImageRemove={handleImageRemove}
                onImageReorder={handleImageReorder}
                isDisabled={isDisabled}
              />
            </div>
          </div>
        </div>
        {}
        {completionPercentage === 100 && (
          <div className="bg-gradient-to-r from-emerald-50/80 to-green-50/80 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200/60 dark:border-emerald-800/60 rounded-lg p-3 animate-elegant-fade-up">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="w-2.5 h-2.5 text-white"
                />
              </div>
              <div className="text-xs text-emerald-800 dark:text-emerald-200">
                <span className="font-medium">Perfect!</span> Your offer is
                ready to send.
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);
OfferedItemForm.displayName = "OfferedItemForm";
export default OfferedItemForm;
