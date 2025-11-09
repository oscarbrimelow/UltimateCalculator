import { useMemo, useState } from "react";
import { Save } from "lucide-react";
import { useHistoryLogger } from "../../hooks/useHistoryLogger";

type Ingredient = {
  id: string;
  label: string;
  density: number; // grams per milliliter
};

const ingredients: Ingredient[] = [
  { id: "water", label: "Water", density: 1 },
  { id: "milk", label: "Milk", density: 1.03 },
  { id: "flour", label: "All-purpose flour", density: 0.53 },
  { id: "sugar", label: "Granulated sugar", density: 0.85 },
  { id: "butter", label: "Butter", density: 0.96 }
];

const volumeUnits = [
  { id: "cup", label: "Cups", ml: 240 },
  { id: "tbsp", label: "Tablespoons", ml: 15 },
  { id: "tsp", label: "Teaspoons", ml: 5 },
  { id: "ml", label: "Milliliters", ml: 1 }
];

const weightUnits = [
  { id: "g", label: "Grams", grams: 1 },
  { id: "oz", label: "Ounces", grams: 28.3495 },
  { id: "lb", label: "Pounds", grams: 453.592 }
];

const CookingConverter = () => {
  const [ingredientId, setIngredientId] = useState(ingredients[0].id);
  const [fromUnit, setFromUnit] = useState(volumeUnits[0].id);
  const [toUnit, setToUnit] = useState(weightUnits[0].id);
  const [amount, setAmount] = useState(1);
  const historyLogger = useHistoryLogger();

  const ingredient = useMemo(
    () => ingredients.find((item) => item.id === ingredientId) ?? ingredients[0],
    [ingredientId]
  );

  const volumeUnit = volumeUnits.find((unit) => unit.id === fromUnit) ?? volumeUnits[0];
  const weightUnit = weightUnits.find((unit) => unit.id === toUnit) ?? weightUnits[0];

  const result = useMemo(() => {
    const volumeMl = amount * volumeUnit.ml;
    const weightGrams = volumeMl * ingredient.density;
    return weightGrams / weightUnit.grams;
  }, [amount, volumeUnit, weightUnit, ingredient]);

  const handleSave = () => {
    historyLogger(
      "cooking-converter",
      "Cooking Converter",
      `${amount} ${volumeUnit.label} (${ingredient.label}) = ${result.toFixed(2)} ${weightUnit.label}`,
      { ingredient: ingredient.label, amount, fromUnit, toUnit, result }
    );
  };

  return (
    <section className="space-y-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Cooking Converter</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Convert between cups, spoons, grams, and ounces with ingredient-aware precision.
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

      <label className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Ingredient
        <select
          value={ingredientId}
          onChange={(event) => setIngredientId(event.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
        >
          {ingredients.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          From
          <div className="mt-2 flex items-center gap-3">
            <input
              type="number"
              value={amount}
              min={0}
              step={0.25}
              onChange={(event) => setAmount(Number(event.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
            />
            <select
              value={fromUnit}
              onChange={(event) => setFromUnit(event.target.value)}
              className="w-40 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
            >
              {volumeUnits.map((unit) => (
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
              value={`${result.toFixed(2)} ${weightUnit.label}`}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-primary-600 dark:border-slate-700 dark:bg-slate-900 dark:text-primary-200"
            />
            <select
              value={toUnit}
              onChange={(event) => setToUnit(event.target.value)}
              className="w-40 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
            >
              {weightUnits.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>
        </label>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        Conversion assumes density in grams per milliliter. Adjust ingredient selection for best results.
      </p>
    </section>
  );
};

export default CookingConverter;

