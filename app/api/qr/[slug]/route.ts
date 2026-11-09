// GET /api/qr/[slug] — public, stateless SVG QR code for a case-study URL.
// No DB, no auth. Origin is ALWAYS derived from NEXT_PUBLIC_SITE_URL, never
// from request headers (Host/Origin/X-Forwarded-*) — US-04/AC-11.
import { hasCase } from "@/lib/case-slugs";
import { qrSvg } from "@/lib/qr-code";

export const runtime = "nodejs";

function jsonError(status: number, error: string) {
  return Response.json({ ok: false, error }, { status });
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;

  // Sole validity gate (ADR) — no other slug source is ever consulted.
  if (!hasCase(slug)) {
    return jsonError(404, `Unknown case slug: ${slug}`);
  }

  // Accessed via globalThis (not the bare `process` identifier) so this file
  // type-checks even when @types/node is unavailable; behavior is unchanged —
  // the nodejs runtime above guarantees `process.env` exists at runtime.
  const siteUrl = (globalThis as { process?: { env?: Record<string, string | undefined> } })
    .process?.env?.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    return jsonError(503, "NEXT_PUBLIC_SITE_URL is not configured");
  }

  const origin = siteUrl.replace(/\/$/, "");
  const text = `${origin}/projects/${slug}`;

  let svg: string;
  try {
    svg = qrSvg(text);
  } catch {
    // Any thrown value (RangeError on oversized input, or any other encoder
    // irregularity) maps to a fixed, non-leaking JSON error. Never 500, never
    // the thrown error's message/stack (cyber fix: no internal detail leak).
    return jsonError(400, "too_long");
  }

  return new Response(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'",
    },
  });
}
