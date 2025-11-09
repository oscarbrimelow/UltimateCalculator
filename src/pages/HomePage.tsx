import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { categories } from "../data/categories";
import { calculators } from "../data/calculators";
import { useSearch } from "../contexts/SearchContext";
import { CalculatorCard } from "../components/calculators/CalculatorCard";
import { classNames } from "../utils/classNames";

const heroFeatures = [
  "Instant results as you type",
  "Live exchange rates & time zones",
  "Offline-ready progressive web app",
  "History synced to your device",
  "Dark mode with system sync",
  "Modular components for rapid expansion"
];

const HomePage = () => {
  const { query } = useSearch();

  const filteredCalculators = useMemo(() => {
    if (!query.trim()) return [];
    const needle = query.toLowerCase();
    return calculators.filter(
      (calculator) =>
        calculator.name.toLowerCase().includes(needle) ||
        calculator.keywords.some((keyword) => keyword.toLowerCase().includes(needle)) ||
        calculator.description.toLowerCase().includes(needle)
    );
  }, [query]);

  const featured = useMemo(
    () => calculators.filter((calculator) => calculator.featured),
    []
  );

  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white via-primary-50/40 to-primary-100/40 p-8 shadow-lg shadow-primary-500/10 dark:border-slate-800 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900/80 dark:to-primary-950">
        <motion.div
          initial={{ opacity: 0, translateY: 24 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl space-y-6"
        >
          <span className="inline-flex items-center rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-300">
            UltimateCalc
          </span>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100 sm:text-4xl lg:text-5xl">
            All your calculations and conversions — in one place.
          </h1>
          <p className="max-w-2xl text-base text-slate-600 dark:text-slate-300">
            UltimateCalc brings together premium calculators across math, finance, science, health,
            and everyday life. Enjoy real-time results, intelligent history, and sleek design on any
            device.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {heroFeatures.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-sm text-slate-700 backdrop-blur transition hover:border-primary-200 hover:text-primary-700 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:border-primary-700 dark:hover:text-primary-200"
              >
                <span className="inline-flex h-2 w-2 rounded-full bg-primary-500" />
                {feature}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/calculator/currency-converter"
              className="inline-flex items-center rounded-full bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/40 transition hover:bg-primary-700"
            >
              Try Live Currency Rates
            </Link>
            <Link
              to="/category/math"
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-primary-300 hover:text-primary-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-primary-600 dark:hover:text-primary-200"
            >
              Browse Categories
            </Link>
          </div>
        </motion.div>
        <motion.div
          className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-primary-500/30 blur-[120px] dark:bg-primary-700/30"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </section>

      {query.trim() ? (
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              {filteredCalculators.length} result{filteredCalculators.length === 1 ? "" : "s"} for
              “{query}”
            </h2>
          </div>
          {filteredCalculators.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/70">
              No calculators matched your search. Try another keyword or explore categories below.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredCalculators.map((calculator, index) => (
                <CalculatorCard key={calculator.id} calculator={calculator} index={index} />
              ))}
            </div>
          )}
        </section>
      ) : (
        <>
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Featured</h2>
              <Link
                to="/settings"
                className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-300 dark:hover:text-primary-200"
              >
                Customize experience
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {featured.map((calculator, index) => (
                <CalculatorCard key={calculator.id} calculator={calculator} index={index} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-6 text-xl font-semibold text-slate-900 dark:text-slate-100">
              Explore by Category
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => {
                const categoryCalculators = calculators.filter((calculator) => calculator.category === category.id);
                return (
                  <div
                    key={category.id}
                    className="group flex h-full flex-col rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary-300/80 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-primary-600/70"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {category.name}
                      </h3>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                        {category.description}
                      </p>
                    </div>
                    <ul className="mt-4 space-y-2 text-sm text-slate-500 dark:text-slate-400">
                      {categoryCalculators.slice(0, 3).map((calculator) => (
                        <li key={calculator.id}>
                          <Link
                            to={`/calculator/${calculator.id}`}
                            className="inline-flex items-center gap-2 rounded-full bg-slate-100/70 px-3 py-1 text-xs font-medium text-slate-600 transition hover:bg-primary-100 hover:text-primary-700 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-primary-900/40 dark:hover:text-primary-200"
                          >
                            <calculator.icon className="h-4 w-4" />
                            {calculator.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link
                      to={`/category/${category.id}`}
                      className={classNames(
                        "mt-6 inline-flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary-300 hover:text-primary-600 dark:border-slate-700 dark:text-slate-200 dark:hover:border-primary-500 dark:hover:text-primary-200"
                      )}
                    >
                      View all
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default HomePage;

