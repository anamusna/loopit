export const deepGreenColors = {
  50: "#f0f9f4",
  100: "#dcf2e3",
  200: "#bce5ca",
  300: "#8dd1a5",
  400: "#5bb378",
  500: "#369654",
  600: "#2a7a44",
  700: "#226238",
  800: "#1f4f30",
  900: "#1a4129",
  950: "#0d2415",
} as const;
export const tealColors = {
  50: "#f0fdfa",
  100: "#ccfbf1",
  200: "#99f6e4",
  300: "#5eead4",
  400: "#2dd4bf",
  500: "#14b8a6",
  600: "#0d9488",
  700: "#0f766e",
  800: "#115e59",
  900: "#134e4a",
  950: "#042f2e",
} as const;
export const warmGrayColors = {
  50: "#fafaf9",
  100: "#f5f5f4",
  200: "#e7e5e4",
  300: "#d6d3d1",
  400: "#a8a29e",
  500: "#78716c",
  600: "#57534e",
  700: "#44403c",
  800: "#292524",
  900: "#1c1917",
  950: "#0c0a09",
} as const;
export const slateColors = {
  50: "#f8fafc",
  100: "#f1f5f9",
  200: "#e2e8f0",
  300: "#cbd5e1",
  400: "#94a3b8",
  500: "#64748b",
  600: "#475569",
  700: "#334155",
  800: "#1e293b",
  900: "#0f172a",
  950: "#020617",
} as const;
export const successColors = {
  50: "#ecfdf5",
  100: "#d1fae5",
  200: "#a7f3d0",
  300: "#6ee7b7",
  400: "#34d399",
  500: "#10b981",
  600: "#059669",
  700: "#047857",
  800: "#065f46",
  900: "#064e3b",
  950: "#022c22",
} as const;
export const warningColors = {
  50: "#fffbeb",
  100: "#fef3c7",
  200: "#fde68a",
  300: "#fcd34d",
  400: "#fbbf24",
  500: "#f59e0b",
  600: "#d97706",
  700: "#b45309",
  800: "#92400e",
  900: "#78350f",
  950: "#451a03",
} as const;
export const errorColors = {
  50: "#fef2f2",
  100: "#fee2e2",
  200: "#fecaca",
  300: "#fca5a5",
  400: "#f87171",
  500: "#ef4444",
  600: "#dc2626",
  700: "#b91c1c",
  800: "#991b1b",
  900: "#7f1d1d",
  950: "#450a0a",
} as const;
export const infoColors = {
  50: "#eff6ff",
  100: "#dbeafe",
  200: "#bfdbfe",
  300: "#93c5fd",
  400: "#60a5fa",
  500: "#3b82f6",
  600: "#2563eb",
  700: "#1d4ed8",
  800: "#1e40af",
  900: "#1e3a8a",
  950: "#172554",
} as const;
export const semanticColors = {
  background: "var(--background)",
  foreground: "var(--foreground)",
  card: "var(--card)",
  "card-foreground": "var(--card-foreground)",
  popover: "var(--popover)",
  "popover-foreground": "var(--popover-foreground)",
  muted: "var(--muted)",
  "muted-foreground": "var(--muted-foreground)",
  footer: "var(--footer)",
  primary: "var(--primary)",
  "primary-foreground": "var(--primary-foreground)",
  "primary-hover": "var(--primary-hover)",
  "primary-active": "var(--primary-active)",
  "primary-subtle": "var(--primary-subtle)",
  secondary: "var(--secondary)",
  "secondary-foreground": "var(--secondary-foreground)",
  "secondary-hover": "var(--secondary-hover)",
  "secondary-active": "var(--secondary-active)",
  accent: "var(--accent)",
  "accent-foreground": "var(--accent-foreground)",
  "accent-hover": "var(--accent-hover)",
  "accent-active": "var(--accent-active)",
  "accent-subtle": "var(--accent-subtle)",
  border: "var(--border)",
  "border-hover": "var(--border-hover)",
  input: "var(--input)",
  "input-hover": "var(--input-hover)",
  "input-focus": "var(--input-focus)",
  ring: "var(--ring)",
  destructive: "var(--destructive)",
  "destructive-foreground": "var(--destructive-foreground)",
  "destructive-hover": "var(--destructive-hover)",
  "destructive-active": "var(--destructive-active)",
  "destructive-subtle": "var(--destructive-subtle)",
  success: "var(--success)",
  "success-foreground": "var(--success-foreground)",
  "success-subtle": "var(--success-subtle)",
  warning: "var(--warning)",
  "warning-foreground": "var(--warning-foreground)",
  "warning-subtle": "var(--warning-subtle)",
  info: "var(--info)",
  "info-foreground": "var(--info-foreground)",
  "info-subtle": "var(--info-subtle)",
  "text-primary": "var(--text-primary)",
  "text-secondary": "var(--text-secondary)",
  "text-muted": "var(--text-muted)",
  "text-disabled": "var(--text-disabled)",
  link: "var(--link)",
  "link-hover": "var(--link-hover)",
  "link-visited": "var(--link-visited)",
} as const;
export const tailwindColors = {
  ...semanticColors,
  "deep-green": deepGreenColors,
  teal: tealColors,
  "warm-gray": warmGrayColors,
  slate: slateColors,
  "primary-static": deepGreenColors,
  "accent-static": tealColors,
  "neutral-static": warmGrayColors,
  "success-static": successColors,
  "warning-static": warningColors,
  "error-static": errorColors,
  "info-static": infoColors,
} as const;
export const COLORS = {
  PRIMARY: deepGreenColors[600],
  PRIMARY_LIGHT: deepGreenColors[400],
  ACCENT: tealColors[400],
  BACKGROUND_LIGHT: warmGrayColors[50],
  BACKGROUND_DARK: warmGrayColors[900],
  CARD_LIGHT: warmGrayColors[100],
  CARD_DARK: slateColors[800],
  SUCCESS: successColors[500],
  WARNING: warningColors[500],
  ERROR: errorColors[600],
  INFO: infoColors[500],
  TEXT_PRIMARY_LIGHT: slateColors[900],
  TEXT_PRIMARY_DARK: warmGrayColors[100],
  TEXT_SECONDARY_LIGHT: slateColors[600],
  TEXT_SECONDARY_DARK: warmGrayColors[300],
  TEXT_MUTED_LIGHT: slateColors[500],
  TEXT_MUTED_DARK: warmGrayColors[400],
  WHITE: "#ffffff",
  BLACK: "#000000",
  TRANSPARENT: "transparent",
} as const;
export const withOpacity = (color: string, opacity: number): string => {
  if (color.startsWith("#")) {
    const hex = color.slice(1);
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
};
export type DeepGreenColor = keyof typeof deepGreenColors;
export type TealColor = keyof typeof tealColors;
export type WarmGrayColor = keyof typeof warmGrayColors;
export type SlateColor = keyof typeof slateColors;
export type SuccessColor = keyof typeof successColors;
export type WarningColor = keyof typeof warningColors;
export type ErrorColor = keyof typeof errorColors;
export type InfoColor = keyof typeof infoColors;
export type ColorShade =
  | 50
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900
  | 950;
export const colors = {
  primary: deepGreenColors,
  accent: tealColors,
  neutral: warmGrayColors,
  slate: slateColors,
  success: successColors,
  warning: warningColors,
  error: errorColors,
  info: infoColors,
} as const;
export default colors;
