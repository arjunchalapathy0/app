import { NextResponse } from "next/server";
import { calculateLoss } from "@/lib/calculator";
import { LEAD_SOURCE } from "@/lib/config";
import { fieldErrorsFrom, leadRequestSchema } from "@/lib/leadSchema";
import { clientIpFrom, isRateLimited } from "@/lib/rateLimit";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 10_000;

function errorResponse(status: number, error: string, extra: Record<string, unknown> = {}) {
  return NextResponse.json({ ok: false, error, ...extra }, { status });
}

export async function POST(request: Request) {
  if (isRateLimited(clientIpFrom(request.headers))) {
    return errorResponse(429, "Too many requests. Please try again later.");
  }

  const rawBody = await request.text();
  if (rawBody.length > MAX_BODY_BYTES) {
    return errorResponse(413, "Request body too large.");
  }

  let json: unknown;
  try {
    json = JSON.parse(rawBody);
  } catch {
    return errorResponse(400, "Invalid JSON body.");
  }

  const parsed = leadRequestSchema.safeParse(json);
  if (!parsed.success) {
    return errorResponse(400, "Invalid input.", { fieldErrors: fieldErrorsFrom(parsed.error) });
  }

  const lead = parsed.data;

  // Honeypot tripped: pretend success so bots don't learn to adapt.
  if (lead.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  // Created per request (not at module load) so builds and the calculator work without env vars.
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return errorResponse(503, "Lead storage not configured");
  }

  // Recompute on the server rather than trusting a client-sent total.
  const { monthlyLoss } = calculateLoss(lead.calculator);

  const { error } = await supabase.from("leads").insert({
    business_name: lead.businessName || null,
    phone: lead.phone || null,
    email: lead.email.toLowerCase(),
    calls_per_week: lead.calculator.callsPerWeek,
    miss_rate: lead.calculator.missRate,
    booking_rate: lead.calculator.bookingRate,
    job_value: lead.calculator.jobValue,
    monthly_loss: monthlyLoss,
    source: LEAD_SOURCE,
  });

  if (error) {
    console.error("Failed to insert lead:", error.message);
    return errorResponse(500, "Could not save your details. Please try again.");
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
