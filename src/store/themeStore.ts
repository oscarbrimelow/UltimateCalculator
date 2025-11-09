import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemePreference = "light" | "dark" | "system";

type ThemeState = {
  theme: ThemePreference;
  effectiveTheme: "light" | "dark";
  setTheme: (theme: ThemePreference) => void;
  toggleTheme: () => void;
};

const getSystemTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const resolveTheme = (value: ThemePreference): "light" | "dark" => {
  if (value === "system") {
    return getSystemTheme();
  }
  return value;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "system",
      effectiveTheme: "light",
      setTheme: (theme) => {
        const effectiveTheme = resolveTheme(theme);
        set({ theme, effectiveTheme });
      },
      toggleTheme: () => {
        const { theme } = get();
        const next = theme === "dark" ? "light" : theme === "light" ? "system" : "dark";
        const effectiveTheme = resolveTheme(next);
        set({ theme: next, effectiveTheme });
      }
    }),
    {
      name: "ultimatecalc-theme",
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const effectiveTheme = resolveTheme(state.theme);
        state.effectiveTheme = effectiveTheme;
      }
    }
  )
);

export const syncDocumentTheme = (theme: "light" | "dark") => {
  if (typeof document === "undefined") return;
  document.documentElement.classList.remove(theme === "light" ? "dark" : "light");
  document.documentElement.classList.add(theme);
};

