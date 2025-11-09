import { useEffect } from "react";
import { useThemeStore, syncDocumentTheme, type ThemePreference } from "../store/themeStore";

type ThemeProviderProps = {
  children: React.ReactNode;
};

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { theme, effectiveTheme, setTheme } = useThemeStore((state) => ({
    theme: state.theme,
    effectiveTheme: state.effectiveTheme,
    setTheme: state.setTheme
  }));

  useEffect(() => {
    const resolved = effectiveTheme;
    syncDocumentTheme(resolved);
    document.documentElement.setAttribute("data-theme", resolved);
  }, [effectiveTheme]);

  useEffect(() => {
    if (theme === "system") {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      const listener = () => setTheme("system");
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }
  }, [theme, setTheme]);

  return children;
};

export const useThemePreference = () =>
  useThemeStore((state) => ({
    theme: state.theme,
    effectiveTheme: state.effectiveTheme,
    setTheme: state.setTheme,
    toggleTheme: state.toggleTheme
  }));

export { ThemeProvider };

