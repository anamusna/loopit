export type ImageProps = {
  src: string;
  alt: string;
  fluid?: boolean;
  className?: string;
  theme?: "light" | "dark";
  align?: "left" | "right" | "center" | "none";
  picture?: boolean;
  size?: "thumbnail" | "sm" | "md" | "lg" | "xl";
};
