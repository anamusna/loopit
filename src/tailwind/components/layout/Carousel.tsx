import clsx from "clsx";
import React, {
  ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useState,
} from "react";
export enum CarouselSize {
  SM = "sm",
  MD = "md",
  LG = "lg",
}
export enum CarouselVariant {
  DEFAULT = "default",
  CARD = "card",
  FULL = "full",
}
export interface CarouselItem {
  id: string | number;
  content: ReactNode;
  tagImage?: {
    carouselTag: string;
  };
}
export interface CarouselProps {
  items: CarouselItem[];
  size?: CarouselSize;
  variant?: CarouselVariant;
  autoPlay?: boolean;
  interval?: number;
  showControls?: boolean;
  showIndicators?: boolean;
  showPlayButton?: boolean;
  isReducedMotion?: boolean;
  onSlideChange?: (index: number) => void;
  className?: string;
  id?: string;
  "aria-label"?: string;
}
const Carousel = React.memo(
  forwardRef<HTMLDivElement, CarouselProps>(
    (
      {
        items,
        size = CarouselSize.MD,
        variant = CarouselVariant.DEFAULT,
        autoPlay = true,
        interval = 5000,
        showControls = true,
        showIndicators = true,
        showPlayButton = true,
        isReducedMotion = false,
        onSlideChange,
        className,
        id,
        "aria-label": ariaLabel,
      },
      ref
    ) => {
      const [currentIndex, setCurrentIndex] = useState(0);
      const [isPlaying, setIsPlaying] = useState(autoPlay);
      const sizeStyles = {
        [CarouselSize.SM]: "h-64",
        [CarouselSize.MD]: "h-96",
        [CarouselSize.LG]: "h-[32rem]",
      };
      const variantStyles = {
        [CarouselVariant.DEFAULT]: "rounded-lg",
        [CarouselVariant.CARD]: "rounded-xl shadow-lg",
        [CarouselVariant.FULL]: "rounded-none",
      };
      const controlButtonClasses = clsx(
        "absolute z-30 flex items-center justify-center",
        "backdrop-blur-xl bg-background/10 hover:bg-background/20",
        "border border-border/20 rounded-xl p-3",
        "shadow-lg hover:shadow-xl transition-all duration-300",
        "hover:-translate-y-1 focus:outline-none focus:ring-2",
        "focus:ring-primary/20 active:scale-95 cursor-pointer",
        "text-text-primary hover:text-primary"
      );
      const indicatorClasses = clsx(
        "absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-2",
        "backdrop-blur-md bg-background/10 px-4 py-3 rounded-xl",
        "border border-border/20 shadow-lg"
      );
      const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
      }, [items.length]);
      const previousSlide = useCallback(() => {
        setCurrentIndex(
          (prevIndex) => (prevIndex - 1 + items.length) % items.length
        );
      }, [items.length]);
      const goToSlide = useCallback(
        (index: number) => {
          setCurrentIndex(index);
          onSlideChange?.(index);
        },
        [onSlideChange]
      );
      useEffect(() => {
        let intervalId: NodeJS.Timeout;
        if (isPlaying && !isReducedMotion) {
          intervalId = setInterval(nextSlide, interval);
        }
        return () => {
          if (intervalId) {
            clearInterval(intervalId);
          }
        };
      }, [isPlaying, interval, nextSlide, isReducedMotion]);
      useEffect(() => {
        onSlideChange?.(currentIndex);
      }, [currentIndex, onSlideChange]);
      const handleKeyDown = useCallback(
        (event: React.KeyboardEvent) => {
          switch (event.key) {
            case "ArrowLeft":
              event.preventDefault();
              previousSlide();
              break;
            case "ArrowRight":
              event.preventDefault();
              nextSlide();
              break;
            case " ":
              event.preventDefault();
              setIsPlaying(!isPlaying);
              break;
          }
        },
        [previousSlide, nextSlide, isPlaying]
      );
      const carouselClassName = clsx(
        "relative w-full overflow-hidden",
        sizeStyles[size],
        variantStyles[variant],
        className
      );
      const carouselId =
        id || `carousel-${Math.random().toString(36).substr(2, 9)}`;
      return (
        <div
          ref={ref}
          id={carouselId}
          className={carouselClassName}
          role="region"
          aria-roledescription="carousel"
          aria-label={ariaLabel || `Carousel with ${items.length} slides`}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="relative h-full">
            {items.map((item, index) => (
              <div key={item.id}>
                <div
                  className={clsx(
                    "absolute inset-0 w-full h-full transition-all duration-700 ease-in-out",
                    index === currentIndex
                      ? "opacity-100 translate-x-0 z-10"
                      : "opacity-0 translate-x-full z-0"
                  )}
                  aria-hidden={index !== currentIndex}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`Slide ${index + 1} of ${items.length}`}
                >
                  {item.content}
                </div>

                {item.tagImage && (
                  <button
                    type="button"
                    className={clsx(
                      "absolute bottom-4 right-4 z-30 flex items-center justify-center",
                      "backdrop-blur-md bg-background/20 p-3 rounded-xl",
                      "border border-border/30 shadow-lg",
                      "hover:bg-background/30 transition-all duration-300",
                      "hover:-translate-y-1 hover:shadow-xl active:scale-95",
                      "cursor-pointer min-h-12 min-w-12"
                    )}
                    aria-label="Carousel Tag"
                  >
                    <img
                      src={item.tagImage?.carouselTag}
                      alt="Carousel Tag"
                      className="h-6 w-6 sm:h-8 sm:w-8"
                    />
                  </button>
                )}
              </div>
            ))}
          </div>

          {showControls && items.length > 1 && (
            <>
              <button
                type="button"
                className={clsx(
                  controlButtonClasses,
                  "left-4 top-1/2 -translate-y-1/2"
                )}
                onClick={previousSlide}
                aria-label="Previous slide"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                type="button"
                className={clsx(
                  controlButtonClasses,
                  "right-4 top-1/2 -translate-y-1/2"
                )}
                onClick={nextSlide}
                aria-label="Next slide"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}

          {showIndicators && items.length > 1 && (
            <div className={indicatorClasses}>
              {items.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={clsx(
                    "h-3 w-3 rounded-full transition-all duration-300 cursor-pointer",
                    index === currentIndex
                      ? "bg-primary shadow-lg scale-125"
                      : "bg-background/50 hover:bg-background/80 hover:scale-110"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          )}

          {showPlayButton && !isReducedMotion && (
            <button
              type="button"
              className={clsx(controlButtonClasses, "bottom-4 left-4")}
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? "Pause carousel" : "Play carousel"}
            >
              {isPlaying ? (
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          )}
        </div>
      );
    }
  )
);
Carousel.displayName = "Carousel";
export default Carousel;
