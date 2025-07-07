import { ImageUploadState } from "@/shared/types";
import Icon from "@/tailwind/components/elements/Icon";
import Alert, { AlertVariant } from "@/tailwind/components/layout/Alert";
import {
  faCamera,
  faCheckCircle,
  faCrop,
  faExclamationTriangle,
  faGripVertical,
  faRotate,
  faSpinner,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import React, { useCallback, useRef, useState } from "react";
export interface ImageUploadProps {
  images: ImageUploadState[];
  maxImages?: number;
  onImagesAdd: (files: File[]) => void;
  onImageRemove: (index: number) => void;
  onImageReorder?: (fromIndex: number, toIndex: number) => void;
  onImageCrop?: (index: number, croppedFile: File) => void;
  onImageRotate?: (index: number, rotatedFile: File) => void;
  isDisabled?: boolean;
  className?: string;
}
const optimizeImage = async (
  file: File,
  maxWidth: number = 1200,
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      const newWidth = img.width * ratio;
      const newHeight = img.height * ratio;
      canvas.width = newWidth;
      canvas.height = newHeight;
      ctx?.drawImage(img, 0, 0, newWidth, newHeight);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const optimizedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(optimizedFile);
          } else {
            resolve(file);
          }
        },
        "image/jpeg",
        quality
      );
    };
    img.src = URL.createObjectURL(file);
  });
};
export const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  maxImages = 5,
  onImagesAdd,
  onImageRemove,
  onImageReorder,
  onImageCrop,
  onImageRotate,
  isDisabled = false,
  className = "",
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canAddMore = images.length < maxImages;
  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const fileArray = Array.from(files);
      const remainingSlots = maxImages - images.length;
      const filesToAdd = fileArray.slice(0, remainingSlots);
      const validFiles = filesToAdd.filter((file) => {
        return file.type.startsWith("image/") && file.size <= 10 * 1024 * 1024;
      });
      if (validFiles.length > 0) {
        setIsOptimizing(true);
        try {
          const optimizedFiles = await Promise.all(
            validFiles.map((file) => optimizeImage(file))
          );
          onImagesAdd(optimizedFiles);
        } catch (error) {
          console.error("Image optimization failed:", error);
          onImagesAdd(validFiles);
        } finally {
          setIsOptimizing(false);
        }
      }
    },
    [images.length, maxImages, onImagesAdd]
  );
  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!isDisabled && canAddMore) {
        setIsDragOver(true);
      }
    },
    [isDisabled, canAddMore]
  );
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (isDisabled) return;
      const files = e.dataTransfer.files;
      handleFileSelect(files);
    },
    [isDisabled, handleFileSelect]
  );
  const handleImageDragStart = useCallback(
    (e: React.DragEvent, index: number) => {
      setDraggedIndex(index);
      e.dataTransfer.effectAllowed = "move";
    },
    []
  );
  const handleImageDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      if (draggedIndex !== null && draggedIndex !== index) {
        e.dataTransfer.dropEffect = "move";
      }
    },
    [draggedIndex]
  );
  const handleImageDrop = useCallback(
    (e: React.DragEvent, dropIndex: number) => {
      e.preventDefault();
      if (
        draggedIndex !== null &&
        draggedIndex !== dropIndex &&
        onImageReorder
      ) {
        onImageReorder(draggedIndex, dropIndex);
      }
      setDraggedIndex(null);
    },
    [draggedIndex, onImageReorder]
  );
  const handleImageDragEnd = useCallback(() => {
    setDraggedIndex(null);
  }, []);
  const handleCrop = useCallback((index: number) => {
    console.log("Crop image at index:", index);
  }, []);
  const handleRotate = useCallback(
    async (index: number) => {
      const imageState = images[index];
      if (!imageState || !imageState.file) return;
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
          canvas.width = img.height;
          canvas.height = img.width;
          ctx?.translate(canvas.width / 2, canvas.height / 2);
          ctx?.rotate(Math.PI / 2);
          ctx?.drawImage(img, -img.width / 2, -img.height / 2);
          canvas.toBlob(
            (blob) => {
              if (blob && onImageRotate) {
                const rotatedFile = new File([blob], imageState.file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                });
                onImageRotate(index, rotatedFile);
              }
            },
            "image/jpeg",
            0.9
          );
        };
        img.src = imageState.preview;
      } catch (error) {
        console.error("Image rotation failed:", error);
      }
    },
    [images, onImageRotate]
  );
  return (
    <div className={clsx("space-y-6 sm:space-y-8", className)}>
      {canAddMore && (
        <div
          className={clsx(
            "group relative border-2 border-dashed rounded-xl p-8 sm:p-10 lg:p-12 text-center transition-all duration-300 hover:shadow-lg",
            {
              "border-primary-400 bg-primary/10 shadow-lg transform scale-[1.02]":
                isDragOver,
              "border-border hover:border-primary/50 hover:bg-primary/5":
                !isDragOver && !isDisabled,
              "border-border/50 opacity-50 cursor-not-allowed": isDisabled,
            }
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            multiple
            onChange={(e) => handleFileSelect(e.target.files)}
            disabled={isDisabled}
          />

          <div className="space-y-6">
            {isOptimizing && (
              <div className="flex items-center justify-center p-4">
                <Icon
                  icon={faSpinner}
                  className="w-6 h-6 text-primary animate-spin mr-2"
                />
                <span className="text-sm text-text-muted">
                  Optimizing images...
                </span>
              </div>
            )}

            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon icon={faCamera} className="w-12 h-12 text-primary" />
              </div>

              <div className="text-center">
                <p className="text-lg font-semibold text-text-primary mb-2">
                  {isDragOver ? "Drop images here" : "Upload Photos"}
                </p>
                <p className="text-sm text-text-muted mb-4">
                  Drag & drop or click to select ({images.length}/{maxImages})
                </p>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isDisabled || isOptimizing}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Choose Files
                </button>
              </div>
            </div>

            <div className="w-full bg-secondary rounded-full h-2 sm:h-3">
              <div
                className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(images.length / maxImages) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {images.length > 0 && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-text-primary">
              Image Preview ({images.length})
            </h4>
            <p className="text-sm text-text-muted">
              Drag to reorder • First image will be the cover
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {images.map((imageState, index) => (
              <div
                key={index}
                className={clsx(
                  "group relative bg-card border border-border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg",
                  {
                    "ring-2 ring-primary/50 scale-105": draggedIndex === index,
                    "opacity-50": imageState.isUploading,
                  }
                )}
                draggable={!isDisabled && onImageReorder !== undefined}
                onDragStart={(e) => handleImageDragStart(e, index)}
                onDragOver={(e) => handleImageDragOver(e, index)}
                onDrop={(e) => handleImageDrop(e, index)}
                onDragEnd={handleImageDragEnd}
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={imageState.preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />

                  {imageState.isUploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-center">
                        <Icon
                          icon={faSpinner}
                          className="w-6 h-6 text-white animate-spin mx-auto mb-2"
                        />
                        <p className="text-white text-sm">Uploading...</p>
                      </div>
                    </div>
                  )}
                  {imageState.isUploaded && (
                    <div className="absolute top-2 right-2">
                      <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                        <Icon
                          icon={faCheckCircle}
                          className="w-4 h-4 text-white"
                        />
                      </div>
                    </div>
                  )}
                  {imageState.error && (
                    <div className="absolute inset-0 bg-destructive/20 flex items-center justify-center">
                      <div className="text-center">
                        <Icon
                          icon={faExclamationTriangle}
                          className="w-6 h-6 text-destructive mx-auto mb-2"
                        />
                        <p className="text-destructive text-sm">
                          Upload failed
                        </p>
                      </div>
                    </div>
                  )}

                  {onImageReorder && (
                    <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="w-6 h-6 bg-black/50 rounded flex items-center justify-center cursor-move">
                        <Icon
                          icon={faGripVertical}
                          className="w-3 h-3 text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-text-muted">
                      Image {index + 1}
                    </span>
                    {index === 0 && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        Cover
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleCrop(index)}
                      className="flex-1 p-2 text-xs bg-secondary hover:bg-secondary/80 rounded transition-colors duration-200"
                      disabled={isDisabled || imageState.isUploading}
                      title="Crop image"
                    >
                      <Icon icon={faCrop} className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRotate(index)}
                      className="flex-1 p-2 text-xs bg-secondary hover:bg-secondary/80 rounded transition-colors duration-200"
                      disabled={isDisabled || imageState.isUploading}
                      title="Rotate image"
                    >
                      <Icon icon={faRotate} className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onImageRemove(index)}
                      className="flex-1 p-2 text-xs bg-destructive/10 hover:bg-destructive/20 text-destructive rounded transition-colors duration-200"
                      disabled={isDisabled || imageState.isUploading}
                      title="Remove image"
                    >
                      <Icon icon={faTrash} className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {images.some((img) => img.error) && (
        <Alert
          variant={AlertVariant.ERROR}
          message="Some images failed to upload. Please try again or remove them."
          className="mt-4"
        />
      )}

      <div className="bg-info/5 border border-info/20 rounded-lg p-4">
        <h4 className="font-medium text-info mb-2">💡 Tips for great photos</h4>
        <ul className="text-sm text-text-muted space-y-1">
          <li>• Use good lighting and clear backgrounds</li>
          <li>• Show any damage or wear clearly</li>
          <li>• Include multiple angles for better visibility</li>
          <li>• First image will be the cover photo</li>
        </ul>
      </div>
    </div>
  );
};
