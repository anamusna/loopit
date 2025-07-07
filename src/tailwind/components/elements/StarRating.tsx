import clsx from "clsx";
import React, { useCallback, useMemo, useState } from "react";
export interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
  showLabel?: boolean;
  className?: string;
}
const StarRating: React.FC<StarRatingProps> = React.memo(
  ({
    rating,
    onRatingChange,
    size = "md",
    readonly = false,
    showLabel = false,
    className = "",
  }) => {
    const [hoverRating, setHoverRating] = useState(0);
    const sizeClasses = useMemo(
      () => ({
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6",
      }),
      []
    );
    const starNumbers = useMemo(() => [1, 2, 3, 4, 5], []);
    const currentRating = useMemo(
      () => hoverRating || rating,
      [hoverRating, rating]
    );
    const labelText = useMemo(() => `${rating.toFixed(1)} out of 5`, [rating]);
    const handleStarClick = useCallback(
      (starRating: number) => {
        if (!readonly && onRatingChange) {
          onRatingChange(starRating);
        }
      },
      [readonly, onRatingChange]
    );
    const handleStarHover = useCallback(
      (starRating: number) => {
        if (!readonly) {
          setHoverRating(starRating);
        }
      },
      [readonly]
    );
    const handleStarLeave = useCallback(() => {
      if (!readonly) {
        setHoverRating(0);
      }
    }, [readonly]);
    const getStarIcon = useCallback(
      (starNumber: number) => {
        const isFilled = starNumber <= currentRating;
        const isHalf = !isFilled && starNumber - 0.5 <= currentRating;
        if (isFilled) {
          return (
            <svg
              className={clsx(
                "text-warning transition-colors duration-200",
                sizeClasses[size]
              )}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          );
        }
        if (isHalf) {
          return (
            <div className="relative">
              <svg
                className={clsx(
                  "text-gray-300 transition-colors duration-200",
                  sizeClasses[size]
                )}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <svg
                className={clsx(
                  "text-warning absolute inset-0 transition-colors duration-200",
                  sizeClasses[size]
                )}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                style={{ clipPath: "inset(0 50% 0 0)" }}
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          );
        }
        return (
          <svg
            className={clsx(
              "text-gray-300 transition-colors duration-200",
              sizeClasses[size]
            )}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      },
      [currentRating, sizeClasses, size]
    );
    return (
      <div className={clsx("flex items-center gap-1", className)}>
        <div className="flex items-center">
          {starNumbers.map((starNumber) => (
            <button
              key={starNumber}
              type="button"
              onClick={() => handleStarClick(starNumber)}
              onMouseEnter={() => handleStarHover(starNumber)}
              onMouseLeave={handleStarLeave}
              disabled={readonly}
              className={clsx(
                "transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-warning focus:ring-offset-1 rounded",
                !readonly && "hover:scale-110 cursor-pointer",
                readonly && "cursor-default"
              )}
              aria-label={`Rate ${starNumber} star${
                starNumber !== 1 ? "s" : ""
              }`}
              aria-pressed={starNumber <= rating}
            >
              {getStarIcon(starNumber)}
            </button>
          ))}
        </div>
        {showLabel && (
          <span className="ml-2 text-sm text-text-muted">{labelText}</span>
        )}
      </div>
    );
  }
);
StarRating.displayName = "StarRating";
export default StarRating;
