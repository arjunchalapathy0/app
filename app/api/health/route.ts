import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    ok: true,
    // Reports only whether storage is configured, never the values themselves.
    leadStorageConfigured: Boolean(
      process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
    ),
    timestamp: new Date().toISOString(),
  });
}
