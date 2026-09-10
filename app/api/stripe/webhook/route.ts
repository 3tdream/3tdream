/**
 * POST /api/stripe/webhook — Stripe tells us a purchase completed; we grant
 * the buyer access to the repository.
 *
 * The signature is verified against the raw body, so this endpoint cannot be
 * driven by anyone who merely knows its URL. Everything else follows from the
 * session: who paid, and which GitHub account they named at checkout.
 *
 * There is no database. Stripe is the record of the sale and GitHub is the
 * record of access; a third copy here would only be a third thing to disagree.
 */
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { COURSE_PRODUCT, GITHUB_FIELD } from "@/lib/course-product";
import { grantRepoAccess } from "@/lib/github-access";
import { getStripe, stripeConfigured } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** The username the buyer typed into Checkout's custom field. */
function githubUsernameFrom(session: Stripe.Checkout.Session): string | null {
  for (const f of session.custom_fields ?? []) {
    if (f.key === GITHUB_FIELD) return f.text?.value ?? null;
  }
  return null;
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeConfigured() || !secret) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "no_signature" }, { status: 400 });

  // Raw text, not request.json(): the signature covers the exact bytes.
  const raw = await request.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(raw, signature, secret);
  } catch (e) {
    console.error("[stripe/webhook] bad signature:", (e as Error).message);
    return NextResponse.json({ error: "bad_signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ ok: true, ignored: event.type });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  if (session.payment_status !== "paid") {
    // An unpaid completed session is a real state (async payment methods).
    // Access waits for the money.
    console.warn(`[stripe/webhook] ${session.id} completed but payment_status=${session.payment_status}`);
    return NextResponse.json({ ok: true, waiting: session.payment_status });
  }

  const username = githubUsernameFrom(session);
  if (!username) {
    console.error(`[stripe/webhook] ${session.id} paid but named no GitHub account — grant by hand`);
    return NextResponse.json({ ok: true, manual: "no_github_username" });
  }

  const grant = await grantRepoAccess(username, COURSE_PRODUCT.repo);
  if (!grant.ok) {
    // 500 so Stripe retries: a paid customer without access is worth another
    // attempt, and the log names who to fix by hand if the retries run out.
    console.error(`[stripe/webhook] ${session.id} paid by ${session.customer_details?.email ?? "?"} — granting ${username} failed: ${grant.reason}`);
    return NextResponse.json({ error: "grant_failed", detail: grant.reason }, { status: 500 });
  }

  console.log(`[stripe/webhook] ${session.id}: ${username} ${grant.state} on ${COURSE_PRODUCT.repo.owner}/${COURSE_PRODUCT.repo.name}`);
  return NextResponse.json({ ok: true, granted: username, state: grant.state });
}
