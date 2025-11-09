import { Menu, Search, Clock } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSearch } from "../../contexts/SearchContext";
import { ThemeToggle } from "../ui/ThemeToggle";

type TopBarProps = {
  onToggleSidebar: () => void;
  onToggleHistory: () => void;
};

export const TopBar = ({ onToggleSidebar, onToggleHistory }: TopBarProps) => {
  const { query, setQuery } = useSearch();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  return (
    <header className="border-b border-slate-200/80 bg-white/70 backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/70">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <button
          type="button"
          className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
          onClick={onToggleSidebar}
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="relative flex flex-1 items-center">
          <Search className="absolute left-3 h-4 w-4 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={handleSearchChange}
            className="w-full rounded-full border border-transparent bg-slate-100 py-2 pl-10 pr-4 text-sm text-slate-700 shadow-inner focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/40 dark:bg-slate-800 dark:text-slate-200"
            placeholder="Search calculators (ex. currency, BMI, graph)…"
            autoComplete="off"
          />
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={onToggleHistory}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition hover:border-primary-400 hover:text-primary-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-primary-500 dark:hover:text-primary-300"
          >
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">History</span>
          </button>
        </div>
      </div>
    </header>
  );
};

