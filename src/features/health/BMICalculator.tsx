import { useMemo, useState } from "react";
import { Save } from "lucide-react";
import { useHistoryLogger } from "../../hooks/useHistoryLogger";

type UnitSystem = "metric" | "imperial";

const getBmiCategory = (bmi: number) => {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 24.9) return "Normal";
  if (bmi < 29.9) return "Overweight";
  return "Obese";
};

const BMICalculator = () => {
  const [unit, setUnit] = useState<UnitSystem>("metric");
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(65);
  const historyLogger = useHistoryLogger();

  const bmi = useMemo(() => {
    if (unit === "metric") {
      const heightMeters = height / 100;
      return weight / (heightMeters * heightMeters);
    }
    const heightInches = height;
    return (weight / (heightInches * heightInches)) * 703;
  }, [height, weight, unit]);

  const category = getBmiCategory(bmi);

  const handleSave = () => {
    historyLogger(
      "bmi-calculator",
      "BMI Calculator",
      `BMI ${bmi.toFixed(1)} (${category})`,
      { unit, height, weight, bmi }
    );
  };

  return (
    <section className="space-y-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">BMI Calculator</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Evaluate body mass index with metric or imperial units and instant categorization.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary-700"
        >
          <Save className="h-4 w-4" />
          Save Result
        </button>
      </header>

      <div className="inline-flex rounded-full bg-slate-200 p-1 dark:bg-slate-800">
        {(["metric", "imperial"] as const).map((system) => (
          <button
            key={system}
            type="button"
            onClick={() => setUnit(system)}
            className={`rounded-full px-4 py-2 text-xs font-semibold capitalize transition ${
              unit === system
                ? "bg-white text-slate-900 shadow dark:bg-slate-700 dark:text-slate-100"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {system}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Height ({unit === "metric" ? "cm" : "inches"})
          <input
            type="number"
            value={height}
            min={unit === "metric" ? 50 : 20}
            onChange={(event) => setHeight(Number(event.target.value))}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
          />
        </label>
        <label className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Weight ({unit === "metric" ? "kg" : "lbs"})
          <input
            type="number"
            value={weight}
            min={unit === "metric" ? 20 : 40}
            onChange={(event) => setWeight(Number(event.target.value))}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
          />
        </label>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600 shadow-inner dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">BMI</p>
            <p className="mt-2 text-3xl font-semibold text-primary-600 dark:text-primary-300">
              {Number.isFinite(bmi) ? bmi.toFixed(1) : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Category</p>
            <p className="mt-2 text-lg font-semibold text-slate-800 dark:text-slate-100">{category}</p>
          </div>
        </div>
        <div className="mt-6 grid gap-3 text-xs">
          {[
            { label: "Underweight", range: "< 18.5" },
            { label: "Normal", range: "18.5 – 24.9" },
            { label: "Overweight", range: "25 – 29.9" },
            { label: "Obese", range: "≥ 30" }
          ].map((item) => (
            <div
              key={item.label}
              className={`flex items-center justify-between rounded-xl border px-3 py-2 ${
                item.label === category
                  ? "border-primary-400 bg-primary-50 text-primary-700 dark:border-primary-500 dark:bg-primary-950/50 dark:text-primary-200"
                  : "border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400"
              }`}
            >
              <span>{item.label}</span>
              <span>{item.range}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BMICalculator;

