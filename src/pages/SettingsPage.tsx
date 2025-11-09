import { useMemo } from "react";
import { COMMON_CURRENCIES } from "../data/currencies";
import { POPULAR_TIMEZONES } from "../data/timezones";
import { useThemePreference } from "../providers/ThemeProvider";
import { usePreferencesStore } from "../store/preferencesStore";

const SettingsPage = () => {
  const { theme, setTheme } = useThemePreference();
  const { defaultCurrency, favoriteCurrencies, defaultTimeZone, enableAnimations, setDefaultCurrency, toggleFavoriteCurrency, setDefaultTimeZone, setAnimations } =
    usePreferencesStore();

  const sortedCurrencies = useMemo(
    () => [...COMMON_CURRENCIES].sort((a, b) => a.code.localeCompare(b.code)),
    []
  );

  return (
    <div className="space-y-12">
      <section className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Settings</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Tailor UltimateCalc to match your preferences. Changes are saved automatically.
        </p>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Appearance</h2>
          <div className="space-y-4 text-sm">
            <div>
              <label className="font-medium text-slate-700 dark:text-slate-300">Theme</label>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Switch between light, dark, or follow your system preference.
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {(["light", "dark", "system"] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setTheme(value)}
                    className={`rounded-2xl border px-4 py-3 text-sm font-medium capitalize transition ${
                      theme === value
                        ? "border-primary-400 bg-primary-50 text-primary-700 dark:border-primary-600 dark:bg-primary-950/50 dark:text-primary-200"
                        : "border-slate-200 text-slate-600 hover:border-primary-300 hover:text-primary-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-primary-500 dark:hover:text-primary-200"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={enableAnimations}
                onChange={(event) => setAnimations(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-slate-600 dark:text-slate-300">Enable micro animations</span>
            </label>
          </div>
        </div>

        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Finance Defaults</h2>
          <div className="space-y-5 text-sm">
            <div>
              <label className="font-medium text-slate-700 dark:text-slate-300" htmlFor="defaultCurrency">
                Default currency
              </label>
              <select
                id="defaultCurrency"
                value={defaultCurrency}
                onChange={(event) => setDefaultCurrency(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
              >
                {sortedCurrencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} — {currency.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="font-medium text-slate-700 dark:text-slate-300">Favorite currencies</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                These appear at the top of currency pickers.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {sortedCurrencies.map((currency) => {
                  const active = favoriteCurrencies.includes(currency.code);
                  return (
                    <button
                      key={currency.code}
                      type="button"
                      onClick={() => toggleFavoriteCurrency(currency.code)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                        active
                          ? "bg-primary-600 text-white shadow"
                          : "bg-slate-100 text-slate-600 hover:bg-primary-100 hover:text-primary-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-primary-900/40 dark:hover:text-primary-200"
                      }`}
                    >
                      {currency.code}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Time & Locale</h2>
          <div className="space-y-4 text-sm">
            <div>
              <label className="font-medium text-slate-700 dark:text-slate-300" htmlFor="defaultTimeZone">
                Default time zone
              </label>
              <select
                id="defaultTimeZone"
                value={defaultTimeZone}
                onChange={(event) => setDefaultTimeZone(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
              >
                {POPULAR_TIMEZONES.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;

