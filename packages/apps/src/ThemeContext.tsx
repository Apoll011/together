"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { ConfigProvider, theme as antTheme } from "antd";
import { lightTheme, darkTheme, brandColors } from "./themeConfig";

export type ThemeMode = "light" | "dark";

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  colors: typeof brandColors.light;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme-mode") as ThemeMode | null;
    if (stored && (stored === "light" || stored === "dark")) {
      setMode(stored);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setMode("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("theme-mode", newMode);
  };

  const setTheme = (newMode: ThemeMode) => {
    setMode(newMode);
    localStorage.setItem("theme-mode", newMode);
  };

  const currentTheme = mounted && mode === "dark" ? darkTheme : lightTheme;
  const colors = mounted && mode === "dark" ? brandColors.dark : brandColors.light;
  
  const value = useMemo(
    () => ({
      mode,
      toggleTheme,
      setTheme,
      colors,
    }),
    [mode, colors]
  );

  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider theme={currentTheme}>
        <div style={{ visibility: mounted ? 'visible' : 'hidden' }}>
          {children}
        </div>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

// Export antd's default algorithm for dark mode
export const { defaultAlgorithm, defaultSeed } = antTheme;