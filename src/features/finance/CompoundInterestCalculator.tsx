import { useMemo, useState } from "react";
import { Save } from "lucide-react";
import { useHistoryLogger } from "../../hooks/useHistoryLogger";

type Frequency = "annually" | "quarterly" | "monthly" | "daily";

const frequencyMap: Record<Frequency, number> = {
  annually: 1,
  quarterly: 4,
  monthly: 12,
  daily: 365
};

const CompoundInterestCalculator = () => {
  const [principal, setPrincipal] = useState(10000);
  const [contribution, setContribution] = useState(250);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(10);
  const [frequency, setFrequency] = useState<Frequency>("monthly");
  const historyLogger = useHistoryLogger();

  const summary = useMemo(() => {
    const periodsPerYear = frequencyMap[frequency];
    const totalPeriods = periodsPerYear * years;
    const periodicRate = rate / 100 / periodsPerYear;

    const compoundFactor = Math.pow(1 + periodicRate, totalPeriods);
    const futurePrincipal = principal * compoundFactor;
    const futureContributions =
      periodicRate === 0 ? contribution * totalPeriods : contribution * ((compoundFactor - 1) / periodicRate);
    const futureValue = futurePrincipal + futureContributions;
    const totalContribution = principal + contribution * totalPeriods;

    return {
      futureValue,
      totalContribution,
      totalGrowth: futureValue - totalContribution,
      breakdown: {
        principal: futurePrincipal,
        contributions: futureContributions
      },
      yearlySnapshots: Array.from({ length: years }, (_, index) => {
        const year = index + 1;
        const periods = year * periodsPerYear;
        const factor = Math.pow(1 + periodicRate, periods);
        const principalValue = principal * factor;
        const contributionValue =
          periodicRate === 0 ? contribution * periods : contribution * ((factor - 1) / periodicRate);
        return {
          year,
          value: principalValue + contributionValue
        };
      })
    };
  }, [principal, contribution, rate, years, frequency]);

  const handleSave = () => {
    historyLogger(
      "compound-interest",
      "Compound Interest",
      `Future value $${summary.futureValue.toFixed(2)} after ${years} years`,
      { principal, contribution, rate, years, frequency, summary }
    );
  };

  return (
    <section className="space-y-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Compound Interest Planner
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Understand growth with regular contributions and compounding frequencies.
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

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Initial principal
              <input
                type="number"
                value={principal}
                min={0}
                onChange={(event) => setPrincipal(Number(event.target.value))}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
              />
            </label>
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Contribution per period
              <input
                type="number"
                value={contribution}
                min={0}
                onChange={(event) => setContribution(Number(event.target.value))}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
              />
            </label>
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Annual interest (%)
              <input
                type="number"
                value={rate}
                min={0}
                step={0.01}
                onChange={(event) => setRate(Number(event.target.value))}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
              />
            </label>
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Years
              <input
                type="number"
                value={years}
                min={1}
                onChange={(event) => setYears(Number(event.target.value))}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
              />
            </label>
            <label className="sm:col-span-2 lg:col-span-1 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Compounding frequency
              <select
                value={frequency}
                onChange={(event) => setFrequency(event.target.value as Frequency)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
              >
                <option value="annually">Annually</option>
                <option value="quarterly">Quarterly</option>
                <option value="monthly">Monthly</option>
                <option value="daily">Daily</option>
              </select>
            </label>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600 shadow-inner dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Future Value</p>
                <p className="mt-2 text-2xl font-semibold text-primary-600 dark:text-primary-300">
                  ${summary.futureValue.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Total Contributed</p>
                <p className="mt-2 text-xl font-semibold text-slate-800 dark:text-slate-100">
                  ${summary.totalContribution.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Total Growth</p>
                <p className="mt-2 text-xl font-semibold text-emerald-600">
                  +${summary.totalGrowth.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 px-6 py-4 text-sm font-semibold text-slate-600 dark:border-slate-800 dark:text-slate-300">
              Yearly snapshot
            </div>
            <div className="max-h-72 overflow-y-auto px-6 py-4 text-xs text-slate-600 dark:text-slate-300">
              <table className="w-full table-fixed border-collapse">
                <thead className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  <tr>
                    <th className="py-2 text-left">Year</th>
                    <th className="py-2 text-right">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.yearlySnapshots.map((row) => (
                    <tr key={row.year} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                      <td className="py-2">Year {row.year}</td>
                      <td className="py-2 text-right">${row.value.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Breakdown</h3>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span>Growth from principal</span>
              <span className="font-semibold text-primary-600 dark:text-primary-300">
                ${(summary.breakdown.principal - principal).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Growth from contributions</span>
              <span className="font-semibold text-primary-600 dark:text-primary-300">
                ${(summary.breakdown.contributions - contribution * frequencyMap[frequency] * years).toFixed(2)}
              </span>
            </div>
          </div>
          <p className="mt-6 text-xs leading-5 text-slate-500 dark:text-slate-400">
            Future value considers contributions at the end of each compounding period. Adjust the
            frequency to model weekly or daily savings.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CompoundInterestCalculator;

