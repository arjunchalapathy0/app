"use client";

import { useState, type FormEvent } from "react";
import { copy } from "@/lib/config";
import type { CalculatorInputs } from "@/lib/calculator";
import {
  contactSchema,
  fieldErrorsFrom,
  type ContactField,
  type ContactInput,
  type LeadRequest,
} from "@/lib/leadSchema";

type FieldErrors = Partial<Record<ContactField, string>>;
type Status = "idle" | "submitting" | "success";

interface LeadFormProps {
  calculatorValues: CalculatorInputs;
}

const EMPTY_CONTACT: ContactInput = { businessName: "", phone: "", email: "" };

function messageForStatus(status: number): string {
  if (status === 503) {
    return "Thanks for your interest! Our sign-up system isn't connected yet, so we couldn't save your details. Please try again later.";
  }
  if (status === 429) return "Too many attempts. Please wait a few minutes and try again.";
  return "Something went wrong on our end. Please try again in a moment.";
}

export function LeadForm({ calculatorValues }: LeadFormProps) {
  const [contact, setContact] = useState<ContactInput>(EMPTY_CONTACT);
  const [honeypot, setHoneypot] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  function updateField(field: ContactField, value: string) {
    const next = { ...contact, [field]: value };
    setContact(next);
    // Once a field shows an error, re-check it live so the error clears as soon as it's fixed.
    if (fieldErrors[field]) {
      const result = contactSchema.safeParse(next);
      const errors = result.success ? {} : fieldErrorsFrom(result.error);
      setFieldErrors((prev) => ({ ...prev, [field]: errors[field] }));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const result = contactSchema.safeParse(contact);
    if (!result.success) {
      const errors = fieldErrorsFrom(result.error);
      setFieldErrors(errors);
      const firstInvalid = (Object.keys(errors) as ContactField[])[0];
      if (firstInvalid) document.getElementById(`lead-${firstInvalid}`)?.focus();
      return;
    }
    setFieldErrors({});
    setStatus("submitting");

    const payload: LeadRequest = {
      ...result.data,
      calculator: calculatorValues,
      website: honeypot,
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStatus("success");
        return;
      }

      const body: unknown = await response.json().catch(() => null);
      if (response.status === 400 && body && typeof body === "object" && "fieldErrors" in body) {
        setFieldErrors((body as { fieldErrors: FieldErrors }).fieldErrors);
        setFormError("Please fix the highlighted fields.");
      } else {
        setFormError(messageForStatus(response.status));
      }
    } catch {
      setFormError("We couldn't reach the server. Check your connection and try again.");
    }
    setStatus("idle");
  }

  if (status === "success") {
    return (
      <div role="status" className="text-center">
        <div
          aria-hidden="true"
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-2xl text-blue-700"
        >
          ✓
        </div>
        <h2 className="mt-4 text-2xl font-bold text-slate-900">{copy.thankYouTitle}</h2>
        <p className="mt-2 text-slate-700">{copy.thankYouBody}</p>
      </div>
    );
  }

  const isSubmitting = status === "submitting";

  return (
    <form onSubmit={handleSubmit} noValidate aria-labelledby="lead-form-title">
      <h2 id="lead-form-title" className="text-2xl font-bold text-slate-900">
        {copy.formTitle}
      </h2>
      <p className="mt-2 text-slate-700">{copy.formSubtext}</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <TextField
          field="businessName"
          label="Business name"
          autoComplete="organization"
          value={contact.businessName}
          error={fieldErrors.businessName}
          onChange={updateField}
          className="sm:col-span-2"
        />
        <TextField
          field="email"
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={contact.email}
          error={fieldErrors.email}
          onChange={updateField}
        />
        <TextField
          field="phone"
          label="Phone"
          type="tel"
          autoComplete="tel"
          hint="Optional"
          value={contact.phone}
          error={fieldErrors.phone}
          onChange={updateField}
        />
      </div>

      {/* Honeypot: off-screen and skipped by keyboard and screen readers, so only bots fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="lead-website">Website</label>
        <input
          id="lead-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {formError && (
        <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full rounded-xl bg-blue-700 px-6 py-4 text-lg font-bold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
      >
        {isSubmitting ? "Sending…" : copy.formButton}
      </button>
    </form>
  );
}

interface TextFieldProps {
  field: ContactField;
  label: string;
  value: string;
  onChange: (field: ContactField, value: string) => void;
  error?: string;
  type?: "text" | "email" | "tel";
  autoComplete?: string;
  required?: boolean;
  hint?: string;
  className?: string;
}

function TextField({
  field,
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  required,
  hint,
  className,
}: TextFieldProps) {
  const id = `lead-${field}`;
  const errorId = `${id}-error`;
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-semibold text-slate-800">
        {label}
        {required && <span className="text-red-700"> *</span>}
        {hint && <span className="font-normal text-slate-600"> ({hint})</span>}
      </label>
      <input
        id={id}
        name={field}
        type={type}
        autoComplete={autoComplete}
        required={required}
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`mt-2 block w-full rounded-xl border bg-white px-4 py-3 text-base text-slate-900 shadow-sm focus:outline-none focus-visible:ring-4 ${
          error
            ? "border-red-600 focus-visible:ring-red-200"
            : "border-slate-300 focus:border-blue-700 focus-visible:ring-blue-200"
        }`}
      />
      {error && (
        <p id={errorId} className="mt-1 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
