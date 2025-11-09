import { create } from "zustand";
import { persist } from "zustand/middleware";

type PreferencesState = {
  defaultCurrency: string;
  favoriteCurrencies: string[];
  defaultTimeZone: string;
  enableAnimations: boolean;
  setDefaultCurrency: (code: string) => void;
  toggleFavoriteCurrency: (code: string) => void;
  setDefaultTimeZone: (timezone: string) => void;
  setAnimations: (value: boolean) => void;
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({
      defaultCurrency: "USD",
      favoriteCurrencies: ["USD", "EUR", "GBP"],
      defaultTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC",
      enableAnimations: true,
      setDefaultCurrency: (code) => set({ defaultCurrency: code.toUpperCase() }),
      toggleFavoriteCurrency: (code) => {
        const favorites = new Set(get().favoriteCurrencies);
        if (favorites.has(code)) {
          favorites.delete(code);
        } else {
          favorites.add(code);
        }
        set({ favoriteCurrencies: Array.from(favorites) });
      },
      setDefaultTimeZone: (timezone) => set({ defaultTimeZone: timezone }),
      setAnimations: (value) => set({ enableAnimations: value })
    }),
    {
      name: "ultimatecalc-preferences"
    }
  )
);

