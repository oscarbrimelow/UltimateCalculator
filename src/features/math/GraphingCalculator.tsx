import { useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Save } from "lucide-react";
import { useHistoryLogger } from "../../hooks/useHistoryLogger";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const DEFAULT_EXPRESSION = "sin(x)";

const safeEvaluator = (expression: string) => {
  const cleaned = expression.trim();
  if (!cleaned) {
    throw new Error("Expression is empty");
  }

  const allowed = /^[0-9+\-*/().,^x\sA-Za-z]*$/;
  if (!allowed.test(cleaned)) {
    throw new Error("Unsupported characters in expression");
  }

  return Function(
    "x",
    `
    const { sin, cos, tan, asin, acos, atan, log, log10, sqrt, pow, abs, exp, PI, E, floor, ceil, round, max, min } = Math;
    return (${cleaned.replace(/\^/g, "**")});
  `
  );
};

const generateData = (expression: string, xMin: number, xMax: number) => {
  const evaluator = safeEvaluator(expression);
  const points = 250;
  const step = (xMax - xMin) / (points - 1);
  const labels: number[] = [];
  const data: number[] = [];

  for (let index = 0; index < points; index += 1) {
    const x = xMin + step * index;
    let y: number;
    try {
      y = evaluator(x);
      if (!Number.isFinite(y)) {
        y = NaN;
      }
    } catch (error) {
      y = NaN;
    }
    labels.push(Number(x.toFixed(2)));
    data.push(Number.isFinite(y) ? Number(y.toFixed(4)) : NaN);
  }

  return { labels, data };
};

const GraphingCalculator = () => {
  const [expression, setExpression] = useState(DEFAULT_EXPRESSION);
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);
  const [plotData, setPlotData] = useState(() => generateData(DEFAULT_EXPRESSION, -10, 10));
  const [error, setError] = useState<string | null>(null);
  const historyLogger = useHistoryLogger();

  useEffect(() => {
    try {
      if (xMax <= xMin) {
        throw new Error("x-max must be greater than x-min");
      }
      const generated = generateData(expression, xMin, xMax);
      setPlotData(generated);
      setError(null);
    } catch (caughtError) {
      if (caughtError instanceof Error) {
        setError(caughtError.message);
      } else {
        setError("Unable to evaluate expression");
      }
    }
  }, [expression, xMin, xMax]);

  const chartData = useMemo(
    () => ({
      labels: plotData.labels,
      datasets: [
        {
          label: `y = ${expression}`,
          data: plotData.data,
          borderColor: "#2563eb",
          pointRadius: 0,
          borderWidth: 2,
          segment: {
            borderDash: (ctx: { p1DataIndex: number }) => {
              const value = plotData.data[ctx.p1DataIndex];
              return Number.isNaN(value) ? [6, 6] : undefined;
            }
          }
        }
      ]
    }),
    [plotData, expression]
  );

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true
        },
        tooltip: {
          intersect: false
        }
      },
      scales: {
        x: {
          grid: {
            color: "rgba(148, 163, 184, 0.2)"
          },
          ticks: {
            maxTicksLimit: 8
          }
        },
        y: {
          grid: {
            color: "rgba(148, 163, 184, 0.2)"
          },
          ticks: {
            maxTicksLimit: 6
          }
        }
      }
    }),
    []
  );

  const handleSave = () => {
    historyLogger("graphing-calculator", "Graphing Calculator", `y = ${expression}`, {
      expression,
      domain: [xMin, xMax],
      sample: plotData.data.slice(0, 5)
    });
  };

  return (
    <section className="space-y-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Graphing Calculator</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Plot equations with automatic sampling. Use functions like sin, cos, tan, log, sqrt, exp.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary-700"
        >
          <Save className="h-4 w-4" />
          Save Plot
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="sm:col-span-2">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Expression
          </span>
          <input
            type="text"
            value={expression}
            onChange={(event) => setExpression(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
            placeholder="ex. sin(x) * cos(x/2)"
          />
        </label>
        <label>
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            x-min
          </span>
          <input
            type="number"
            value={xMin}
            onChange={(event) => setXMin(Number(event.target.value))}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
          />
        </label>
        <label>
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            x-max
          </span>
          <input
            type="number"
            value={xMax}
            onChange={(event) => setXMax(Number(event.target.value))}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
          />
        </label>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/60 dark:text-red-200">
          {error}
        </div>
      ) : (
        <div className="h-[420px] rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
      <div className="rounded-2xl bg-slate-50 p-5 text-xs leading-5 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
        <p className="font-semibold text-slate-700 dark:text-slate-300">Tips</p>
        <ul className="mt-2 space-y-2">
          <li>Use ^ for powers: x^2, x^3, etc.</li>
          <li>Available functions: sin, cos, tan, asin, acos, atan, log, log10, sqrt, exp, abs.</li>
          <li>Combine expressions: sin(x) + cos(x/2) * exp(-x/10).</li>
        </ul>
      </div>
    </section>
  );
};

export default GraphingCalculator;

