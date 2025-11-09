import { useMemo, useState } from "react";
import { Save } from "lucide-react";
import { useHistoryLogger } from "../../hooks/useHistoryLogger";

const factorial = (value: number) => {
  if (value < 0) return NaN;
  if (!Number.isInteger(value)) return NaN;
  if (value === 0 || value === 1) return 1;
  let result = 1;
  for (let index = 2; index <= value; index += 1) {
    result *= index;
  }
  return result;
};

const ScientificCalculator = () => {
  const [angle, setAngle] = useState(30);
  const [angleMode, setAngleMode] = useState<"deg" | "rad">("deg");
  const [value, setValue] = useState(2);
  const [exponent, setExponent] = useState(3);
  const [base, setBase] = useState(10);
  const [logBase, setLogBase] = useState(10);
  const [factorialValue, setFactorialValue] = useState(5);
  const historyLogger = useHistoryLogger();

  const radians = useMemo(() => (angleMode === "deg" ? (angle * Math.PI) / 180 : angle), [angle, angleMode]);

  const trigResults = useMemo(
    () => ({
      sin: Math.sin(radians),
      cos: Math.cos(radians),
      tan: Math.tan(radians)
    }),
    [radians]
  );

  const powerResult = useMemo(() => Math.pow(value, exponent), [value, exponent]);

  const logarithmResult = useMemo(() => Math.log(base) / Math.log(logBase), [base, logBase]);

  const factorialResult = useMemo(() => factorial(factorialValue), [factorialValue]);

  const handleSave = () => {
    historyLogger(
      "scientific-math",
      "Scientific Calculator",
      `sin=${trigResults.sin.toFixed(4)}, cos=${trigResults.cos.toFixed(4)}, tan=${trigResults.tan.toFixed(4)}, ` +
        `${value}^${exponent}=${powerResult.toFixed(4)}, log_${logBase}(${base})=${logarithmResult.toFixed(4)}, ${factorialValue}!=${factorialResult}`,
      {
        angle,
        angleMode,
        trigResults,
        powerResult,
        base,
        logBase,
        logarithmResult,
        factorialValue,
        factorialResult
      }
    );
  };

  return (
    <section className="space-y-8 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Scientific Toolkit</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Trigonometry, powers, logarithms, and factorials — all updating instantly.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary-700"
        >
          <Save className="h-4 w-4" />
          Save Snapshot
        </button>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Trigonometry</h3>
            <div className="flex gap-1 rounded-full bg-slate-200 p-1 dark:bg-slate-800">
              {(["deg", "rad"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setAngleMode(mode)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    angleMode === mode
                      ? "bg-white text-slate-900 shadow dark:bg-slate-700 dark:text-slate-100"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {mode.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <label className="block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Angle
            <input
              type="number"
              value={angle}
              onChange={(event) => setAngle(Number(event.target.value))}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-3">
            {Object.entries(trigResults).map(([key, value]) => (
              <div
                key={key}
                className="rounded-xl bg-white/80 p-4 text-center text-sm text-slate-600 shadow-sm dark:bg-slate-900/70 dark:text-slate-300"
              >
                <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">{key}</p>
                <p className="mt-2 text-lg font-semibold text-primary-600 dark:text-primary-300">
                  {Number.isFinite(value) ? value.toFixed(6) : "Undefined"}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Powers & Logarithms</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Base value
              <input
                type="number"
                value={value}
                onChange={(event) => setValue(Number(event.target.value))}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
              />
            </label>
            <label className="block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Exponent
              <input
                type="number"
                value={exponent}
                onChange={(event) => setExponent(Number(event.target.value))}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
              />
            </label>
          </div>
          <div className="rounded-xl bg-white/80 p-4 text-sm text-slate-600 shadow-sm dark:bg-slate-900/70 dark:text-slate-300">
            <p>
              <span className="font-semibold text-primary-600 dark:text-primary-300">
                {value}^{exponent}
              </span>{" "}
              = {Number.isFinite(powerResult) ? powerResult.toPrecision(8) : "Overflow"}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Logarithm base
              <input
                type="number"
                value={logBase}
                min={2}
                onChange={(event) => setLogBase(Number(event.target.value))}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
              />
            </label>
            <label className="block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Value
              <input
                type="number"
                value={base}
                min={1}
                onChange={(event) => setBase(Number(event.target.value))}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
              />
            </label>
          </div>
          <div className="rounded-xl bg-white/80 p-4 text-sm text-slate-600 shadow-sm dark:bg-slate-900/70 dark:text-slate-300">
            <p>
              <span className="font-semibold text-primary-600 dark:text-primary-300">
                log<sub>{logBase}</sub>({base})
              </span>{" "}
              = {Number.isFinite(logarithmResult) ? logarithmResult.toPrecision(8) : "Undefined"}
            </p>
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Factorial
              <input
                type="number"
                value={factorialValue}
                min={0}
                max={25}
                onChange={(event) => setFactorialValue(Number(event.target.value))}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
              />
            </label>
            <div className="mt-3 rounded-xl bg-white/80 p-4 text-sm text-slate-600 shadow-sm dark:bg-slate-900/70 dark:text-slate-300">
              <p>
                <span className="font-semibold text-primary-600 dark:text-primary-300">
                  {factorialValue}!
                </span>{" "}
                = {Number.isFinite(factorialResult) ? factorialResult.toLocaleString() : "Too large"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScientificCalculator;

