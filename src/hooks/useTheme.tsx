"use client";
import {
  getTheme,
  getThemeColor,
  ThemeColors,
  ThemeConfig,
  ThemeMode,
} from "@/constants/themes";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
interface ThemeError extends Error {
  name: "ThemeError";
}
interface ThemeContextValue {
  currentTheme: ThemeMode;
  themeConfig: ThemeConfig;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  getColor: (colorName: ThemeColors) => string;
  isDarkMode: boolean;
  isLightMode: boolean;
}
const ThemeContext = createContext<ThemeContextValue | null>(null);
interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeMode;
  storageKey?: string;
}
export const ThemeProvider = ({
  children,
  defaultTheme = ThemeMode.LIGHT,
  storageKey = "loopit-theme",
}: ThemeProviderProps) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(defaultTheme);
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(storageKey) as ThemeMode;
      if (storedTheme && Object.values(ThemeMode).includes(storedTheme)) {
        setCurrentTheme(storedTheme);
      }
    } catch (error) {
      console.warn("Failed to load theme from localStorage:", error);
    }
  }, [storageKey]);
  useEffect(() => {
    try {
      const { documentElement } = document;
      const themeConfig = getTheme(currentTheme);
      documentElement.classList.remove(ThemeMode.LIGHT, ThemeMode.DARK);
      documentElement.classList.add(currentTheme);
      Object.entries(themeConfig).forEach(([key, value]) => {
        const cssVariableName = `--${key
          .replace(/([A-Z])/g, "-$1")
          .toLowerCase()}`;
        documentElement.style.setProperty(cssVariableName, value);
      });
      localStorage.setItem(storageKey, currentTheme);
    } catch (error) {
      console.error("Failed to apply theme:", error);
    }
  }, [currentTheme, storageKey]);
  const themeConfig = useMemo(() => getTheme(currentTheme), [currentTheme]);
  const toggleTheme = useCallback(() => {
    setCurrentTheme((prevTheme) =>
      prevTheme === ThemeMode.LIGHT ? ThemeMode.DARK : ThemeMode.LIGHT
    );
  }, []);
  const setTheme = useCallback((theme: ThemeMode) => {
    if (Object.values(ThemeMode).includes(theme)) {
      setCurrentTheme(theme);
    } else {
      console.warn(`Invalid theme mode: ${theme}`);
    }
  }, []);
  const getColor = useCallback(
    (colorName: ThemeColors): string => {
      try {
        return getThemeColor(currentTheme, colorName);
      } catch (error) {
        console.error(`Failed to get color ${colorName}:`, error);
        return "#000000"; 
      }
    },
    [currentTheme]
  );
  const computedValues = useMemo(
    () => ({
      isDarkMode: currentTheme === ThemeMode.DARK,
      isLightMode: currentTheme === ThemeMode.LIGHT,
    }),
    [currentTheme]
  );
  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      currentTheme,
      themeConfig,
      toggleTheme,
      setTheme,
      getColor,
      ...computedValues,
    }),
    [currentTheme, themeConfig, toggleTheme, setTheme, getColor, computedValues]
  );
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    const error = new Error(
      "useTheme must be used within a ThemeProvider. " +
        "Ensure that your component is wrapped with <ThemeProvider>."
    ) as ThemeError;
    error.name = "ThemeError";
    throw error;
  }
  return context;
};
export const useThemeStyles = () => {
  const { themeConfig, getColor } = useTheme();
  return useMemo(
    () => ({
      backgroundColor: themeConfig.background,
      color: themeConfig.foreground,
      borderColor: themeConfig.border,
      getPrimaryButton: () => ({
        backgroundColor: themeConfig.primary,
        color: themeConfig.primaryForeground,
        borderColor: themeConfig.primary,
      }),
      getSecondaryButton: () => ({
        backgroundColor: themeConfig.secondary,
        color: themeConfig.secondaryForeground,
        borderColor: themeConfig.border,
      }),
      getCard: () => ({
        backgroundColor: themeConfig.card,
        color: themeConfig.cardForeground,
        borderColor: themeConfig.border,
      }),
    }),
    [themeConfig, getColor]
  );
};
export const useSystemTheme = () => {
  const [systemTheme, setSystemTheme] = useState<ThemeMode>(ThemeMode.LIGHT);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? ThemeMode.DARK : ThemeMode.LIGHT);
    };
    setSystemTheme(mediaQuery.matches ? ThemeMode.DARK : ThemeMode.LIGHT);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);
  return systemTheme;
};
