import { useMemo, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Save } from "lucide-react";
import { useHistoryLogger } from "../../hooks/useHistoryLogger";

ChartJS.register(ArcElement, Tooltip, Legend);

type ScheduleRow = {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
};

const buildSchedule = (principal: number, annualRate: number, years: number): ScheduleRow[] => {
  const totalMonths = Math.round(years * 12);
  const monthlyRate = annualRate / 100 / 12;
  const payment =
    monthlyRate === 0
      ? principal / totalMonths
      : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalMonths));

  let balance = principal;
  const schedule: ScheduleRow[] = [];

  for (let month = 1; month <= totalMonths; month += 1) {
    const interestPayment = monthlyRate === 0 ? 0 : balance * monthlyRate;
    const principalPayment = payment - interestPayment;
    balance = Math.max(0, balance - principalPayment);
    schedule.push({
      month,
      payment,
      principal: principalPayment,
      interest: interestPayment,
      balance
    });
    if (balance <= 0.01) break;
  }
  return schedule;
};

const LoanCalculator = () => {
  const [principal, setPrincipal] = useState(350000);
  const [interestRate, setInterestRate] = useState(5);
  const [years, setYears] = useState(30);
  const historyLogger = useHistoryLogger();

  const schedule = useMemo(() => buildSchedule(principal, interestRate, years), [principal, interestRate, years]);

  const totals = useMemo(() => {
    const totalPayment = schedule.reduce((sum, row) => sum + row.payment, 0);
    const totalInterest = schedule.reduce((sum, row) => sum + row.interest, 0);
    return {
      monthlyPayment: schedule[0]?.payment ?? 0,
      totalPayment,
      totalInterest
    };
  }, [schedule]);

  const chartData = useMemo(
    () => ({
      labels: ["Principal", "Interest"],
      datasets: [
        {
          data: [principal, totals.totalInterest],
          backgroundColor: ["#2563eb", "#f97316"],
          hoverBackgroundColor: ["#1d4ed8", "#ea580c"]
        }
      ]
    }),
    [principal, totals.totalInterest]
  );

  const handleSave = () => {
    historyLogger(
      "loan-calculator",
      "Loan & Mortgage",
      `Monthly payment ${totals.monthlyPayment.toFixed(2)}, total interest ${totals.totalInterest.toFixed(2)}`,
      { principal, interestRate, years, totals }
    );
  };

  return (
    <section className="space-y-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Loan & Mortgage Planner</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Understand payments, interest, and amortization instantly.
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
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Principal
              <input
                type="number"
                value={principal}
                min={0}
                onChange={(event) => setPrincipal(Number(event.target.value))}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
              />
            </label>
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Interest rate (%)
              <input
                type="number"
                value={interestRate}
                min={0}
                step={0.01}
                onChange={(event) => setInterestRate(Number(event.target.value))}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
              />
            </label>
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Term (years)
              <input
                type="number"
                value={years}
                min={1}
                step={1}
                onChange={(event) => setYears(Number(event.target.value))}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
              />
            </label>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-600 shadow-inner dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            <div className="grid gap-4 p-6 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Monthly Payment</p>
                <p className="mt-2 text-2xl font-semibold text-primary-600 dark:text-primary-300">
                  ${totals.monthlyPayment.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Total Interest</p>
                <p className="mt-2 text-xl font-semibold text-orange-500">
                  ${totals.totalInterest.toFixed(0)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Total Paid</p>
                <p className="mt-2 text-xl font-semibold text-slate-800 dark:text-slate-100">
                  ${(totals.totalPayment).toFixed(0)}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 px-6 py-4 text-sm font-semibold text-slate-600 dark:border-slate-800 dark:text-slate-300">
              First 12 Months
            </div>
            <div className="max-h-72 overflow-y-auto px-6 py-4 text-xs text-slate-600 dark:text-slate-300">
              <table className="w-full table-fixed border-collapse">
                <thead className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  <tr>
                    <th className="py-2 text-left">Month</th>
                    <th className="py-2 text-right">Payment</th>
                    <th className="py-2 text-right">Principal</th>
                    <th className="py-2 text-right">Interest</th>
                    <th className="py-2 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.slice(0, 12).map((row) => (
                    <tr key={row.month} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                      <td className="py-2">#{row.month}</td>
                      <td className="py-2 text-right">${row.payment.toFixed(2)}</td>
                      <td className="py-2 text-right">${row.principal.toFixed(2)}</td>
                      <td className="py-2 text-right">${row.interest.toFixed(2)}</td>
                      <td className="py-2 text-right">${row.balance.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="relative h-64 w-64">
            <Doughnut data={chartData} />
          </div>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            Principal vs interest over the life of the loan.
          </p>
        </div>
      </div>
    </section>
  );
};

export default LoanCalculator;

