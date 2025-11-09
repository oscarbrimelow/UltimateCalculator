import { useMemo, useState } from "react";
import { Save } from "lucide-react";
import { useHistoryLogger } from "../../hooks/useHistoryLogger";

type UnitDefinition = {
  id: string;
  label: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
};

type UnitCategory = {
  id: string;
  name: string;
  units: UnitDefinition[];
};

const unitCategories: UnitCategory[] = [
  {
    id: "length",
    name: "Length",
    units: [
      { id: "m", label: "Meters", toBase: (value) => value, fromBase: (value) => value },
      { id: "km", label: "Kilometers", toBase: (value) => value * 1000, fromBase: (value) => value / 1000 },
      { id: "cm", label: "Centimeters", toBase: (value) => value / 100, fromBase: (value) => value * 100 },
      { id: "mm", label: "Millimeters", toBase: (value) => value / 1000, fromBase: (value) => value * 1000 },
      { id: "mi", label: "Miles", toBase: (value) => value * 1609.34, fromBase: (value) => value / 1609.34 },
      { id: "ft", label: "Feet", toBase: (value) => value * 0.3048, fromBase: (value) => value / 0.3048 },
      { id: "in", label: "Inches", toBase: (value) => value * 0.0254, fromBase: (value) => value / 0.0254 }
    ]
  },
  {
    id: "weight",
    name: "Weight",
    units: [
      { id: "kg", label: "Kilograms", toBase: (value) => value, fromBase: (value) => value },
      { id: "g", label: "Grams", toBase: (value) => value / 1000, fromBase: (value) => value * 1000 },
      { id: "lb", label: "Pounds", toBase: (value) => value * 0.453592, fromBase: (value) => value / 0.453592 },
      { id: "oz", label: "Ounces", toBase: (value) => value * 0.0283495, fromBase: (value) => value / 0.0283495 },
      { id: "st", label: "Stone", toBase: (value) => value * 6.35029, fromBase: (value) => value / 6.35029 }
    ]
  },
  {
    id: "area",
    name: "Area",
    units: [
      { id: "sqm", label: "Square meters", toBase: (value) => value, fromBase: (value) => value },
      { id: "sqkm", label: "Square kilometers", toBase: (value) => value * 1_000_000, fromBase: (value) => value / 1_000_000 },
      { id: "sqft", label: "Square feet", toBase: (value) => value * 0.092903, fromBase: (value) => value / 0.092903 },
      { id: "acre", label: "Acres", toBase: (value) => value * 4046.86, fromBase: (value) => value / 4046.86 },
      { id: "hectare", label: "Hectares", toBase: (value) => value * 10_000, fromBase: (value) => value / 10_000 }
    ]
  },
  {
    id: "volume",
    name: "Volume",
    units: [
      { id: "l", label: "Liters", toBase: (value) => value, fromBase: (value) => value },
      { id: "ml", label: "Milliliters", toBase: (value) => value / 1000, fromBase: (value) => value * 1000 },
      { id: "gal", label: "Gallons (US)", toBase: (value) => value * 3.78541, fromBase: (value) => value / 3.78541 },
      { id: "qt", label: "Quarts", toBase: (value) => value * 0.946353, fromBase: (value) => value / 0.946353 },
      { id: "cup", label: "Cups (US)", toBase: (value) => value * 0.236588, fromBase: (value) => value / 0.236588 }
    ]
  },
  {
    id: "temperature",
    name: "Temperature",
    units: [
      {
        id: "c",
        label: "Celsius",
        toBase: (value) => value,
        fromBase: (value) => value
      },
      {
        id: "f",
        label: "Fahrenheit",
        toBase: (value) => ((value - 32) * 5) / 9,
        fromBase: (value) => value * (9 / 5) + 32
      },
      {
        id: "k",
        label: "Kelvin",
        toBase: (value) => value - 273.15,
        fromBase: (value) => value + 273.15
      }
    ]
  }
];

const UnitConverter = () => {
  const [categoryId, setCategoryId] = useState(unitCategories[0].id);
  const [fromUnitId, setFromUnitId] = useState(unitCategories[0].units[0].id);
  const [toUnitId, setToUnitId] = useState(unitCategories[0].units[1].id);
  const [amount, setAmount] = useState(1);
  const historyLogger = useHistoryLogger();

  const category = useMemo(
    () => unitCategories.find((item) => item.id === categoryId) ?? unitCategories[0],
    [categoryId]
  );

  const fromUnit = category.units.find((unit) => unit.id === fromUnitId) ?? category.units[0];
  const toUnit = category.units.find((unit) => unit.id === toUnitId) ?? category.units[1] ?? category.units[0];

  const converted = useMemo(() => {
    const baseValue = fromUnit.toBase(amount);
    return toUnit.fromBase(baseValue);
  }, [amount, fromUnit, toUnit]);

  const handleCategoryChange = (nextCategory: string) => {
    const next = unitCategories.find((item) => item.id === nextCategory);
    if (!next) return;
    setCategoryId(nextCategory);
    setFromUnitId(next.units[0].id);
    setToUnitId(next.units[1]?.id ?? next.units[0].id);
  };

  const handleSave = () => {
    historyLogger(
      "unit-converter",
      "Unit Converter",
      `${amount} ${fromUnit.label} = ${converted.toPrecision(6)} ${toUnit.label}`,
      { category: category.name, from: fromUnit.id, to: toUnit.id, amount, result: converted }
    );
  };

  return (
    <section className="space-y-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Universal Unit Converter</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Convert between length, weight, area, volume, and temperature instantly.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary-700"
        >
          <Save className="h-4 w-4" />
          Save Conversion
        </button>
      </header>

      <div className="flex flex-wrap gap-3">
        {unitCategories.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleCategoryChange(item.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              item.id === categoryId
                ? "bg-primary-600 text-white shadow"
                : "bg-slate-100 text-slate-600 hover:bg-primary-100 hover:text-primary-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-primary-900/40 dark:hover:text-primary-200"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          From
          <div className="mt-2 flex items-center gap-3">
            <input
              type="number"
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
            />
            <select
              value={fromUnitId}
              onChange={(event) => setFromUnitId(event.target.value)}
              className="w-40 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
            >
              {category.units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>
        </label>

        <label className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          To
          <div className="mt-2 flex items-center gap-3">
            <input
              type="text"
              readOnly
              value={converted.toPrecision(6)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-primary-600 dark:border-slate-700 dark:bg-slate-900 dark:text-primary-200"
            />
            <select
              value={toUnitId}
              onChange={(event) => setToUnitId(event.target.value)}
              className="w-40 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
            >
              {category.units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>
        </label>
      </div>
    </section>
  );
};

export default UnitConverter;

