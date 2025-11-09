import { useMemo, useState } from "react";
import { Save } from "lucide-react";
import { useHistoryLogger } from "../../hooks/useHistoryLogger";

const TipCalculator = () => {
  const [bill, setBill] = useState(86.5);
  const [tipPercentage, setTipPercentage] = useState(18);
  const [split, setSplit] = useState(2);
  const historyLogger = useHistoryLogger();

  const result = useMemo(() => {
    const tipAmount = (bill * tipPercentage) / 100;
    const total = bill + tipAmount;
    const perPerson = split > 0 ? total / split : total;
    return { tipAmount, total, perPerson };
  }, [bill, tipPercentage, split]);

  const handleSave = () => {
    historyLogger(
      "tip-calculator",
      "Tip Calculator",
      `Tip $${result.tipAmount.toFixed(2)}, total $${result.total.toFixed(2)} (${split} people)`,
      { bill, tipPercentage, split, result }
    );
  };

  return (
    <section className="space-y-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Tip & Split Calculator</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Calculate tips, totals, and per-person shares instantly.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary-700"
        >
          <Save className="h-4 w-4" />
          Save Summary
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Bill amount
          <input
            type="number"
            value={bill}
            min={0}
            onChange={(event) => setBill(Number(event.target.value))}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
          />
        </label>
        <label className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Tip %
          <input
            type="number"
            value={tipPercentage}
            min={0}
            onChange={(event) => setTipPercentage(Number(event.target.value))}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {[10, 15, 18, 20, 22].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setTipPercentage(value)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  tipPercentage === value
                    ? "bg-primary-600 text-white shadow"
                    : "bg-slate-100 text-slate-600 hover:bg-primary-100 hover:text-primary-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-primary-900/40 dark:hover:text-primary-200"
                }`}
              >
                {value}%
              </button>
            ))}
          </div>
        </label>
        <label className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Split between
          <input
            type="number"
            value={split}
            min={1}
            onChange={(event) => setSplit(Number(event.target.value))}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Tip amount", value: `$${result.tipAmount.toFixed(2)}` },
          { label: "Total bill", value: `$${result.total.toFixed(2)}` },
          { label: "Per person", value: `$${result.perPerson.toFixed(2)}` }
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 shadow-inner dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">{item.label}</p>
            <p className="mt-2 text-lg font-semibold text-primary-600 dark:text-primary-300">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TipCalculator;

