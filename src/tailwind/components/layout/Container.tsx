import clsx from "clsx";
import React, { forwardRef, useId } from "react";
export enum ContainerSize {
  SM = "sm",
  MD = "md",
  LG = "lg",
  XL = "xl",
  XL2 = "2xl",
  FULL = "full",
}
export enum ContainerVariant {
  DEFAULT = "default",
  CENTERED = "centered",
  FLUID = "fluid",
}
export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
  variant?: ContainerVariant;
  children: React.ReactNode;
  isCentered?: boolean;
  isFluid?: boolean;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  "aria-label"?: string;
}
const Container = React.memo(
  forwardRef<HTMLDivElement, ContainerProps>(
    (
      {
        size = ContainerSize.FULL,
        variant = ContainerVariant.DEFAULT,
        children,
        isCentered = true,
        isFluid = false,
        className,
        style,
        id,
        "aria-label": ariaLabel,
        ...props
      },
      ref
    ) => {
      const sizeStyles = {
        [ContainerSize.SM]: "max-w-sm", 
        [ContainerSize.MD]: "max-w-md", 
        [ContainerSize.LG]: "max-w-4xl", 
        [ContainerSize.XL]: "max-w-5xl", 
        [ContainerSize.XL2]: "max-w-7xl", 
        [ContainerSize.FULL]: "max-w-none w-full",
      };
      const variantStyles = {
        [ContainerVariant.DEFAULT]: "mx-auto px-4 sm:px-6 lg:px-8",
        [ContainerVariant.CENTERED]: "mx-auto px-4 sm:px-6 lg:px-8 text-center",
        [ContainerVariant.FLUID]: "w-full px-4 sm:px-6 lg:px-8",
      };
      const containerClassName = clsx(
        "w-full",
        !isFluid && sizeStyles[size],
        variantStyles[variant],
        !isCentered && variant === ContainerVariant.DEFAULT && "mx-0",
        isFluid && "max-w-none",
        className
      );
      const reactId = useId();
      const containerId = id || `container-${reactId}`;
      return (
        <div
          ref={ref}
          id={containerId}
          className={containerClassName}
          style={style}
          role="main"
          aria-label={ariaLabel}
          {...props}
        >
          {children}
        </div>
      );
    }
  )
);
Container.displayName = "Container";
export default Container;
