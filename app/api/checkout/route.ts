/**
 * POST /api/checkout — start a Stripe Checkout session for the bridge-agent
 * repository.
 *
 * The price is read from lib/course-product.ts on the server. Nothing about
 * the amount comes from the request: a price a browser can propose is a price
 * the buyer chose.
 *
 * Checkout collects the buyer's GitHub username as a required custom field,
 * because access is granted to a GitHub account and an email does not name one.
 */
import { NextResponse } from "next/server";
import { COURSE_PRODUCT, GITHUB_FIELD } from "@/lib/course-product";
import { getStripe, stripeConfigured } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function origin(request: Request): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env) return env.replace(/\/+$/, "");
  const h = request.headers;
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function POST(request: Request) {
  if (!stripeConfigured()) {
    // Say which knob is missing rather than 500. A shop that cannot take money
    // should be obvious to whoever deployed it, not to the customer.
    return NextResponse.json(
      { error: "not_configured", detail: "STRIPE_SECRET_KEY is not set on this deployment" },
      { status: 503 },
    );
  }

  const base = origin(request);
  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: COURSE_PRODUCT.currency,
            unit_amount: COURSE_PRODUCT.amount,
            product_data: { name: COURSE_PRODUCT.name, description: COURSE_PRODUCT.description },
          },
        },
      ],
      custom_fields: [
        {
          key: GITHUB_FIELD,
          label: { type: "custom", custom: "Your GitHub username" },
          type: "text",
          optional: false,
          text: { minimum_length: 1, maximum_length: 39 },
        },
      ],
      // The webhook needs to know which repository this purchase grants.
      metadata: { repo: `${COURSE_PRODUCT.repo.owner}/${COURSE_PRODUCT.repo.name}` },
      success_url: `${base}/courses/bridge-agent/thanks?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/courses/bridge-agent#get-the-code`,
    });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("[checkout] session create failed:", (e as Error).message);
    return NextResponse.json({ error: "checkout_failed" }, { status: 502 });
  }
}
