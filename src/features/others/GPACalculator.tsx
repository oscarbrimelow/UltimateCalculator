import { useMemo, useState } from "react";
import { PlusCircle, Save, Trash2 } from "lucide-react";
import { useHistoryLogger } from "../../hooks/useHistoryLogger";

type Course = {
  id: string;
  name: string;
  credits: number;
  grade: GradeKey;
};

type GradeKey = keyof typeof gradeScale;

const gradeScale = {
  A: 4,
  "A-": 3.7,
  "B+": 3.3,
  B: 3,
  "B-": 2.7,
  "C+": 2.3,
  C: 2,
  "C-": 1.7,
  "D+": 1.3,
  D: 1,
  F: 0
} as const;

const createCourse = (): Course => ({
  id: Math.random().toString(36).slice(2),
  name: "",
  credits: 3,
  grade: "A"
});

const GPACalculator = () => {
  const [courses, setCourses] = useState<Course[]>([createCourse(), createCourse()]);
  const historyLogger = useHistoryLogger();

  const summary = useMemo(() => {
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    const totalPoints = courses.reduce(
      (sum, course) => sum + course.credits * gradeScale[course.grade],
      0
    );
    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    return {
      totalCredits,
      totalPoints,
      gpa
    };
  }, [courses]);

  const updateCourse = (id: string, updates: Partial<Course>) => {
    setCourses((prev) =>
      prev.map((course) => (course.id === id ? { ...course, ...updates } : course))
    );
  };

  const removeCourse = (id: string) => {
    setCourses((prev) => (prev.length > 1 ? prev.filter((course) => course.id !== id) : prev));
  };

  const addCourse = () => {
    setCourses((prev) => [...prev, createCourse()]);
  };

  const handleSave = () => {
    historyLogger(
      "gpa-calculator",
      "GPA Calculator",
      `GPA ${summary.gpa.toFixed(2)} across ${summary.totalCredits} credits`,
      { courses, summary }
    );
  };

  return (
    <section className="space-y-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">GPA Calculator</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track course grades and compute weighted GPA instantly.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={addCourse}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm hover:border-primary-300 hover:text-primary-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-primary-500 dark:hover:text-primary-200"
          >
            <PlusCircle className="h-4 w-4" />
            Add course
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary-700"
          >
            <Save className="h-4 w-4" />
            Save Summary
          </button>
        </div>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:text-slate-400">
          Courses
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {courses.map((course) => (
            <div key={course.id} className="flex flex-wrap items-center gap-4 px-6 py-4">
              <input
                type="text"
                value={course.name}
                onChange={(event) => updateCourse(course.id, { name: event.target.value })}
                placeholder="Course name"
                className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
              />
              <input
                type="number"
                value={course.credits}
                min={0}
                step={0.5}
                onChange={(event) => updateCourse(course.id, { credits: Number(event.target.value) })}
                className="w-24 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
              />
              <select
                value={course.grade}
                onChange={(event) => updateCourse(course.id, { grade: event.target.value as GradeKey })}
                className="w-28 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
              >
                {Object.keys(gradeScale).map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => removeCourse(course.id)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:border-red-300 hover:text-red-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-red-500 dark:hover:text-red-400"
                aria-label="Remove course"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600 shadow-inner dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Credits</p>
            <p className="mt-2 text-2xl font-semibold text-slate-800 dark:text-slate-100">
              {summary.totalCredits.toFixed(1)}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Quality points</p>
            <p className="mt-2 text-xl font-semibold text-slate-800 dark:text-slate-100">
              {summary.totalPoints.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Weighted GPA</p>
            <p className="mt-2 text-3xl font-semibold text-primary-600 dark:text-primary-300">
              {summary.gpa.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GPACalculator;

