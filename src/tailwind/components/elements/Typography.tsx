import clsx from "clsx";
import React from "react";
export enum TypographyVariant {
  H1 = "h1",
  H2 = "h2",
  H3 = "h3",
  H4 = "h4",
  H5 = "h5",
  H6 = "h6",
  P = "p",
  SPAN = "span",
  LABEL = "label",
  SMALL = "small",
}
export enum TypographySize {
  XS = "xs",
  SM = "sm",
  BASE = "base",
  LG = "lg",
  XL = "xl",
  XL2 = "2xl",
  XL3 = "3xl",
  XL4 = "4xl",
}
export enum TypographyWeight {
  LIGHT = "light",
  NORMAL = "normal",
  MEDIUM = "medium",
  SEMIBOLD = "semibold",
  BOLD = "bold",
}
export enum TypographyColor {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  MUTED = "muted",
  DISABLED = "disabled",
  SUCCESS = "success",
  WARNING = "warning",
  DESTRUCTIVE = "destructive",
}
interface BaseTypographyProps {
  size?: TypographySize;
  weight?: TypographyWeight;
  color?: TypographyColor;
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}
export const Typography: React.FC<
  BaseTypographyProps & { as: TypographyVariant }
> = React.memo(
  ({
    as: Component,
    size = TypographySize.BASE,
    weight = TypographyWeight.NORMAL,
    color = TypographyColor.PRIMARY,
    className,
    style,
    children,
    ...props
  }) => {
    const sizeStyles = {
      [TypographySize.XS]: "text-xs",
      [TypographySize.SM]: "text-sm",
      [TypographySize.BASE]: "text-base",
      [TypographySize.LG]: "text-lg",
      [TypographySize.XL]: "text-xl",
      [TypographySize.XL2]: "text-2xl",
      [TypographySize.XL3]: "text-3xl",
      [TypographySize.XL4]: "text-4xl",
    };
    const weightStyles = {
      [TypographyWeight.LIGHT]: "font-light",
      [TypographyWeight.NORMAL]: "font-normal",
      [TypographyWeight.MEDIUM]: "font-medium",
      [TypographyWeight.SEMIBOLD]: "font-semibold",
      [TypographyWeight.BOLD]: "font-bold",
    };
    const colorStyles = {
      [TypographyColor.PRIMARY]: "text-text-primary",
      [TypographyColor.SECONDARY]: "text-text-secondary",
      [TypographyColor.MUTED]: "text-text-muted",
      [TypographyColor.DISABLED]: "text-text-disabled",
      [TypographyColor.SUCCESS]: "text-success",
      [TypographyColor.WARNING]: "text-warning",
      [TypographyColor.DESTRUCTIVE]: "text-destructive",
    };
    const semanticStyles = {
      [TypographyVariant.H1]: "text-4xl font-bold leading-tight",
      [TypographyVariant.H2]: "text-3xl font-bold leading-tight",
      [TypographyVariant.H3]: "text-2xl font-semibold leading-snug",
      [TypographyVariant.H4]: "text-xl font-semibold leading-snug",
      [TypographyVariant.H5]: "text-lg font-medium leading-normal",
      [TypographyVariant.H6]: "text-base font-medium leading-normal",
      [TypographyVariant.P]: "text-base leading-relaxed",
      [TypographyVariant.SPAN]: "",
      [TypographyVariant.LABEL]: "text-sm font-medium",
      [TypographyVariant.SMALL]: "text-sm",
    };
    const typographyClassName = clsx(
      semanticStyles[Component],
      sizeStyles[size],
      weightStyles[weight],
      colorStyles[color],
      className
    );
    return React.createElement(
      Component,
      {
        className: typographyClassName,
        style,
        ...props,
      },
      children
    );
  }
);
Typography.displayName = "Typography";
export const H1: React.FC<BaseTypographyProps> = React.memo((props) => (
  <Typography as={TypographyVariant.H1} {...props} />
));
H1.displayName = "H1";
export const H2: React.FC<BaseTypographyProps> = React.memo((props) => (
  <Typography as={TypographyVariant.H2} {...props} />
));
H2.displayName = "H2";
export const H3: React.FC<BaseTypographyProps> = React.memo((props) => (
  <Typography as={TypographyVariant.H3} {...props} />
));
H3.displayName = "H3";
export const H4: React.FC<BaseTypographyProps> = React.memo((props) => (
  <Typography as={TypographyVariant.H4} {...props} />
));
H4.displayName = "H4";
export const H5: React.FC<BaseTypographyProps> = React.memo((props) => (
  <Typography as={TypographyVariant.H5} {...props} />
));
H5.displayName = "H5";
export const H6: React.FC<BaseTypographyProps> = React.memo((props) => (
  <Typography as={TypographyVariant.H6} {...props} />
));
H6.displayName = "H6";
export const P: React.FC<BaseTypographyProps> = React.memo((props) => (
  <Typography as={TypographyVariant.P} {...props} />
));
P.displayName = "P";
export const Label: React.FC<BaseTypographyProps> = React.memo((props) => (
  <Typography as={TypographyVariant.LABEL} {...props} />
));
Label.displayName = "Label";
export const Small: React.FC<BaseTypographyProps> = React.memo((props) => (
  <Typography as={TypographyVariant.SMALL} {...props} />
));
Small.displayName = "Small";
export interface LinkProps extends BaseTypographyProps {
  href: string;
  target?: string;
  rel?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}
export const Link: React.FC<LinkProps> = React.memo(
  ({ href, target, rel, onClick, children, className, ...props }) => {
    const linkClassName = clsx(
      "text-link hover:text-link-hover underline transition-colors cursor-pointer",
      className
    );
    return (
      <a
        href={href}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : rel}
        onClick={onClick}
        className={linkClassName}
        {...props}
      >
        {children}
      </a>
    );
  }
);
Link.displayName = "Link";
