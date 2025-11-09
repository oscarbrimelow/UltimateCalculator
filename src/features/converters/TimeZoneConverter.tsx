import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { Save, RefreshCw } from "lucide-react";
import { POPULAR_TIMEZONES } from "../../data/timezones";
import { usePreferencesStore } from "../../store/preferencesStore";
import { useHistoryLogger } from "../../hooks/useHistoryLogger";

const fetchTimezones = async (): Promise<string[]> => {
  const response = await fetch("https://worldtimeapi.org/api/timezone");
  if (!response.ok) {
    throw new Error("Unable to fetch time zones");
  }
  return response.json();
};

const TimeZoneConverter = () => {
  const { defaultTimeZone } = usePreferencesStore();
  const historyLogger = useHistoryLogger();
  const [baseZone, setBaseZone] = useState(defaultTimeZone);
  const [targetZone, setTargetZone] = useState("UTC");
  const [baseDateTime, setBaseDateTime] = useState(DateTime.now().setZone(defaultTimeZone));

  const { data: remoteTimezones, isError, refetch, isFetching } = useQuery({
    queryKey: ["world-timezones"],
    queryFn: fetchTimezones,
    staleTime: 1000 * 60 * 60
  });

  useEffect(() => {
    setBaseZone(defaultTimeZone);
    setBaseDateTime(DateTime.now().setZone(defaultTimeZone));
  }, [defaultTimeZone]);

  const timezones = useMemo(() => {
    if (remoteTimezones && Array.isArray(remoteTimezones)) {
      return remoteTimezones;
    }
    return Array.from(
      new Set([
        ...POPULAR_TIMEZONES,
        "America/Mexico_City",
        "Europe/Amsterdam",
        "Asia/Seoul",
        "Pacific/Auckland"
      ])
    );
  }, [remoteTimezones]);

  const formattedBaseValue = baseDateTime.toFormat("yyyy-LL-dd'T'HH:mm");
  const targetDateTime = baseDateTime.setZone(targetZone);
  const formattedTargetValue = targetDateTime.toFormat("yyyy-LL-dd HH:mm");

  useEffect(() => {
    const interval = setInterval(() => {
      setBaseDateTime((current) => current.plus({ minutes: 1 }));
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  const handleBaseDateChange = (value: string) => {
    const parsed = DateTime.fromFormat(value, "yyyy-LL-dd'T'HH:mm", { zone: baseZone });
    if (parsed.isValid) {
      setBaseDateTime(parsed);
    }
  };

  const handleSave = () => {
    historyLogger(
      "time-zone",
      "Time Zone Converter",
      `${baseDateTime.toFormat("yyyy LLL dd HH:mm")} ${baseZone} → ${formattedTargetValue} ${targetZone}`,
      { baseZone, targetZone, base: baseDateTime.toISO(), target: targetDateTime.toISO() }
    );
  };

  return (
    <section className="space-y-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Time Zone Converter</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Compare times across the globe with live offsets and cached fallbacks.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm hover:border-primary-300 hover:text-primary-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-primary-500 dark:hover:text-primary-200"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            Refresh zones
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary-700"
          >
            <Save className="h-4 w-4" />
            Save Conversion
          </button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/60 p-6 dark:border-slate-800 dark:bg-slate-900/60">
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Base time zone
            <select
              value={baseZone}
              onChange={(event) => {
                setBaseZone(event.target.value);
                setBaseDateTime((prev) => prev.setZone(event.target.value));
              }}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
            >
              {timezones.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Date & time
            <input
              type="datetime-local"
              value={formattedBaseValue}
              onChange={(event) => handleBaseDateChange(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
            />
          </label>
          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300">
            <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Current local time
            </p>
            <p className="mt-1 text-lg font-semibold text-primary-600 dark:text-primary-300">
              {DateTime.now().setZone(baseZone).toFormat("ccc, dd LLL yyyy · HH:mm")}
            </p>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/60 p-6 dark:border-slate-800 dark:bg-slate-900/60">
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Target time zone
            <select
              value={targetZone}
              onChange={(event) => setTargetZone(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
            >
              {timezones.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </label>
          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300">
            <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Converted time</p>
            <p className="mt-1 text-2xl font-semibold text-primary-600 dark:text-primary-300">
              {formattedTargetValue}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Offset {targetDateTime.offsetNameShort} (UTC{targetDateTime.toFormat("ZZ")})
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4 text-xs leading-5 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
            <p className="font-semibold text-slate-700 dark:text-slate-200">Quick compare</p>
            <p className="mt-2">
              {baseDateTime.toFormat("ccc HH:mm")} {baseZone} = {targetDateTime.toFormat("ccc HH:mm")} {targetZone}
            </p>
          </div>
        </div>
      </div>

      {isError && (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-5 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-900/70">
          Unable to load time zones from the API. Showing a curated list instead. Refresh when back
          online for the full directory.
        </p>
      )}
    </section>
  );
};

export default TimeZoneConverter;

