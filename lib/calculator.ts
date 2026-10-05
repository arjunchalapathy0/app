export const WEEKS_PER_MONTH = 4.3;

export const CALCULATOR_LIMITS = {
  callsPerWeek: { min: 0, max: 10_000 },
  missRate: { min: 5, max: 60 },
  jobValue: { min: 0, max: 1_000_000 },
  bookingRate: { min: 10, max: 60 },
} as const;

export const CALCULATOR_DEFAULTS = {
  callsPerWeek: 40,
  missRate: 25,
  jobValue: 400,
  bookingRate: 30,
} as const;

export interface CalculatorInputs {
  callsPerWeek: number;
  missRate: number;
  jobValue: number;
  bookingRate: number;
}

export interface CalculatorResult {
  monthlyLoss: number;
  yearlyLoss: number;
}

/** Converts any user-entered value to a finite, non-negative number (invalid -> 0). */
export function toSafeNumber(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number.parseFloat(String(value ?? ""));
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return parsed;
}

export function calculateLoss(inputs: CalculatorInputs): CalculatorResult {
  const callsPerWeek = toSafeNumber(inputs.callsPerWeek);
  const missRate = toSafeNumber(inputs.missRate);
  const jobValue = toSafeNumber(inputs.jobValue);
  const bookingRate = toSafeNumber(inputs.bookingRate);

  const monthly =
    callsPerWeek * WEEKS_PER_MONTH * (missRate / 100) * (bookingRate / 100) * jobValue;

  // Yearly is derived from the unrounded monthly figure to avoid compounding rounding error.
  return {
    monthlyLoss: Math.round(monthly),
    yearlyLoss: Math.round(monthly * 12),
  };
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(Math.round(amount));
}
