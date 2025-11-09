import { useMemo, useState } from "react";
import { Save } from "lucide-react";
import { useHistoryLogger } from "../../hooks/useHistoryLogger";

const PhysicsCalculator = () => {
  const [mass, setMass] = useState(75); // kg
  const [acceleration, setAcceleration] = useState(2); // m/s^2
  const [velocity, setVelocity] = useState(10); // m/s
  const [height, setHeight] = useState(5); // m
  const [area, setArea] = useState(0.5); // m^2
  const historyLogger = useHistoryLogger();

  const results = useMemo(() => {
    const force = mass * acceleration;
    const kineticEnergy = 0.5 * mass * velocity * velocity;
    const potentialEnergy = mass * 9.80665 * height;
    const pressure = area > 0 ? force / area : Infinity;

    return {
      force,
      kineticEnergy,
      potentialEnergy,
      pressure
    };
  }, [mass, acceleration, velocity, height, area]);

  const handleSave = () => {
    historyLogger(
      "physics-calculator",
      "Physics Toolbox",
      `F=${results.force.toFixed(2)}N, Ek=${results.kineticEnergy.toFixed(2)}J`,
      { mass, acceleration, velocity, height, area, results }
    );
  };

  return (
    <section className="space-y-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Physics Formulas</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Compute force, energy, and pressure simultaneously with live updates.
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Mass (kg)
          <input
            type="number"
            value={mass}
            min={0}
            step={0.1}
            onChange={(event) => setMass(Number(event.target.value))}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
          />
        </label>
        <label className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Acceleration (m/s²)
          <input
            type="number"
            value={acceleration}
            step={0.1}
            onChange={(event) => setAcceleration(Number(event.target.value))}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
          />
        </label>
        <label className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Velocity (m/s)
          <input
            type="number"
            value={velocity}
            step={0.1}
            onChange={(event) => setVelocity(Number(event.target.value))}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
          />
        </label>
        <label className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Height (m)
          <input
            type="number"
            value={height}
            step={0.1}
            onChange={(event) => setHeight(Number(event.target.value))}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
          />
        </label>
        <label className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Area (m²)
          <input
            type="number"
            value={area}
            min={0.0001}
            step={0.01}
            onChange={(event) => setArea(Number(event.target.value))}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Force (F = m·a)", value: `${results.force.toFixed(2)} N` },
          { label: "Kinetic Energy (Ek = ½ m·v²)", value: `${results.kineticEnergy.toFixed(2)} J` },
          { label: "Potential Energy (Ep = m·g·h)", value: `${results.potentialEnergy.toFixed(2)} J` },
          { label: "Pressure (P = F/A)", value: `${Number.isFinite(results.pressure) ? results.pressure.toFixed(2) : "∞"} Pa` }
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

export default PhysicsCalculator;

