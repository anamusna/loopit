import {
  FlipProp,
  IconProp,
  PullProp,
  SizeProp,
  Transform,
} from "@fortawesome/fontawesome-svg-core";
import { CSSProperties } from "react";
export const sizes = [
  "2xs",
  "xs",
  "sm",
  "lg",
  "xl",
  "2xl",
  "1x",
  "2x",
  "3x",
  "4x",
  "5x",
  "6x",
  "7x",
  "8x",
  "9x",
  "10x",
];
export interface IconProps {
  icon: IconProp;
  size?: SizeProp;
  color?: string;
  spin?: boolean;
  pulse?: boolean;
  fixedWidth?: boolean;
  style?: CSSProperties;
  onClick?: () => void;
  className?: string;
  rotation?: 90 | 180 | 270 | number;
  flip?: FlipProp;
  theme?: "light" | "dark";
  border?: boolean;
  pull?: PullProp;
  transform?: string | Transform;
  inverse?: boolean;
  beat?: boolean;
  shake?: boolean;
}
