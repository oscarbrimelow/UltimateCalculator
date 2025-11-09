import { useMemo, useState } from "react";
import { Save } from "lucide-react";
import { useHistoryLogger } from "../../hooks/useHistoryLogger";

const ELEMENT_MASS: Record<string, number> = {
  H: 1.008,
  He: 4.0026,
  Li: 6.94,
  Be: 9.0122,
  B: 10.81,
  C: 12.011,
  N: 14.007,
  O: 15.999,
  F: 18.998,
  Ne: 20.18,
  Na: 22.989,
  Mg: 24.305,
  Al: 26.982,
  Si: 28.085,
  P: 30.974,
  S: 32.06,
  Cl: 35.45,
  K: 39.098,
  Ar: 39.948,
  Ca: 40.078,
  Fe: 55.845,
  Cu: 63.546,
  Zn: 65.38,
  Br: 79.904,
  Ag: 107.8682,
  I: 126.90447,
  Au: 196.96657,
  Hg: 200.59,
  Pb: 207.2
};

type BreakdownEntry = {
  element: string;
  count: number;
  mass: number;
  contribution: number;
};

const parseFormula = (formula: string) => {
  const stack: Array<Record<string, number>> = [{}];
  const tokens = formula.match(/([A-Z][a-z]?|\d+|\(|\))/g);
  if (!tokens) return {};

  let index = 0;
  while (index < tokens.length) {
    const token = tokens[index];
    if (token === "(") {
      stack.push({});
      index += 1;
      continue;
    }
    if (token === ")") {
      const group = stack.pop();
      if (!group) throw new Error("Mismatched parentheses");
      index += 1;
      const multiplier = Number(tokens[index] ?? "1");
      if (!Number.isNaN(multiplier)) {
        if (/\d+/.test(tokens[index] ?? "")) {
          index += 1;
        }
      }
      const base = stack[stack.length - 1];
      Object.entries(group).forEach(([element, count]) => {
        base[element] = (base[element] ?? 0) + count * multiplier;
      });
      continue;
    }
    if (/^[A-Z][a-z]?$/.test(token)) {
      const element = token;
      let count = 1;
      if (/\d+/.test(tokens[index + 1] ?? "")) {
        count = Number(tokens[index + 1]);
        index += 1;
      }
      const current = stack[stack.length - 1];
      current[element] = (current[element] ?? 0) + count;
      index += 1;
      continue;
    }
    if (/\d+/.test(token)) {
      index += 1;
      continue;
    }
    index += 1;
  }
  return stack.pop() ?? {};
};

const ChemistryMolarMassCalculator = () => {
  const [formula, setFormula] = useState("H2O");
  const [error, setError] = useState<string | null>(null);
  const historyLogger = useHistoryLogger();

  const breakdown = useMemo<BreakdownEntry[]>(() => {
    try {
      const counts = parseFormula(formula);
      const entries: BreakdownEntry[] = Object.entries(counts).map(([element, count]) => {
        const mass = ELEMENT_MASS[element];
        if (!mass) {
          throw new Error(`Unknown element: ${element}`);
        }
        return {
          element,
          count,
          mass,
          contribution: mass * count
        };
      });
      setError(null);
      return entries;
    } catch (caughtError) {
      if (caughtError instanceof Error) {
        setError(caughtError.message);
      } else {
        setError("Unable to parse formula");
      }
      return [];
    }
  }, [formula]);

  const molarMass = breakdown.reduce((sum, entry) => sum + entry.contribution, 0);

  const handleSave = () => {
    historyLogger(
      "chemistry-molar-mass",
      "Molar Mass Calculator",
      `${formula}: ${molarMass.toFixed(3)} g/mol`,
      { formula, molarMass, breakdown }
    );
  };

  return (
    <section className="space-y-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Molar Mass Calculator</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Enter chemical formulas including parentheses, e.g. C6H12O6, Al2(SO4)3.
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

      <label className="block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Formula
        <input
          type="text"
          value={formula}
          onChange={(event) => setFormula(event.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
          placeholder="Enter chemical formula"
        />
      </label>

      {error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/60 dark:text-red-200">
          {error}
        </p>
      ) : (
        <>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600 shadow-inner dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Molar Mass</p>
            <p className="mt-2 text-3xl font-semibold text-primary-600 dark:text-primary-300">
              {molarMass.toFixed(3)} g/mol
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 px-6 py-4 text-sm font-semibold text-slate-600 dark:border-slate-800 dark:text-slate-300">
              Breakdown
            </div>
            <div className="max-h-64 overflow-y-auto px-6 py-4 text-xs text-slate-600 dark:text-slate-300">
              <table className="w-full table-fixed border-collapse">
                <thead className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  <tr>
                    <th className="py-2 text-left">Element</th>
                    <th className="py-2 text-right">Count</th>
                    <th className="py-2 text-right">Atomic Mass</th>
                    <th className="py-2 text-right">Contribution</th>
                  </tr>
                </thead>
                <tbody>
                  {breakdown.map((entry) => (
                    <tr key={entry.element} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                      <td className="py-2 font-semibold text-slate-700 dark:text-slate-200">{entry.element}</td>
                      <td className="py-2 text-right">{entry.count}</td>
                      <td className="py-2 text-right">{entry.mass.toFixed(3)}</td>
                      <td className="py-2 text-right">{entry.contribution.toFixed(3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default ChemistryMolarMassCalculator;

