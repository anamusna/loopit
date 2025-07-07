import { IconDefinition, SizeProp } from "@fortawesome/fontawesome-svg-core";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import React from "react";
export enum IconSize {
  XS = "xs",
  SM = "sm",
  MD = "md",
  LG = "lg",
  XL = "xl",
  XL2 = "2xl",
  XL3 = "3xl",
  XL4 = "4xl",
}
export enum IconColor {
  INHERIT = "inherit",
  PRIMARY = "primary",
  SECONDARY = "secondary",
  ACCENT = "accent",
  MUTED = "muted",
  SUCCESS = "success",
  WARNING = "warning",
  DESTRUCTIVE = "destructive",
  LINK = "link",
}
export interface IconProps {
  icon?: IconDefinition;
  size?: IconSize | string; 
  color?: IconColor;
  isSpin?: boolean;
  spin?: boolean; 
  isPulse?: boolean;
  pulse?: boolean; 
  isBeat?: boolean;
  beat?: boolean; 
  isShake?: boolean;
  shake?: boolean; 
  isFixedWidth?: boolean;
  fixedWidth?: boolean; 
  isBorder?: boolean;
  border?: boolean; 
  isInverse?: boolean;
  inverse?: boolean; 
  rotation?: 90 | 180 | 270;
  flip?: "horizontal" | "vertical" | "both";
  pull?: "left" | "right";
  transform?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (event: React.MouseEvent<SVGSVGElement>) => void;
}
const Icon: React.FC<IconProps> = React.memo(
  ({
    icon = faCheck,
    size = IconSize.MD,
    color = IconColor.INHERIT,
    isSpin = false,
    spin = false,
    isPulse = false,
    pulse = false,
    isBeat = false,
    beat = false,
    isShake = false,
    shake = false,
    isFixedWidth = true,
    fixedWidth = false,
    isBorder = false,
    border = false,
    isInverse = false,
    inverse = false,
    rotation,
    flip,
    pull,
    transform,
    className = "",
    style,
    onClick,
  }) => {
    const getSize = (): SizeProp => {
      const sizeValue = typeof size === "string" ? size : size;
      const sizeMap: Record<string, SizeProp> = {
        xs: "xs",
        sm: "sm",
        md: "lg",
        lg: "xl",
        xl: "2xl",
        "2xl": "3x",
        "3xl": "4x",
        "4xl": "5x",
      };
      return sizeMap[sizeValue] || "lg";
    };
    const colorStyles = {
      [IconColor.INHERIT]: "",
      [IconColor.PRIMARY]: "text-primary",
      [IconColor.SECONDARY]: "text-secondary",
      [IconColor.ACCENT]: "text-accent",
      [IconColor.MUTED]: "text-text-muted",
      [IconColor.SUCCESS]: "text-success",
      [IconColor.WARNING]: "text-warning",
      [IconColor.DESTRUCTIVE]: "text-destructive",
      [IconColor.LINK]: "text-link hover:text-link-hover",
    };
    const shouldSpin = isSpin || spin;
    const shouldPulse = isPulse || pulse;
    const shouldBeat = isBeat || beat;
    const shouldShake = isShake || shake;
    const shouldFixedWidth = isFixedWidth || fixedWidth;
    const shouldBorder = isBorder || border;
    const shouldInverse = isInverse || inverse;
    const iconClassName = clsx(
      "transition-colors duration-200",
      colorStyles[color],
      className
    );
    return (
      <FontAwesomeIcon
        icon={icon}
        size={getSize()}
        spin={shouldSpin}
        pulse={shouldPulse}
        beat={shouldBeat}
        shake={shouldShake}
        fixedWidth={shouldFixedWidth}
        border={shouldBorder}
        inverse={shouldInverse}
        rotation={rotation}
        flip={flip}
        pull={pull}
        transform={transform}
        className={iconClassName}
        style={style}
        onClick={onClick}
      />
    );
  }
);
Icon.displayName = "Icon";
export default Icon;
