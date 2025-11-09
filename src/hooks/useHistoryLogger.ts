import { useCallback } from "react";
import { useHistoryStore } from "../store/historyStore";

export const useHistoryLogger = () => {
  const addEntry = useHistoryStore((state) => state.addEntry);

  return useCallback(
    (calculatorId: string, calculatorName: string, summary: string, data: Record<string, unknown>) => {
      addEntry({ calculatorId, calculatorName, summary, data });
    },
    [addEntry]
  );
};

