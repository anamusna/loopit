import { CSSProperties, ElementType, ReactNode } from "react";
export interface TypographyProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  variant?: string;
  weight?: string;
  theme?: string;
  htmlFor?: string;
  style?: CSSProperties;
  size?:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "xxl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | "8xl"
    | "9xl";
  leading?: keyof typeof leadingMap;
  id?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
  "aria-hidden"?: boolean;
  role?: string;
  tabIndex?: number;
}
export const leadingMap: any = {
  "100": "leading-tight",
  "150": "leading-snug",
  "200": "leading-relaxed",
  "300": "leading-loose",
  "400": "leading-normal",
};
export const fontSizeMap: { [key: string]: { [size: string]: string } } = {
  sm: {
    h1: "text-4xl leading-tight",
    h2: "text-3xl leading-tight",
    h3: "text-2xl leading-tight",
    h4: "text-xl leading-tight",
    h5: "text-lg leading-tight",
    h6: "text-md leading-tight",
    p: "text-sm leading-tight",
    body: "text-sm leading-tight",
    label: "text-xs leading-tight",
    small: "text-xs leading-tight",
  },
  md: {
    h1: "text-5xl leading-snug",
    h2: "text-4xl leading-snug",
    h3: "text-3xl leading-snug",
    h4: "text-2xl leading-snug",
    h5: "text-xl leading-snug",
    h6: "text-lg leading-snug",
    p: "text-md leading-snug",
    body: "text-md leading-snug",
    label: "text-sm leading-snug",
    small: "text-sm leading-snug",
  },
  lg: {
    h1: "text-6xl leading-normal",
    h2: "text-5xl leading-normal",
    h3: "text-4xl leading-normal",
    h4: "text-3xl leading-normal",
    h5: "text-2xl leading-normal",
    h6: "text-xl leading-normal",
    p: "text-lg leading-normal",
    body: "text-lg leading-normal",
    label: "text-md leading-normal",
    small: "text-md leading-normal",
  },
  xl: {
    h1: "text-7xl leading-relaxed",
    h2: "text-6xl leading-relaxed",
    h3: "text-5xl leading-relaxed",
    h4: "text-4xl leading-relaxed",
    h5: "text-3xl leading-relaxed",
    h6: "text-2xl leading-relaxed",
    p: "text-xl leading-relaxed",
    body: "text-xl leading-relaxed",
    label: "text-lg leading-relaxed",
    small: "text-lg leading-relaxed",
  },
};
