import type React from "react";
import type { Icon } from "lucide-react";

export type CategoryId = "math" | "finance" | "converters" | "science" | "health" | "others";

export type CalculatorConfig = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: CategoryId;
  icon: Icon;
  keywords: string[];
  component: React.LazyExoticComponent<React.ComponentType>;
  featured?: boolean;
};

export type CategoryDefinition = {
  id: CategoryId;
  name: string;
  description: string;
};

export type HistoryEntry = {
  id: string;
  calculatorId: string;
  calculatorName: string;
  summary: string;
  data: Record<string, unknown>;
  timestamp: number;
};

