// In-memory, per-instance rate limiter. Good enough for v1; on Vercel each
// serverless instance keeps its own counts, so swap for Redis/Upstash if abuse grows.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

const hitsByKey = new Map<string, number[]>();

export function isRateLimited(key: string, now: number = Date.now()): boolean {
  const recent = (hitsByKey.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    hitsByKey.set(key, recent);
    return true;
  }

  recent.push(now);
  hitsByKey.set(key, recent);

  // Keep memory bounded by occasionally dropping stale keys.
  if (hitsByKey.size > 5_000) {
    for (const [k, times] of hitsByKey) {
      if (times.every((t) => now - t >= WINDOW_MS)) hitsByKey.delete(k);
    }
  }

  return false;
}

export function clientIpFrom(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip")?.trim() || "unknown";
}
