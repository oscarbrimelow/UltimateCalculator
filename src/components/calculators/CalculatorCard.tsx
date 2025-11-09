import { memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { CalculatorConfig } from "../../types/calculator";

type CalculatorCardProps = {
  calculator: CalculatorConfig;
  index?: number;
};

const cardVariants = {
  hidden: { opacity: 0, translateY: 16 },
  visible: (index: number = 0) => ({
    opacity: 1,
    translateY: 0,
    transition: {
      delay: index * 0.05,
      duration: 0.3,
      ease: "easeOut"
    }
  })
};

const CalculatorCardComponent = ({ calculator, index = 0 }: CalculatorCardProps) => {
  const Icon = calculator.icon;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      custom={index}
      variants={cardVariants}
      className="group h-full rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm shadow-primary-900/5 transition hover:-translate-y-1 hover:border-primary-300/70 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-primary-500/10"
    >
      <Link to={`/calculator/${calculator.id}`} className="flex h-full flex-col">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-300">
            <Icon className="h-6 w-6" />
          </span>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 transition group-hover:text-primary-600 dark:text-slate-100 dark:group-hover:text-primary-200">
              {calculator.name}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{calculator.tagline}</p>
          </div>
        </div>
        <p className="mt-4 flex-1 text-sm text-slate-600 dark:text-slate-300">{calculator.description}</p>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary-600 transition group-hover:gap-3 dark:text-primary-300">
          Explore
        </span>
      </Link>
    </motion.div>
  );
};

export const CalculatorCard = memo(CalculatorCardComponent);

