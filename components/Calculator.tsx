"use client";

import { useState } from "react";
import {
  CALCULATOR_DEFAULTS,
  CALCULATOR_LIMITS,
  calculateLoss,
  toSafeNumber,
  type CalculatorInputs,
} from "@/lib/calculator";
import { TRADE } from "@/lib/config";
import { LeadForm } from "./LeadForm";
import { NumberField } from "./NumberField";
import { ResultPanel } from "./ResultPanel";
import { SliderField } from "./SliderField";

function clampedNumber(raw: string, max: number): number {
  return Math.min(toSafeNumber(raw), max);
}

export function Calculator() {
  // Number inputs are kept as strings so the user can clear a field while typing.
  const [callsPerWeek, setCallsPerWeek] = useState(String(CALCULATOR_DEFAULTS.callsPerWeek));
  const [jobValue, setJobValue] = useState(String(CALCULATOR_DEFAULTS.jobValue));
  const [missRate, setMissRate] = useState<number>(CALCULATOR_DEFAULTS.missRate);
  const [bookingRate, setBookingRate] = useState<number>(CALCULATOR_DEFAULTS.bookingRate);

  const inputs: CalculatorInputs = {
    callsPerWeek: clampedNumber(callsPerWeek, CALCULATOR_LIMITS.callsPerWeek.max),
    missRate,
    jobValue: clampedNumber(jobValue, CALCULATOR_LIMITS.jobValue.max),
    bookingRate,
  };
  const { monthlyLoss, yearlyLoss } = calculateLoss(inputs);

  return (
    <div className="space-y-6 sm:space-y-8">
      <section
        aria-labelledby="calculator-title"
        className="rounded-3xl bg-white p-4 shadow-xl shadow-slate-200/70 ring-1 ring-slate-200 sm:p-6"
      >
        <h2 id="calculator-title" className="sr-only">
          Missed call cost calculator
        </h2>
        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          <div className="space-y-7 p-2">
            <NumberField
              id="calls-per-week"
              label="Calls received per week"
              value={callsPerWeek}
              onChange={setCallsPerWeek}
              max={CALCULATOR_LIMITS.callsPerWeek.max}
            />
            <SliderField
              id="miss-rate"
              label="% of calls you miss"
              value={missRate}
              onChange={setMissRate}
              min={CALCULATOR_LIMITS.missRate.min}
              max={CALCULATOR_LIMITS.missRate.max}
            />
            <NumberField
              id="job-value"
              label="Average job value"
              prefix="$"
              value={jobValue}
              onChange={setJobValue}
              max={CALCULATOR_LIMITS.jobValue.max}
              hint={`What a typical customer spends with your ${TRADE}.`}
            />
            <SliderField
              id="booking-rate"
              label="% of missed callers who would have booked"
              value={bookingRate}
              onChange={setBookingRate}
              min={CALCULATOR_LIMITS.bookingRate.min}
              max={CALCULATOR_LIMITS.bookingRate.max}
            />
          </div>
          <ResultPanel monthlyLoss={monthlyLoss} yearlyLoss={yearlyLoss} />
        </div>
      </section>

      <section className="relative rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/70 ring-1 ring-slate-200 sm:p-8">
        <LeadForm calculatorValues={inputs} />
      </section>
    </div>
  );
}
