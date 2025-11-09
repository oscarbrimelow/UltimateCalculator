import { useMemo, useState } from "react";
import { DateTime } from "luxon";
import { Save } from "lucide-react";
import { useHistoryLogger } from "../../hooks/useHistoryLogger";

const DateAgeCalculator = () => {
  const [startDate, setStartDate] = useState(DateTime.now().minus({ years: 25 }).toISODate());
  const [endDate, setEndDate] = useState(DateTime.now().toISODate());
  const historyLogger = useHistoryLogger();

  const summary = useMemo(() => {
    const start = DateTime.fromISO(startDate);
    const end = DateTime.fromISO(endDate);
    if (!start.isValid || !end.isValid) {
      return null;
    }
    const diff = end.diff(start, ["years", "months", "days"]);
    const totalDays = Math.round(end.diff(start, "days").days);
    const totalWeeks = Math.round(totalDays / 7);
    const nextBirthday = start.plus({ years: Math.floor(diff.years) + 1 });
    const untilNextBirthday = nextBirthday.diff(end, ["days"]).days;

    return {
      years: Math.floor(diff.years),
      months: Math.floor(diff.months),
      days: Math.floor(diff.days),
      totalDays,
      totalWeeks,
      nextBirthday: nextBirthday.toFormat("ccc, dd LLL yyyy"),
      untilNextBirthday
    };
  }, [startDate, endDate]);

  const handleSave = () => {
    if (!summary) return;
    historyLogger(
      "date-age",
      "Date & Age Calculator",
      `${summary.years}y ${summary.months}m ${summary.days}d (${summary.totalDays} days)`,
      { startDate, endDate, summary }
    );
  };

  return (
    <section className="space-y-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Date & Age Calculator</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Calculate age, durations, and countdowns with human-friendly summaries.
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

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Start date
          <input
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
          />
        </label>
        <label className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          End date
          <input
            type="date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
          />
        </label>
      </div>

      {summary ? (
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600 shadow-inner dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Exact Age</p>
            <p className="mt-2 text-3xl font-semibold text-primary-600 dark:text-primary-300">
              {summary.years}y {summary.months}m {summary.days}d
            </p>
            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
              ({summary.totalDays} days · {summary.totalWeeks} weeks)
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Next birthday / anniversary
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-800 dark:text-slate-100">
              {summary.nextBirthday}
            </p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {summary.untilNextBirthday > 0
                ? `${Math.round(summary.untilNextBirthday)} days remaining`
                : "Today is the day! 🎉"}
            </p>
          </div>
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-5 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-900/70">
          Enter valid start and end dates to calculate the difference.
        </p>
      )}
    </section>
  );
};

export default DateAgeCalculator;

