import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { formatRelative } from "../../utils/formatRelative";
import { useHistoryStore } from "../../store/historyStore";
import { Trash2 } from "lucide-react";

type HistoryPanelProps = {
  open: boolean;
  onClose: () => void;
};

export const HistoryPanel = ({ open, onClose }: HistoryPanelProps) => {
  const { entries, clear, removeEntry } = useHistoryStore((state) => ({
    entries: state.entries,
    clear: state.clear,
    removeEntry: state.removeEntry
  }));

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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

        <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
              <div className="flex h-full flex-col overflow-hidden border-l border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800">
                  <Dialog.Title className="text-base font-semibold leading-6 text-slate-900 dark:text-slate-100">
                    Recent Calculations
                  </Dialog.Title>
                  {entries.length > 0 && (
                    <button
                      type="button"
                      onClick={clear}
                      className="inline-flex items-center gap-1 rounded-full border border-transparent bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin">
                  {entries.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900">
                      No history yet. Your recent calculations will appear here, even when you come back
                      later.
                    </p>
                  ) : (
                    <ul className="space-y-4">
                      {entries.map((entry) => (
                        <li
                          key={entry.id}
                          className="group rounded-xl border border-slate-200/70 bg-white p-4 shadow-sm transition hover:border-primary-300/80 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-primary-500/60"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                {entry.calculatorName}
                              </p>
                              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                {formatRelative(entry.timestamp)}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeEntry(entry.id)}
                              className="opacity-0 transition group-hover:opacity-100"
                              aria-label="Remove entry"
                            >
                              <Trash2 className="h-4 w-4 text-slate-400 hover:text-red-500" />
                            </button>
                          </div>
                          <p className="mt-3 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {entry.summary}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

