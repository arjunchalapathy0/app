import { z } from "zod";
import { CALCULATOR_LIMITS } from "./calculator";

const PHONE_PATTERN = /^[+()\-.\s\d]+$/;

/** Contact fields, shared by the client form and the API route. */
export const contactSchema = z.object({
  businessName: z
    .string()
    .trim()
    .max(120, "Business name must be 120 characters or fewer."),
  phone: z
    .string()
    .trim()
    .max(30, "Phone number is too long.")
    .refine(
      (value) =>
        value === "" ||
        (PHONE_PATTERN.test(value) && value.replace(/\D/g, "").length >= 7),
      "Enter a valid phone number, or leave it blank.",
    ),
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .max(254, "Email is too long.")
    .pipe(z.email("Enter a valid email address.")),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactInput;

const boundedInt = (limits: { min: number; max: number }) =>
  z.coerce.number().finite().min(limits.min).max(limits.max).transform(Math.round);

export const calculatorValuesSchema = z.object({
  callsPerWeek: boundedInt(CALCULATOR_LIMITS.callsPerWeek),
  missRate: boundedInt(CALCULATOR_LIMITS.missRate),
  jobValue: boundedInt(CALCULATOR_LIMITS.jobValue),
  bookingRate: boundedInt(CALCULATOR_LIMITS.bookingRate),
});

export const leadRequestSchema = contactSchema.extend({
  calculator: calculatorValuesSchema,
  // Honeypot: hidden from humans, so any value means a bot filled it in.
  website: z.string().max(500).optional().default(""),
});

export type LeadRequest = z.input<typeof leadRequestSchema>;

/** Flattens zod issues into one message per contact field for inline display. */
export function fieldErrorsFrom(error: z.ZodError): Partial<Record<ContactField, string>> {
  const errors: Partial<Record<ContactField, string>> = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (
      (field === "businessName" || field === "phone" || field === "email") &&
      !errors[field]
    ) {
      errors[field] = issue.message;
    }
  }
  return errors;
}
