import { useMemo } from "react";
import { useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { categories } from "../data/categories";
import { calculators } from "../data/calculators";
import { CalculatorCard } from "../components/calculators/CalculatorCard";

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();

  const category = useMemo(
    () => categories.find((item) => item.id === categoryId),
    [categoryId]
  );

  const categoryCalculators = useMemo(
    () => calculators.filter((calculator) => calculator.category === categoryId),
    [categoryId]
  );

  if (!category) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="space-y-12">
      <motion.div
        initial={{ opacity: 0, translateY: 16 }}
        animate={{ opacity: 1, translateY: 0 }}
        className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-300">
          Category
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">{category.name}</h1>
        <p className="mt-4 max-w-3xl text-sm text-slate-600 dark:text-slate-300">{category.description}</p>
      </motion.div>

      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Calculators</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Explore specialized tools within {category.name}.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {categoryCalculators.map((calculator, index) => (
            <CalculatorCard key={calculator.id} calculator={calculator} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;

