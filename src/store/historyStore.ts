import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { HistoryEntry } from "../types/calculator";

type HistoryState = {
  entries: HistoryEntry[];
  addEntry: (entry: Omit<HistoryEntry, "id" | "timestamp"> & { id?: string }) => void;
  clear: () => void;
  removeEntry: (id: string) => void;
};

const MAX_ENTRIES = 100;

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      entries: [],
      addEntry: (entry) => {
        const id =
          entry.id ??
          (typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : Math.random().toString(36).slice(2));
        const timestamp = Date.now();
        const nextEntries = [{ ...entry, id, timestamp }, ...get().entries].slice(0, MAX_ENTRIES);
        set({ entries: nextEntries });
      },
      clear: () => set({ entries: [] }),
      removeEntry: (id) => set({ entries: get().entries.filter((entry) => entry.id !== id) })
    }),
    {
      name: "ultimatecalc-history"
    }
  )
);

