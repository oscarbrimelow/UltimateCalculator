import { useMemo, useState } from "react";
import { Save } from "lucide-react";
import { useHistoryLogger } from "../../hooks/useHistoryLogger";

type SolveFor = "voltage" | "current" | "resistance";

const OhmsLawCalculator = () => {
  const [solveFor, setSolveFor] = useState<SolveFor>("voltage");
  const [voltage, setVoltage] = useState(120);
  const [current, setCurrent] = useState(10);
  const [resistance, setResistance] = useState(12);
  const historyLogger = useHistoryLogger();

  const result = useMemo(() => {
    let solvedVoltage = voltage;
    let solvedCurrent = current;
    let solvedResistance = resistance;

    if (solveFor === "voltage") {
      solvedVoltage = solvedCurrent * solvedResistance;
    } else if (solveFor === "current") {
      solvedCurrent = solvedResistance === 0 ? NaN : solvedVoltage / solvedResistance;
    } else if (solveFor === "resistance") {
      solvedResistance = solvedCurrent === 0 ? NaN : solvedVoltage / solvedCurrent;
    }

    const power = solvedVoltage * solvedCurrent;

    return {
      voltage: solvedVoltage,
      current: solvedCurrent,
      resistance: solvedResistance,
      power
    };
  }, [solveFor, voltage, current, resistance]);

  const handleSave = () => {
    historyLogger(
      "ohms-law",
      "Ohm’s Law",
      `V=${result.voltage.toFixed(2)}V, I=${result.current.toFixed(2)}A, R=${result.resistance.toFixed(2)}Ω`,
      { solveFor, inputs: { voltage, current, resistance }, result }
    );
  };

  return (
    <section className="space-y-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Ohm’s Law Calculator</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Provide any two variables to solve for the third, plus instantaneous power.
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

      <div className="inline-flex rounded-full bg-slate-200 p-1 dark:bg-slate-800">
        {(["voltage", "current", "resistance"] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setSolveFor(option)}
            className={`rounded-full px-4 py-2 text-xs font-semibold capitalize transition ${
              solveFor === option
                ? "bg-white text-slate-900 shadow dark:bg-slate-700 dark:text-slate-100"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            Solve for {option}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Voltage (V)
          <input
            type="number"
            value={voltage}
            onChange={(event) => setVoltage(Number(event.target.value))}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
            disabled={solveFor === "voltage"}
          />
        </label>
        <label className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Current (A)
          <input
            type="number"
            value={current}
            onChange={(event) => setCurrent(Number(event.target.value))}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
            disabled={solveFor === "current"}
          />
        </label>
        <label className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Resistance (Ω)
          <input
            type="number"
            value={resistance}
            onChange={(event) => setResistance(Number(event.target.value))}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
            disabled={solveFor === "resistance"}
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Voltage", value: `${Number.isFinite(result.voltage) ? result.voltage.toFixed(2) : "—"} V` },
          { label: "Current", value: `${Number.isFinite(result.current) ? result.current.toFixed(2) : "—"} A` },
          { label: "Resistance", value: `${Number.isFinite(result.resistance) ? result.resistance.toFixed(2) : "—"} Ω` },
          { label: "Power (P = V·I)", value: `${Number.isFinite(result.power) ? result.power.toFixed(2) : "—"} W` }
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

export default OhmsLawCalculator;

