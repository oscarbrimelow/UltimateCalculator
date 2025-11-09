import { WifiOff } from "lucide-react";
import { Link } from "react-router-dom";

const OfflinePage = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 rounded-3xl border border-dashed border-slate-200 bg-white/80 p-10 text-center dark:border-slate-800 dark:bg-slate-900/80">
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
        <WifiOff className="h-8 w-8" />
      </span>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">You’re offline</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Live calculators like currency rates and time zones need a connection. Offline-ready tools
          and your history remain available.
        </p>
      </div>
      <Link
        to="/"
        className="inline-flex items-center rounded-full bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/40 transition hover:bg-primary-700"
      >
        Back to dashboard
      </Link>
    </div>
  );
};

export default OfflinePage;

