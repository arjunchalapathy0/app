"use client";

interface NumberFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  max: number;
  prefix?: string;
  hint?: string;
}

export function NumberField({ id, label, value, onChange, max, prefix, hint }: NumberFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-slate-800">
        {label}
      </label>
      <div className="relative mt-2">
        {prefix && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-lg text-slate-500"
          >
            {prefix}
          </span>
        )}
        <input
          id={id}
          name={id}
          type="number"
          inputMode="numeric"
          min={0}
          max={max}
          step={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-describedby={hintId}
          className={`block w-full rounded-xl border border-slate-300 bg-white py-3 pr-4 text-lg font-semibold text-slate-900 shadow-sm focus:border-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 ${prefix ? "pl-9" : "pl-4"}`}
        />
      </div>
      {hint && (
        <p id={hintId} className="mt-1 text-xs text-slate-600">
          {hint}
        </p>
      )}
    </div>
  );
}
