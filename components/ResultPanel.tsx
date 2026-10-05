"use client";

import { formatCurrency } from "@/lib/calculator";
import { useAnimatedNumber } from "@/lib/useAnimatedNumber";

interface ResultPanelProps {
  monthlyLoss: number;
  yearlyLoss: number;
}

export function ResultPanel({ monthlyLoss, yearlyLoss }: ResultPanelProps) {
  const animatedMonthly = useAnimatedNumber(monthlyLoss);
  const animatedYearly = useAnimatedNumber(yearlyLoss);

  return (
    <div className="flex h-full flex-col justify-center rounded-2xl bg-blue-700 p-6 text-white sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">
        You&apos;re losing about
      </p>
      <p
        key={monthlyLoss}
        className="result-pop mt-2 text-5xl font-extrabold tabular-nums leading-none sm:text-6xl"
        aria-hidden="true"
      >
        {formatCurrency(animatedMonthly)}
      </p>
      <p className="mt-2 text-lg font-medium text-blue-50">per month</p>

      <div className="mt-6 border-t border-blue-500/60 pt-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">
          That&apos;s every year
        </p>
        <p className="mt-2 text-3xl font-bold tabular-nums sm:text-4xl" aria-hidden="true">
          {formatCurrency(animatedYearly)}
        </p>
      </div>

      {/* Screen readers get the settled values once, not every animation frame. */}
      <p className="sr-only" aria-live="polite">
        Estimated lost revenue: {formatCurrency(monthlyLoss)} per month,{" "}
        {formatCurrency(yearlyLoss)} per year.
      </p>
    </div>
  );
}
