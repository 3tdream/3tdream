// GET /api/qr/[slug] — public, stateless SVG QR code for a case-study URL.
// No DB, no auth. Origin is ALWAYS derived from NEXT_PUBLIC_SITE_URL, never
// from request headers (Host/Origin/X-Forwarded-*) — US-04/AC-11.
import { hasCase } from "@/lib/case-slugs";
import { qrSvg } from "@/lib/qr-code";

export const runtime = "nodejs";

function jsonError(status: number, error: string) {
  return Response.json(
    { ok: false, error },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;

  // Sole validity gate (ADR) — no other slug source is ever consulted.
  if (!hasCase(slug)) {
    return jsonError(404, "unknown_case");
  }

  // Accessed via globalThis (not the bare `process` identifier) so this file
  // type-checks even when @types/node is unavailable; behavior is unchanged —
  // the nodejs runtime above guarantees `process.env` exists at runtime.
  const siteUrl = (
    (globalThis as { process?: { env?: Record<string, string | undefined> } })
      .process?.env?.NEXT_PUBLIC_SITE_URL ?? ""
  ).trim();
  // Unset, blank, or non-http(s) origin is treated as not configured (503).
  if (!/^https?:\/\//i.test(siteUrl)) {
    return jsonError(503, "not_configured");
  }

  const origin = siteUrl.replace(/\/$/, "");
  const text = `${origin}/projects/${slug}`;

  let svg: string;
  try {
    svg = qrSvg(text);
  } catch (error) {
    // Fixed strings only — never expose error.message / error.stack.
    if (error instanceof RangeError) return jsonError(500, "too_long");
    return jsonError(500, "encode_failed");
  }

  return new Response(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'",
    },
  });
}
