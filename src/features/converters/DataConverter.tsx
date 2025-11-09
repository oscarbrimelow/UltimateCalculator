import { useMemo, useState } from "react";
import { Save } from "lucide-react";
import { useHistoryLogger } from "../../hooks/useHistoryLogger";

const dataUnits = [
  { id: "B", label: "Bytes", factor: 1 },
  { id: "KB", label: "Kilobytes", factor: 1024 },
  { id: "MB", label: "Megabytes", factor: 1024 ** 2 },
  { id: "GB", label: "Gigabytes", factor: 1024 ** 3 },
  { id: "TB", label: "Terabytes", factor: 1024 ** 4 },
  { id: "PB", label: "Petabytes", factor: 1024 ** 5 }
];

const formatValue = (value: number) => {
  if (value === 0) return "0";
  if (Math.abs(value) < 0.01) return value.toExponential(4);
  if (Math.abs(value) > 1_000_000) return value.toExponential(4);
  return value.toLocaleString(undefined, { maximumFractionDigits: 6 });
};

const DataConverter = () => {
  const [amount, setAmount] = useState(1024);
  const [fromUnit, setFromUnit] = useState("MB");
  const [toUnit, setToUnit] = useState("GB");
  const historyLogger = useHistoryLogger();

  const result = useMemo(() => {
    const from = dataUnits.find((unit) => unit.id === fromUnit) ?? dataUnits[0];
    const to = dataUnits.find((unit) => unit.id === toUnit) ?? dataUnits[1] ?? dataUnits[0];
    const baseValue = amount * from.factor;
    return baseValue / to.factor;
  }, [amount, fromUnit, toUnit]);

  const handleSave = () => {
    historyLogger(
      "data-converter",
      "Data Converter",
      `${amount} ${fromUnit} = ${formatValue(result)} ${toUnit}`,
      { amount, fromUnit, toUnit, result }
    );
  };

  return (
    <section className="space-y-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Data Size Converter</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Convert bytes through petabytes effortlessly.
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

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          From
          <div className="mt-2 flex items-center gap-3">
            <input
              type="number"
              value={amount}
              min={0}
              onChange={(event) => setAmount(Number(event.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
            />
            <select
              value={fromUnit}
              onChange={(event) => setFromUnit(event.target.value)}
              className="w-32 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
            >
              {dataUnits.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>
        </label>

        <label className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          To
          <div className="mt-2 flex items-center gap-3">
            <input
              type="text"
              readOnly
              value={`${formatValue(result)} ${toUnit}`}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-primary-600 dark:border-slate-700 dark:bg-slate-900 dark:text-primary-200"
            />
            <select
              value={toUnit}
              onChange={(event) => setToUnit(event.target.value)}
              className="w-32 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
            >
              {dataUnits.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>
        </label>
      </div>
    </section>
  );
};

export default DataConverter;

