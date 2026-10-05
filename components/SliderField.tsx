"use client";

interface SliderFieldProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
}

export function SliderField({ id, label, value, onChange, min, max }: SliderFieldProps) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-sm font-semibold text-slate-800">
          {label}
        </label>
        <output htmlFor={id} className="text-lg font-bold tabular-nums text-blue-700">
          {value}%
        </output>
      </div>
      <input
        id={id}
        name={id}
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={`${value}%`}
        className="mt-3 h-2 w-full cursor-pointer accent-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 rounded-full"
      />
      <div className="mt-1 flex justify-between text-xs text-slate-600" aria-hidden="true">
        <span>{min}%</span>
        <span>{max}%</span>
      </div>
    </div>
  );
}
