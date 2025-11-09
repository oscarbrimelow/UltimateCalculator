type LoadingScreenProps = {
  label?: string;
};

export const LoadingScreen = ({ label = "Loading…" }: LoadingScreenProps) => {
  return (
    <div className="flex h-full min-h-[320px] w-full flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-200 bg-white/50 p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
      <span className="inline-flex h-12 w-12 animate-spin items-center justify-center rounded-full border-4 border-primary-500/40 border-t-primary-500" />
      <p>{label}</p>
    </div>
  );
};

