import { useMemo, useState } from "react";
import { Save } from "lucide-react";
import { useHistoryLogger } from "../../hooks/useHistoryLogger";

type EquationType = "linear" | "quadratic";

const EquationSolver = () => {
  const [equationType, setEquationType] = useState<EquationType>("linear");
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);
  const [c, setC] = useState(0);
  const historyLogger = useHistoryLogger();

  const result = useMemo(() => {
    if (equationType === "linear") {
      if (a === 0) {
        return {
          description: "Coefficient a must be non-zero for a linear equation.",
          solutions: []
        };
      }
      return {
        description: `Solving ${a}x + ${b} = 0`,
        solutions: [-b / a]
      };
    }
    if (a === 0) {
      return {
        description: "Coefficient a must be non-zero for a quadratic equation.",
        discriminant: null,
        solutions: []
      };
    }
    const discriminant = b * b - 4 * a * c;
    if (discriminant > 0) {
      const sqrtD = Math.sqrt(discriminant);
      return {
        description: `Two distinct real roots (Δ = ${discriminant.toFixed(2)})`,
        discriminant,
        solutions: [(-b + sqrtD) / (2 * a), (-b - sqrtD) / (2 * a)]
      };
    }
    if (discriminant === 0) {
      return {
        description: "One real root (double root). Discriminant is zero.",
        discriminant,
        solutions: [-b / (2 * a)]
      };
    }
    const sqrtD = Math.sqrt(-discriminant);
    const realPart = -b / (2 * a);
    const imaginaryPart = sqrtD / (2 * a);
    return {
      description: `Complex roots (Δ = ${discriminant.toFixed(2)})`,
      discriminant,
      solutions: [
        `${realPart.toFixed(3)} + ${imaginaryPart.toFixed(3)}i`,
        `${realPart.toFixed(3)} - ${imaginaryPart.toFixed(3)}i`
      ]
    };
  }, [equationType, a, b, c]);

  const handleSave = () => {
    historyLogger(
      "equation-solver",
      "Equation Solver",
      `${equationType === "linear" ? "Linear" : "Quadratic"} result: ${result.solutions.join(", ")}`,
      { type: equationType, a, b, c, result }
    );
  };

  return (
    <section className="space-y-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Equation Solver</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Solve linear (ax + b = 0) and quadratic (ax² + bx + c = 0) equations instantly.
          </p>
        </div>
        <div className="inline-flex rounded-full bg-slate-200 p-1 dark:bg-slate-800">
          {(["linear", "quadratic"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setEquationType(type)}
              className={`rounded-full px-4 py-2 text-xs font-semibold capitalize transition ${
                equationType === type
                  ? "bg-white text-slate-900 shadow dark:bg-slate-700 dark:text-slate-100"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </header>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          a
          <input
            type="number"
            value={a}
            onChange={(event) => setA(Number(event.target.value))}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
          />
        </label>
        <label className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          b
          <input
            type="number"
            value={b}
            onChange={(event) => setB(Number(event.target.value))}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
          />
        </label>
        {equationType === "quadratic" && (
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            c
            <input
              type="number"
              value={c}
              onChange={(event) => setC(Number(event.target.value))}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
            />
          </label>
        )}
      </div>
      <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{result.description}</p>
        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          {result.discriminant !== undefined && result.discriminant !== null && (
            <p>
              Discriminant (Δ):{" "}
              <span className="font-semibold text-primary-600 dark:text-primary-300">
                {result.discriminant.toFixed(4)}
              </span>
            </p>
          )}
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Solutions</p>
            <ul className="mt-2 space-y-2">
              {result.solutions.map((solution, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between rounded-xl bg-white/80 px-4 py-2 text-sm text-slate-700 shadow-sm dark:bg-slate-900/70 dark:text-slate-200"
                >
                  <span>x{result.solutions.length > 1 ? index + 1 : ""}</span>
                  <span className="font-semibold text-primary-600 dark:text-primary-300">
                    {typeof solution === "number" ? solution.toFixed(6) : solution}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary-700"
        >
          <Save className="h-4 w-4" />
          Save to History
        </button>
      </div>
    </section>
  );
};

export default EquationSolver;

