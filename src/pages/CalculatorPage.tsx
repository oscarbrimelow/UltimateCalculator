import { Suspense, useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { calculators } from "../data/calculators";
import { LoadingScreen } from "../components/ui/LoadingScreen";

const CalculatorPage = () => {
  const { calculatorId } = useParams<{ calculatorId: string }>();

  const calculator = useMemo(
    () => calculators.find((item) => item.id === calculatorId),
    [calculatorId]
  );

  if (!calculator) {
    return <Navigate to="/" replace />;
  }

  const Icon = calculator.icon;

  return (
    <div className="space-y-10">
      <motion.header
        initial={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"
      >
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500/10 text-primary-600 dark:text-primary-300">
            <Icon className="h-6 w-6" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-300">
              UltimateCalc
            </p>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
              {calculator.name}
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{calculator.description}</p>
          </div>
        </div>
      </motion.header>

      <Suspense fallback={<LoadingScreen label="Loading calculator…" />}>
        <calculator.component />
      </Suspense>
    </div>
  );
};

export default CalculatorPage;

