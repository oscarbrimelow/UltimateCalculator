import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { categories } from "../../data/categories";
import { calculators } from "../../data/calculators";
import { classNames } from "../../utils/classNames";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const brand = {
  title: "UltimateCalc",
  tagline: "All your calculations and conversions — in one place."
};

const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-white/80 backdrop-blur dark:bg-slate-900/90 lg:bg-transparent">
      <div className="px-6 py-8">
        <Link to="/" onClick={onNavigate}>
          <span className="flex flex-col">
            <span className="text-xl font-semibold tracking-tight sm:text-2xl">{brand.title}</span>
            <span className="mt-1 text-sm text-slate-500 dark:text-slate-400">{brand.tagline}</span>
          </span>
        </Link>
      </div>
      <nav className="flex-1 px-4 pb-10">
        <p className="px-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Categories
        </p>
        <ul className="mt-3 space-y-1">
          {categories.map((category) => {
            const isActive = location.pathname.includes(category.id);
            return (
              <li key={category.id}>
                <Link
                  to={`/category/${category.id}`}
                  onClick={onNavigate}
                  className={classNames(
                    "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition",
                    isActive
                      ? "bg-primary-500/10 text-primary-700 dark:text-primary-200"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  )}
                >
                  {category.name}
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="mt-8 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Quick Picks
        </p>
        <ul className="mt-3 space-y-1">
          {calculators
            .filter((calculator) => calculator.featured)
            .map((calculator) => (
              <li key={calculator.id}>
                <button
                  type="button"
                  onClick={() => {
                    navigate(`/calculator/${calculator.id}`);
                    onNavigate?.();
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <calculator.icon className="h-4 w-4 text-primary-500" />
                  <span>{calculator.name}</span>
                </button>
              </li>
            ))}
        </ul>
      </nav>
      <div className="border-t border-slate-200 px-6 py-6 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        © {new Date().getFullYear()} UltimateCalc. Crafted for modern problem solvers.
      </div>
    </div>
  );
};

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-900/60" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-200 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-200 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1">
                <SidebarContent onNavigate={onClose} />
                <button
                  type="button"
                  className="absolute right-4 top-4 inline-flex items-center rounded-md bg-white/80 p-1 text-slate-500 shadow-sm hover:text-slate-700 dark:bg-slate-900/90 dark:text-slate-400 dark:hover:text-slate-200"
                  onClick={onClose}
                >
                  <X className="h-5 w-5" />
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col border-r border-slate-200/50 bg-white/60 shadow-lg shadow-primary-500/5 backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/80">
          <SidebarContent />
        </div>
      </div>

    </>
  );
};

