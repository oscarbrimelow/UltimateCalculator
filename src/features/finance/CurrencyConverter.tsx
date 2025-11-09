import { useEffect, useMemo, useState } from "react";
import { ArrowRightLeft, Save } from "lucide-react";
import { useCurrencyRates } from "../../hooks/useCurrencyRates";
import { usePreferencesStore } from "../../store/preferencesStore";
import { useHistoryLogger } from "../../hooks/useHistoryLogger";

const CurrencyConverter = () => {
  const { defaultCurrency, favoriteCurrencies, setDefaultCurrency } = usePreferencesStore();
  const [base, setBase] = useState(defaultCurrency);
  const [target, setTarget] = useState("EUR");
  const [amount, setAmount] = useState(100);
  const historyLogger = useHistoryLogger();

  const { data, isLoading, isOffline, error } = useCurrencyRates(base);

  useEffect(() => {
    setBase(defaultCurrency);
  }, [defaultCurrency]);

  const availableCurrencies = useMemo(() => {
    const list = data?.rates ? Object.keys(data.rates) : [];
    const combined = new Set([base, ...list]);
    return Array.from(combined).sort();
  }, [data, base]);

  const conversionRate = data?.rates?.[target] ?? null;
  const convertedAmount = conversionRate ? amount * conversionRate : 0;

  const favoriteList = useMemo(() => {
    const set = new Set(favoriteCurrencies);
    return availableCurrencies.filter((code) => set.has(code));
  }, [favoriteCurrencies, availableCurrencies]);

  const handleSwap = () => {
    setBase(target);
    setTarget(base);
  };

  const handleSave = () => {
    historyLogger(
      "currency-converter",
      "Currency Converter",
      `${amount.toFixed(2)} ${base} = ${convertedAmount.toFixed(2)} ${target}`,
      { base, target, amount, rate: conversionRate }
    );
  };

  return (
    <section className="space-y-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Live Currency Converter</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Powered by ExchangeRate.host with offline fallback from your latest refresh.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary-700"
        >
          <Save className="h-4 w-4" />
          Save Conversion
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white/60 p-5 dark:border-slate-800 dark:bg-slate-900/60">
          <label className="block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Amount
            <input
              type="number"
              value={amount}
              min={0}
              onChange={(event) => setAmount(Number(event.target.value))}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
            />
          </label>
          <label className="mt-4 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            From
            <select
              value={base}
              onChange={(event) => {
                setBase(event.target.value);
                setDefaultCurrency(event.target.value);
              }}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
            >
              {favoriteList.length > 0 && (
                <optgroup label="Favorites">
                  {favoriteList.map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </optgroup>
              )}
              <optgroup label="All currencies">
                {availableCurrencies.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </optgroup>
            </select>
          </label>
        </div>

        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={handleSwap}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:border-primary-300 hover:text-primary-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-primary-500 dark:hover:text-primary-200"
            aria-label="Swap currencies"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/60 p-5 dark:border-slate-800 dark:bg-slate-900/60">
          <label className="block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Converted Amount
            <input
              type="text"
              readOnly
              value={
                conversionRate ? `${convertedAmount.toFixed(2)} ${target}` : "Unavailable"
              }
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-primary-600 dark:border-slate-700 dark:bg-slate-900 dark:text-primary-200"
            />
          </label>
          <label className="mt-4 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            To
            <select
              value={target}
              onChange={(event) => setTarget(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
            >
              {availableCurrencies.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        {isLoading && <p>Fetching live rates…</p>}
        {error && !isOffline && <p>Unable to load rates. Please try again later.</p>}
        {isOffline && (
          <p>
            You’re offline. Showing cached rates from {data?.date}. Reconnect for fresh updates.
          </p>
        )}
        {!isLoading && conversionRate && (
          <p>
            1 {base} ={" "}
            <span className="font-semibold text-primary-600 dark:text-primary-300">
              {conversionRate.toFixed(4)} {target}
            </span>{" "}
            · Last updated {data?.date}
          </p>
        )}
      </div>
    </section>
  );
};

export default CurrencyConverter;

