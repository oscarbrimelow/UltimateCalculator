import { lazy } from "react";
import {
  Activity,
  Beaker,
  Calculator,
  Coins,
  Database,
  FlaskConical,
  FunctionSquare,
  Gauge,
  Globe2,
  GraduationCap,
  LineChart,
  Ruler,
  Scale,
  Sun,
  TimerReset,
  TrendingUp,
  UtensilsCrossed
} from "lucide-react";
import type { CalculatorConfig } from "../types/calculator";

export const calculators: CalculatorConfig[] = [
  {
    id: "basic-math",
    name: "Standard Calculator",
    tagline: "Quick arithmetic for everyday math.",
    description: "Addition, subtraction, multiplication, and division with live results and history tracking.",
    category: "math",
    icon: Calculator,
    keywords: ["add", "subtract", "multiply", "divide", "arithmetic"],
    component: lazy(() => import("../features/math/BasicCalculator")),
    featured: true
  },
  {
    id: "scientific-math",
    name: "Scientific Calculator",
    tagline: "Trigonometry, logs, powers, and factorials.",
    description: "Advanced scientific functions with keyboard support and quick constants.",
    category: "math",
    icon: FunctionSquare,
    keywords: ["sin", "cos", "tan", "log", "factorial"],
    component: lazy(() => import("../features/math/ScientificCalculator"))
  },
  {
    id: "equation-solver",
    name: "Equation Solver",
    tagline: "Solve linear and quadratic equations instantly.",
    description: "Supports ax + b = 0 and ax² + bx + c = 0 with discriminant insights.",
    category: "math",
    icon: LineChart,
    keywords: ["linear", "quadratic", "equation", "roots"],
    component: lazy(() => import("../features/math/EquationSolver"))
  },
  {
    id: "graphing-calculator",
    name: "Graphing Calculator",
    tagline: "Plot equations with interactive charts.",
    description: "Visualize expressions with support for multi-line plotting using Chart.js.",
    category: "math",
    icon: Scale,
    keywords: ["graph", "plot", "chart", "visual"],
    component: lazy(() => import("../features/math/GraphingCalculator"))
  },
  {
    id: "loan-calculator",
    name: "Loan & Mortgage",
    tagline: "Understand monthly payments and amortization.",
    description: "Break down principal, interest, and amortization schedules with live charts.",
    category: "finance",
    icon: Coins,
    keywords: ["loan", "mortgage", "amortization", "finance"],
    component: lazy(() => import("../features/finance/LoanCalculator")),
    featured: true
  },
  {
    id: "compound-interest",
    name: "Compound Interest",
    tagline: "Plan investments with compounding returns.",
    description: "Calculate future value with different contribution frequencies.",
    category: "finance",
    icon: TrendingUp,
    keywords: ["interest", "investment", "future value", "finance"],
    component: lazy(() => import("../features/finance/CompoundInterestCalculator"))
  },
  {
    id: "currency-converter",
    name: "Currency Converter",
    tagline: "Live exchange rates refreshed every few minutes.",
    description: "Supports more than 30 currencies with offline fallback and favorites.",
    category: "finance",
    icon: Gauge,
    keywords: ["currency", "exchange", "fx", "rates"],
    component: lazy(() => import("../features/finance/CurrencyConverter")),
    featured: true
  },
  {
    id: "unit-converter",
    name: "Unit Converter",
    tagline: "Convert length, area, volume, weight, and temperature.",
    description: "All-in-one converter with auto-detected categories and keyboard-friendly inputs.",
    category: "converters",
    icon: Ruler,
    keywords: ["length", "weight", "temperature", "volume", "area"],
    component: lazy(() => import("../features/converters/UnitConverter")),
    featured: true
  },
  {
    id: "time-zone",
    name: "Time Zone Converter",
    tagline: "Compare times across the globe.",
    description: "Fetches time zones from WorldTime API and caches results for offline usage.",
    category: "converters",
    icon: Globe2,
    keywords: ["time", "zone", "worldtime", "meeting"],
    component: lazy(() => import("../features/converters/TimeZoneConverter"))
  },
  {
    id: "data-converter",
    name: "Data Converter",
    tagline: "Convert bytes, KB, MB, GB, and TB effortlessly.",
    description: "Perfect for storage planning and quick tech conversions.",
    category: "converters",
    icon: Database,
    keywords: ["data", "storage", "bytes", "kilobytes"],
    component: lazy(() => import("../features/converters/DataConverter"))
  },
  {
    id: "bmi-calculator",
    name: "BMI Calculator",
    tagline: "Track body mass index with healthy ranges.",
    description: "Supports metric and imperial units with interpretive insights.",
    category: "health",
    icon: Activity,
    keywords: ["health", "fitness", "bmi", "body mass index"],
    component: lazy(() => import("../features/health/BMICalculator")),
    featured: true
  },
  {
    id: "physics-calculator",
    name: "Physics Toolbox",
    tagline: "Force, energy, momentum, and pressure.",
    description: "Compute popular physics formulas with contextual explanations.",
    category: "science",
    icon: FlaskConical,
    keywords: ["physics", "force", "energy", "pressure"],
    component: lazy(() => import("../features/science/PhysicsCalculator"))
  },
  {
    id: "chemistry-molar-mass",
    name: "Molar Mass Calculator",
    tagline: "Compute molar mass from chemical formulas.",
    description: "Parse chemical formulas with subscripts and provide step-by-step breakdowns.",
    category: "science",
    icon: Beaker,
    keywords: ["chemistry", "molar mass", "formula"],
    component: lazy(() => import("../features/science/ChemistryMolarMassCalculator"))
  },
  {
    id: "ohms-law",
    name: "Ohm’s Law",
    tagline: "Relate voltage, current, and resistance instantly.",
    description: "Enter any two variables to solve for the third, with power calculations included.",
    category: "science",
    icon: Sun,
    keywords: ["electricity", "ohms law", "voltage", "current", "resistance"],
    component: lazy(() => import("../features/science/OhmsLawCalculator"))
  },
  {
    id: "date-age",
    name: "Date & Age Calculator",
    tagline: "Compute ages, countdowns, and durations.",
    description: "Supports time zones and natural-language summaries for events.",
    category: "others",
    icon: TimerReset,
    keywords: ["date", "age", "duration", "days"],
    component: lazy(() => import("../features/others/DateAgeCalculator"))
  },
  {
    id: "tip-calculator",
    name: "Tip Calculator",
    tagline: "Split checks and tips effortlessly.",
    description: "Live bill splitting with tip presets and rounding options.",
    category: "others",
    icon: UtensilsCrossed,
    keywords: ["tip", "restaurant", "bill", "split"],
    component: lazy(() => import("../features/others/TipCalculator"))
  },
  {
    id: "gpa-calculator",
    name: "GPA Calculator",
    tagline: "Track GPA across semesters.",
    description: "Weighted GPA calculator with course summaries and export options.",
    category: "others",
    icon: GraduationCap,
    keywords: ["gpa", "grades", "school", "semester"],
    component: lazy(() => import("../features/others/GPACalculator"))
  },
  {
    id: "cooking-converter",
    name: "Cooking Converter",
    tagline: "Cups, tablespoons, grams, and ounces.",
    description: "Convert recipe measurements between metric and imperial effortlessly.",
    category: "others",
    icon: UtensilsCrossed,
    keywords: ["cooking", "kitchen", "recipe", "measure"],
    component: lazy(() => import("../features/others/CookingConverter"))
  }
];

