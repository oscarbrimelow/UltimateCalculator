import { useMemo, useState } from "react";
import { Save, Trash2 } from "lucide-react";
import { useHistoryLogger } from "../../hooks/useHistoryLogger";

const allowedPattern = /^[0-9+\-*/().%\s]*$/;

const evaluateExpression = (input: string) => {
  if (!input.trim()) return "0";
  if (!allowedPattern.test(input)) return "Invalid input";
  try {
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict"; return (${input.replace(/%/g, "/100")})`)();
    if (Number.isFinite(result)) {
      return Number(result.toFixed(10)).toString();
    }
    return "Math Error";
  } catch (error) {
    return "Math Error";
  }
};

const keypadButtons = [
  "7",
  "8",
  "9",
  "/",
  "4",
  "5",
  "6",
  "*",
  "1",
  "2",
  "3",
  "-",
  "0",
  ".",
  "%",
  "+"
];

const BasicCalculator = () => {
  const [expression, setExpression] = useState("0");
  const historyLogger = useHistoryLogger();

  const result = useMemo(() => evaluateExpression(expression), [expression]);

  const append = (value: string) => {
    setExpression((prev) => (prev === "0" ? value : `${prev}${value}`));
  };

  const clear = () => setExpression("0");

  const handleSave = () => {
    historyLogger("basic-math", "Standard Calculator", `${expression} = ${result}`, {
      expression,
      result
    });
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-right text-slate-800 shadow-inner dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
            <p className="text-sm text-slate-500 dark:text-slate-400">Expression</p>
            <input
              className="mt-2 w-full bg-transparent text-2xl font-semibold focus:outline-none"
              value={expression}
              onChange={(event) => setExpression(event.target.value)}
              aria-label="Expression"
            />
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Result</p>
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-300">{result}</div>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={clear}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-primary-300 hover:text-primary-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-primary-500 dark:hover:text-primary-200"
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-primary-700"
            >
              <Save className="h-4 w-4" />
              Save to History
            </button>
          </div>
        </div>
        <div className="grid h-full flex-1 grid-cols-4 gap-3">
          {keypadButtons.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => append(value)}
              className="rounded-2xl border border-slate-200 bg-white p-5 text-lg font-semibold text-slate-700 transition hover:border-primary-300 hover:text-primary-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-primary-500 dark:hover:text-primary-200"
            >
              {value}
            </button>
          ))}
          <button
            type="button"
            onClick={() =>
              setExpression((prev) => (prev.length ? prev.slice(0, -1) || "0" : "0"))
            }
            className="col-span-2 rounded-2xl border border-slate-200 bg-white p-5 text-lg font-semibold text-slate-700 transition hover:border-primary-300 hover:text-primary-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-primary-500 dark:hover:text-primary-200"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={() => append("**2")}
            className="rounded-2xl border border-slate-200 bg-white p-5 text-lg font-semibold text-slate-700 transition hover:border-primary-300 hover:text-primary-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-primary-500 dark:hover:text-primary-200"
          >
            x²
          </button>
          <button
            type="button"
            onClick={() => setExpression((prev) => `${prev}**`)}
            className="rounded-2xl border border-slate-200 bg-white p-5 text-lg font-semibold text-slate-700 transition hover:border-primary-300 hover:text-primary-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-primary-500 dark:hover:text-primary-200"
          >
            ^
          </button>
        </div>
      </div>
    </section>
  );
};

export default BasicCalculator;

