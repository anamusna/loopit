import clsx from "clsx";
import React, { forwardRef, useId, useMemo } from "react";
export enum CardVariant {
  DEFAULT = "default",
  ELEVATED = "elevated",
  GLASS = "glass",
  GRADIENT = "gradient",
  OUTLINE = "outline",
}
export enum CardSize {
  SM = "sm",
  MD = "md",
  LG = "lg",
  XL = "xl",
  FULL = "full",
}
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  size?: CardSize;
  title?: string;
  description?: string;
  children: React.ReactNode;
  isHoverable?: boolean;
  isClickable?: boolean;
  isLoading?: boolean;
  isCollapsible?: boolean;
  isExpanded?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  "aria-label"?: string;
  id?: string;
}
const Card = React.memo(
  forwardRef<HTMLDivElement, CardProps>(
    (
      {
        variant = CardVariant.DEFAULT,
        size = CardSize.MD,
        title,
        description,
        children,
        isHoverable = false,
        isClickable = false,
        isLoading = false,
        isCollapsible = false,
        isExpanded = true,
        onClick,
        className,
        "aria-label": ariaLabel,
        id,
        ...props
      },
      ref
    ) => {
      const sizeStyles = {
        [CardSize.SM]: "p-4",
        [CardSize.MD]: "p-6",
        [CardSize.LG]: "p-8",
        [CardSize.XL]: "p-10",
        [CardSize.FULL]: "w-full p-6",
      };
      const variantStyles = {
        [CardVariant.DEFAULT]:
          "bg-card text-card-foreground border border-border shadow-sm",
        [CardVariant.ELEVATED]:
          "bg-card text-card-foreground border border-border shadow-lg hover:shadow-xl",
        [CardVariant.GLASS]:
          "bg-card/80 text-card-foreground border border-border/50 shadow-lg backdrop-blur-sm",
        [CardVariant.GRADIENT]:
          "bg-gradient-to-br from-card to-secondary text-card-foreground border border-border shadow-lg",
        [CardVariant.OUTLINE]:
          "bg-transparent text-text-primary border-2 border-border",
      };
      const cardClassName = useMemo(
        () =>
          clsx(
            "relative rounded-lg overflow-hidden transition-all duration-200 ease-in-out",
            sizeStyles[size],
            variantStyles[variant],
            isHoverable && "hover:scale-105 hover:shadow-lg",
            isClickable && "cursor-pointer active:scale-95",
            onClick && "cursor-pointer",
            isLoading && "animate-pulse",
            className
          ),
        [variant, size, isHoverable, isClickable, onClick, isLoading, className]
      );
      const reactId = useId();
      const cardId = id || reactId;
      const LoadingSkeleton = () => (
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-secondary rounded w-3/4"></div>
          <div className="h-4 bg-secondary rounded w-1/2"></div>
          <div className="space-y-2">
            <div className="h-3 bg-secondary rounded"></div>
            <div className="h-3 bg-secondary rounded w-5/6"></div>
          </div>
        </div>
      );
      const CardHeader = () =>
        title || description ? (
          <div className="pb-4 border-b border-border">
            {title && (
              <h3 className="text-lg font-semibold text-text-primary leading-none tracking-tight">
                {title}
              </h3>
            )}
            {description && (
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                {description}
              </p>
            )}
          </div>
        ) : null;
      return (
        <div
          ref={ref}
          id={cardId}
          className={cardClassName}
          role="region"
          aria-label={ariaLabel || title}
          onClick={onClick}
          {...props}
        >
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <>
              <CardHeader />

              <div className={clsx("flex-1", (title || description) && "pt-4")}>
                {isCollapsible && !isExpanded ? null : children}
              </div>
            </>
          )}
        </div>
      );
    }
  )
);
Card.displayName = "Card";
export const CardHeader = React.memo(
  forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, children, ...props }, ref) => (
      <div
        ref={ref}
        className={clsx("flex flex-col space-y-1.5 pb-6", className)}
        {...props}
      >
        {children}
      </div>
    )
  )
);
CardHeader.displayName = "CardHeader";
export const CardBody = React.memo(
  forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, children, ...props }, ref) => (
      <div ref={ref} className={clsx("flex-1", className)} {...props}>
        {children}
      </div>
    )
  )
);
CardBody.displayName = "CardBody";
export const CardFooter = React.memo(
  forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, children, ...props }, ref) => (
      <div
        ref={ref}
        className={clsx("flex items-center pt-6", className)}
        {...props}
      >
        {children}
      </div>
    )
  )
);
CardFooter.displayName = "CardFooter";
export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}
export const CardTitle = React.memo(
  forwardRef<HTMLHeadingElement, CardTitleProps>(
    ({ className, children, level = 3, ...props }, ref) => {
      const titleClassName = clsx(
        "font-semibold leading-none tracking-tight text-text-primary",
        level === 1 && "text-3xl",
        level === 2 && "text-2xl",
        level === 3 && "text-xl",
        level === 4 && "text-lg",
        level === 5 && "text-base",
        level === 6 && "text-sm",
        className
      );
      const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
      return (
        <Tag ref={ref} className={titleClassName} {...props}>
          {children}
        </Tag>
      );
    }
  )
);
CardTitle.displayName = "CardTitle";
export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}
export const CardDescription = React.memo(
  forwardRef<HTMLParagraphElement, CardDescriptionProps>(
    ({ className, children, ...props }, ref) => (
      <p
        ref={ref}
        className={clsx(
          "text-sm leading-relaxed text-text-secondary",
          className
        )}
        {...props}
      >
        {children}
      </p>
    )
  )
);
CardDescription.displayName = "CardDescription";
export default Card;
