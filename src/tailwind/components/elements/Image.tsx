import clsx from "clsx";
import React, { useState } from "react";
export enum ImageSize {
  XS = "xs",
  SM = "sm",
  MD = "md",
  LG = "lg",
  XL = "xl",
  FULL = "full",
}
export enum ImageVariant {
  ROUNDED = "rounded",
  CIRCLE = "circle",
  SQUARE = "square",
}
export enum ImageFit {
  COVER = "cover",
  CONTAIN = "contain",
  FILL = "fill",
  SCALE_DOWN = "scale-down",
}
export interface ImageProps {
  src: string;
  alt: string;
  size?: ImageSize;
  variant?: ImageVariant;
  fit?: ImageFit;
  className?: string;
  width?: number;
  height?: number;
  placeholder?: string;
  fallbackSrc?: string;
  isLoading?: boolean;
  showLoadingSpinner?: boolean;
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  onClick?: (event: React.MouseEvent<HTMLImageElement>) => void;
}
const Image: React.FC<ImageProps> = React.memo(
  ({
    src,
    alt,
    size = ImageSize.MD,
    variant = ImageVariant.ROUNDED,
    fit = ImageFit.COVER,
    className = "",
    width,
    height,
    placeholder,
    fallbackSrc,
    isLoading = false,
    showLoadingSpinner = true,
    onLoad,
    onError,
    onClick,
  }) => {
    const [hasError, setHasError] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(true);
    const sizeStyles = {
      [ImageSize.XS]: "w-8 h-8",
      [ImageSize.SM]: "w-12 h-12",
      [ImageSize.MD]: "w-16 h-16",
      [ImageSize.LG]: "w-24 h-24",
      [ImageSize.XL]: "w-32 h-32",
      [ImageSize.FULL]: "w-full h-auto",
    };
    const variantStyles = {
      [ImageVariant.ROUNDED]: "rounded-lg",
      [ImageVariant.CIRCLE]: "rounded-full",
      [ImageVariant.SQUARE]: "rounded-none",
    };
    const fitStyles = {
      [ImageFit.COVER]: "object-cover",
      [ImageFit.CONTAIN]: "object-contain",
      [ImageFit.FILL]: "object-fill",
      [ImageFit.SCALE_DOWN]: "object-scale-down",
    };
    const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
      setIsImageLoading(false);
      if (onLoad) {
        onLoad(event);
      }
    };
    const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
      setHasError(true);
      setIsImageLoading(false);
      if (onError) {
        onError(event);
      }
    };
    const imageClassName = clsx(
      "transition-opacity duration-200",
      "border border-border",
      !width && !height && sizeStyles[size],
      variantStyles[variant],
      fitStyles[fit],
      onClick && "cursor-pointer hover:opacity-80",
      (isLoading || isImageLoading) && "opacity-50",
      className
    );
    const imageSrc = hasError && fallbackSrc ? fallbackSrc : src;
    const renderLoadingSpinner = () => {
      if (!showLoadingSpinner || (!isLoading && !isImageLoading)) return null;
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary/50 rounded-inherit">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      );
    };
    const renderPlaceholder = () => {
      if (!placeholder || !hasError || fallbackSrc) return null;
      return (
        <div
          className={clsx(
            "flex items-center justify-center bg-secondary text-text-muted",
            !width && !height && sizeStyles[size],
            variantStyles[variant],
            "border border-border"
          )}
        >
          <span className="text-sm font-medium">{placeholder}</span>
        </div>
      );
    };
    if (hasError && !fallbackSrc && placeholder) {
      return renderPlaceholder();
    }
    return (
      <div className="relative inline-block">
        <img
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          className={imageClassName}
          onLoad={handleLoad}
          onError={handleError}
          onClick={onClick}
          style={
            width || height
              ? {
                  width: width ? `${width}px` : undefined,
                  height: height ? `${height}px` : undefined,
                }
              : undefined
          }
        />
        {renderLoadingSpinner()}
      </div>
    );
  }
);
Image.displayName = "Image";
export default Image;
