export enum ThemeMode {
  LIGHT = "light",
  DARK = "dark",
}
export enum ColorShade {
  SHADE_50 = 50,
  SHADE_100 = 100,
  SHADE_200 = 200,
  SHADE_300 = 300,
  SHADE_400 = 400,
  SHADE_500 = 500,
  SHADE_600 = 600,
  SHADE_700 = 700,
  SHADE_800 = 800,
  SHADE_900 = 900,
  SHADE_950 = 950,
}
const baseColors = {
  deepGreen: {
    [ColorShade.SHADE_50]: "#f0f9f4",
    [ColorShade.SHADE_100]: "#dcf2e3",
    [ColorShade.SHADE_200]: "#bce5ca",
    [ColorShade.SHADE_300]: "#8dd1a5",
    [ColorShade.SHADE_400]: "#5bb378",
    [ColorShade.SHADE_500]: "#369654",
    [ColorShade.SHADE_600]: "#2a7a44",
    [ColorShade.SHADE_700]: "#226238",
    [ColorShade.SHADE_800]: "#1f4f30",
    [ColorShade.SHADE_900]: "#1a4129",
    [ColorShade.SHADE_950]: "#0d2415",
  },
  teal: {
    [ColorShade.SHADE_50]: "#f0fdfa",
    [ColorShade.SHADE_100]: "#ccfbf1",
    [ColorShade.SHADE_200]: "#99f6e4",
    [ColorShade.SHADE_300]: "#5eead4",
    [ColorShade.SHADE_400]: "#2dd4bf",
    [ColorShade.SHADE_500]: "#14b8a6",
    [ColorShade.SHADE_600]: "#0d9488",
    [ColorShade.SHADE_700]: "#0f766e",
    [ColorShade.SHADE_800]: "#115e59",
    [ColorShade.SHADE_900]: "#134e4a",
    [ColorShade.SHADE_950]: "#042f2e",
  },
  warmGray: {
    [ColorShade.SHADE_50]: "#fafaf9",
    [ColorShade.SHADE_100]: "#f5f5f4",
    [ColorShade.SHADE_200]: "#e7e5e4",
    [ColorShade.SHADE_300]: "#d6d3d1",
    [ColorShade.SHADE_400]: "#a8a29e",
    [ColorShade.SHADE_500]: "#78716c",
    [ColorShade.SHADE_600]: "#57534e",
    [ColorShade.SHADE_700]: "#44403c",
    [ColorShade.SHADE_800]: "#292524",
    [ColorShade.SHADE_900]: "#1c1917",
    [ColorShade.SHADE_950]: "#0c0a09",
  },
  slate: {
    [ColorShade.SHADE_50]: "#f8fafc",
    [ColorShade.SHADE_100]: "#f1f5f9",
    [ColorShade.SHADE_200]: "#e2e8f0",
    [ColorShade.SHADE_300]: "#cbd5e1",
    [ColorShade.SHADE_400]: "#94a3b8",
    [ColorShade.SHADE_500]: "#64748b",
    [ColorShade.SHADE_600]: "#475569",
    [ColorShade.SHADE_700]: "#334155",
    [ColorShade.SHADE_800]: "#1e293b",
    [ColorShade.SHADE_900]: "#0f172a",
    [ColorShade.SHADE_950]: "#020617",
  },
  red: {
    [ColorShade.SHADE_50]: "#fef2f2",
    [ColorShade.SHADE_100]: "#fee2e2",
    [ColorShade.SHADE_200]: "#fecaca",
    [ColorShade.SHADE_300]: "#fca5a5",
    [ColorShade.SHADE_400]: "#f87171",
    [ColorShade.SHADE_500]: "#ef4444",
    [ColorShade.SHADE_600]: "#dc2626",
    [ColorShade.SHADE_700]: "#b91c1c",
    [ColorShade.SHADE_800]: "#991b1b",
    [ColorShade.SHADE_900]: "#7f1d1d",
    [ColorShade.SHADE_950]: "#450a0a",
  },
  amber: {
    [ColorShade.SHADE_50]: "#fffbeb",
    [ColorShade.SHADE_100]: "#fef3c7",
    [ColorShade.SHADE_200]: "#fde68a",
    [ColorShade.SHADE_300]: "#fcd34d",
    [ColorShade.SHADE_400]: "#fbbf24",
    [ColorShade.SHADE_500]: "#f59e0b",
    [ColorShade.SHADE_600]: "#d97706",
    [ColorShade.SHADE_700]: "#b45309",
    [ColorShade.SHADE_800]: "#92400e",
    [ColorShade.SHADE_900]: "#78350f",
    [ColorShade.SHADE_950]: "#451a03",
  },
  emerald: {
    [ColorShade.SHADE_50]: "#ecfdf5",
    [ColorShade.SHADE_100]: "#d1fae5",
    [ColorShade.SHADE_200]: "#a7f3d0",
    [ColorShade.SHADE_300]: "#6ee7b7",
    [ColorShade.SHADE_400]: "#34d399",
    [ColorShade.SHADE_500]: "#10b981",
    [ColorShade.SHADE_600]: "#059669",
    [ColorShade.SHADE_700]: "#047857",
    [ColorShade.SHADE_800]: "#065f46",
    [ColorShade.SHADE_900]: "#064e3b",
    [ColorShade.SHADE_950]: "#022c22",
  },
  blue: {
    [ColorShade.SHADE_50]: "#eff6ff",
    [ColorShade.SHADE_100]: "#dbeafe",
    [ColorShade.SHADE_200]: "#bfdbfe",
    [ColorShade.SHADE_300]: "#93c5fd",
    [ColorShade.SHADE_400]: "#60a5fa",
    [ColorShade.SHADE_500]: "#3b82f6",
    [ColorShade.SHADE_600]: "#2563eb",
    [ColorShade.SHADE_700]: "#1d4ed8",
    [ColorShade.SHADE_800]: "#1e40af",
    [ColorShade.SHADE_900]: "#1e3a8a",
    [ColorShade.SHADE_950]: "#172554",
  },
} as const;
const lightTheme = {
  background: baseColors.warmGray[ColorShade.SHADE_50], 
  foreground: baseColors.slate[ColorShade.SHADE_900], 
  card: baseColors.warmGray[ColorShade.SHADE_100], 
  cardForeground: baseColors.slate[ColorShade.SHADE_800],
  popover: baseColors.warmGray[ColorShade.SHADE_50],
  popoverForeground: baseColors.slate[ColorShade.SHADE_800],
  muted: baseColors.warmGray[ColorShade.SHADE_200], 
  mutedForeground: baseColors.slate[ColorShade.SHADE_500], 
  footer: baseColors.slate[ColorShade.SHADE_700], 
  primary: baseColors.deepGreen[ColorShade.SHADE_600], 
  primaryForeground: "#ffffff", 
  primaryHover: baseColors.deepGreen[ColorShade.SHADE_700],
  primaryActive: baseColors.deepGreen[ColorShade.SHADE_800],
  primarySubtle: baseColors.deepGreen[ColorShade.SHADE_100], 
  secondary: baseColors.warmGray[ColorShade.SHADE_200],
  secondaryForeground: baseColors.slate[ColorShade.SHADE_800],
  secondaryHover: baseColors.warmGray[ColorShade.SHADE_300],
  secondaryActive: baseColors.warmGray[ColorShade.SHADE_400],
  accent: baseColors.teal[ColorShade.SHADE_400], 
  accentForeground: "#ffffff",
  accentHover: baseColors.teal[ColorShade.SHADE_500],
  accentActive: baseColors.teal[ColorShade.SHADE_600],
  accentSubtle: baseColors.teal[ColorShade.SHADE_100], 
  border: baseColors.warmGray[ColorShade.SHADE_300],
  borderHover: baseColors.warmGray[ColorShade.SHADE_400],
  input: baseColors.warmGray[ColorShade.SHADE_100],
  inputHover: baseColors.warmGray[ColorShade.SHADE_200],
  inputFocus: baseColors.deepGreen[ColorShade.SHADE_500],
  ring: baseColors.deepGreen[ColorShade.SHADE_300], 
  destructive: baseColors.red[ColorShade.SHADE_600],
  destructiveForeground: "#ffffff",
  destructiveHover: baseColors.red[ColorShade.SHADE_700],
  destructiveActive: baseColors.red[ColorShade.SHADE_800],
  destructiveSubtle: baseColors.red[ColorShade.SHADE_100],
  success: baseColors.emerald[ColorShade.SHADE_500],
  successForeground: "#ffffff",
  successSubtle: baseColors.emerald[ColorShade.SHADE_100],
  warning: baseColors.amber[ColorShade.SHADE_500],
  warningForeground: baseColors.slate[ColorShade.SHADE_900], 
  warningSubtle: baseColors.amber[ColorShade.SHADE_100],
  info: baseColors.blue[ColorShade.SHADE_500],
  infoForeground: "#ffffff",
  infoSubtle: baseColors.blue[ColorShade.SHADE_100],
  textPrimary: baseColors.slate[ColorShade.SHADE_900], 
  textSecondary: baseColors.slate[ColorShade.SHADE_600], 
  textMuted: baseColors.slate[ColorShade.SHADE_500], 
  textDisabled: baseColors.slate[ColorShade.SHADE_400],
  link: baseColors.deepGreen[ColorShade.SHADE_600],
  linkHover: baseColors.deepGreen[ColorShade.SHADE_700],
  linkVisited: baseColors.deepGreen[ColorShade.SHADE_800],
  shadowLight: "rgba(0, 0, 0, 0.08)",
  shadowMedium: "rgba(0, 0, 0, 0.12)",
  shadowHeavy: "rgba(0, 0, 0, 0.20)",
} as const;
const darkTheme = {
  background: baseColors.warmGray[ColorShade.SHADE_900],
  foreground: baseColors.warmGray[ColorShade.SHADE_100],
  card: baseColors.slate[ColorShade.SHADE_800],
  cardForeground: baseColors.warmGray[ColorShade.SHADE_100],
  popover: baseColors.slate[ColorShade.SHADE_800],
  popoverForeground: baseColors.warmGray[ColorShade.SHADE_100],
  muted: baseColors.slate[ColorShade.SHADE_700],
  mutedForeground: baseColors.warmGray[ColorShade.SHADE_400],
  footer: baseColors.warmGray[ColorShade.SHADE_950],
  primary: baseColors.deepGreen[ColorShade.SHADE_400],
  primaryForeground: baseColors.slate[ColorShade.SHADE_900],
  primaryHover: baseColors.deepGreen[ColorShade.SHADE_300],
  primaryActive: baseColors.deepGreen[ColorShade.SHADE_200],
  primarySubtle: baseColors.deepGreen[ColorShade.SHADE_950],
  secondary: baseColors.slate[ColorShade.SHADE_700],
  secondaryForeground: baseColors.warmGray[ColorShade.SHADE_100],
  secondaryHover: baseColors.slate[ColorShade.SHADE_600],
  secondaryActive: baseColors.slate[ColorShade.SHADE_500],
  accent: baseColors.teal[ColorShade.SHADE_400],
  accentForeground: baseColors.slate[ColorShade.SHADE_900],
  accentHover: baseColors.teal[ColorShade.SHADE_300],
  accentActive: baseColors.teal[ColorShade.SHADE_200],
  accentSubtle: baseColors.teal[ColorShade.SHADE_950],
  border: baseColors.slate[ColorShade.SHADE_600],
  borderHover: baseColors.slate[ColorShade.SHADE_500],
  input: baseColors.slate[ColorShade.SHADE_700],
  inputHover: baseColors.slate[ColorShade.SHADE_600],
  inputFocus: baseColors.deepGreen[ColorShade.SHADE_400],
  ring: baseColors.deepGreen[ColorShade.SHADE_400],
  destructive: baseColors.red[ColorShade.SHADE_400],
  destructiveForeground: baseColors.warmGray[ColorShade.SHADE_100],
  destructiveHover: baseColors.red[ColorShade.SHADE_300],
  destructiveActive: baseColors.red[ColorShade.SHADE_200],
  destructiveSubtle: baseColors.red[ColorShade.SHADE_950],
  success: baseColors.emerald[ColorShade.SHADE_400],
  successForeground: baseColors.slate[ColorShade.SHADE_900],
  successSubtle: baseColors.emerald[ColorShade.SHADE_950],
  warning: baseColors.amber[ColorShade.SHADE_400],
  warningForeground: baseColors.slate[ColorShade.SHADE_900],
  warningSubtle: baseColors.amber[ColorShade.SHADE_950],
  info: baseColors.blue[ColorShade.SHADE_400],
  infoForeground: baseColors.slate[ColorShade.SHADE_900],
  infoSubtle: baseColors.blue[ColorShade.SHADE_950],
  textPrimary: baseColors.warmGray[ColorShade.SHADE_100],
  textSecondary: baseColors.warmGray[ColorShade.SHADE_300],
  textMuted: baseColors.warmGray[ColorShade.SHADE_400],
  textDisabled: baseColors.warmGray[ColorShade.SHADE_600],
  link: baseColors.deepGreen[ColorShade.SHADE_400],
  linkHover: baseColors.deepGreen[ColorShade.SHADE_300],
  linkVisited: baseColors.deepGreen[ColorShade.SHADE_500],
  shadowLight: "rgba(0, 0, 0, 0.25)",
  shadowMedium: "rgba(0, 0, 0, 0.40)",
  shadowHeavy: "rgba(0, 0, 0, 0.60)",
} as const;
export const themes = {
  [ThemeMode.LIGHT]: lightTheme,
  [ThemeMode.DARK]: darkTheme,
} as const;
export const colors = {
  primary: baseColors.deepGreen,
  accent: baseColors.teal,
  neutral: baseColors.warmGray,
  slate: baseColors.slate,
  success: baseColors.emerald,
  warning: baseColors.amber,
  error: baseColors.red,
  info: baseColors.blue,
} as const;
export interface ThemeConfig {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  muted: string;
  mutedForeground: string;
  footer: string;
  primary: string;
  primaryForeground: string;
  primaryHover: string;
  primaryActive: string;
  primarySubtle: string;
  secondary: string;
  secondaryForeground: string;
  secondaryHover: string;
  secondaryActive: string;
  accent: string;
  accentForeground: string;
  accentHover: string;
  accentActive: string;
  accentSubtle: string;
  border: string;
  borderHover: string;
  input: string;
  inputHover: string;
  inputFocus: string;
  ring: string;
  destructive: string;
  destructiveForeground: string;
  destructiveHover: string;
  destructiveActive: string;
  destructiveSubtle: string;
  success: string;
  successForeground: string;
  successSubtle: string;
  warning: string;
  warningForeground: string;
  warningSubtle: string;
  info: string;
  infoForeground: string;
  infoSubtle: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textDisabled: string;
  link: string;
  linkHover: string;
  linkVisited: string;
  shadowLight: string;
  shadowMedium: string;
  shadowHeavy: string;
}
export type ThemeColors = keyof ThemeConfig;
export type BaseColorPalette = typeof colors;
export type ColorPalette = keyof BaseColorPalette;
export const withOpacity = (color: string, opacity: number): string => {
  if (!color.startsWith("#")) return color;
  const hex = color.slice(1);
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
export const getTheme = (mode: ThemeMode): ThemeConfig => themes[mode];
export const getThemeColor = (
  mode: ThemeMode,
  colorName: ThemeColors
): string => themes[mode][colorName];
export const getColorShade = (
  palette: ColorPalette,
  shade: ColorShade
): string => colors[palette][shade];
export const generateCSSVariables = (
  theme: ThemeConfig
): Record<string, string> => {
  const cssVars: Record<string, string> = {};
  Object.entries(theme).forEach(([key, value]) => {
    const cssVarName = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
    cssVars[cssVarName] = value;
  });
  return cssVars;
};
