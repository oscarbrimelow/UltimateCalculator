import { useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

const STORAGE_KEY = "ultimatecalc-currency-rates";

type RatesResponse = {
  success: boolean;
  base: string;
  date: string;
  rates: Record<string, number>;
};

const fetchRates = async (base: string): Promise<RatesResponse> => {
  const response = await fetch(`https://api.exchangerate.host/latest?base=${base}`);
  if (!response.ok) {
    throw new Error("Failed to fetch rates");
  }
  return response.json();
};

export const useCurrencyRates = (base: string) => {
  const query = useQuery({
    queryKey: ["currency-rates", base],
    queryFn: () => fetchRates(base),
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5
  });

  const persistRates = useCallback(
    (data: RatesResponse) => {
    if (typeof window === "undefined" || !data?.rates) return;
    if (typeof window === "undefined") return undefined;
    const existing = localStorage.getItem(STORAGE_KEY);
      const parsed = existing ? JSON.parse(existing) : {};
      parsed[base] = { timestamp: Date.now(), data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    },
    [base]
  );

  useEffect(() => {
    if (query.data) {
      persistRates(query.data);
    }
  }, [query.data, persistRates]);

  const getFallbackRates = useCallback(() => {
    const existing = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (!existing) return undefined;
    try {
      const parsed = JSON.parse(existing);
      return parsed[base]?.data as RatesResponse | undefined;
    } catch (error) {
      return undefined;
    }
  }, [base]);

  const data = query.data ?? getFallbackRates();

  return {
    ...query,
    data,
    isOffline: query.isError && !!getFallbackRates(),
    error: query.isError && !getFallbackRates() ? query.error : null
  };
};

