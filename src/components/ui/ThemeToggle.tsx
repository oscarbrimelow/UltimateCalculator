import type { JSX } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useThemePreference, type ThemePreference } from "../../providers/ThemeProvider";

const icons: Record<ThemePreference, JSX.Element> = {
  light: <Sun className="h-4 w-4" />,
  dark: <Moon className="h-4 w-4" />,
  system: <Monitor className="h-4 w-4" />
};

const labels: Record<ThemePreference, string> = {
  light: "Light mode",
  dark: "Dark mode",
  system: "System default"
};

const nextTheme: Record<ThemePreference, ThemePreference> = {
  light: "dark",
  dark: "system",
  system: "light"
};

export const ThemeToggle = () => {
  const { theme, setTheme } = useThemePreference();

  const handleClick = () => {
    setTheme(nextTheme[theme]);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition hover:border-primary-400 hover:text-primary-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-primary-500 dark:hover:text-primary-300"
      aria-label={`Toggle theme (current: ${labels[theme]})`}
    >
      {icons[theme]}
      <span className="hidden sm:inline">{labels[theme]}</span>
    </button>
  );
};

