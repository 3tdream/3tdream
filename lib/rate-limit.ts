// In-process sliding-window rate limit for POST /api/lead: 5 requests per
// 60 s per client fingerprint. Per instance by design — the site has no
// store, and the limit only has to blunt a naive script, not a distributed
// one. Reconstructed by hand after RUN-219 (the agent's file was not harvested).
import type { NextRequest } from "next/server";

const WINDOW_MS = 60_000;
const LIMIT = 5;
const hits = new Map<string, number[]>();

export function getRateLimitKey(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : req.headers.get("x-real-ip") ?? "unknown";
  return `lead:${ip}`;
}

export function checkRateLimit(key: string, now: number = Date.now()): { allowed: boolean; remaining: number } {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) {
    hits.set(key, recent);
    return { allowed: false, remaining: 0 };
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, ts] of hits) if (ts.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  }
  return { allowed: true, remaining: LIMIT - recent.length };
}
