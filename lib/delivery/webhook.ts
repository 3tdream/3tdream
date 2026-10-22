// lib/delivery/webhook.ts — fan-out channel #1: generic webhook POST.
// Skips entirely (not a failure) when LEAD_WEBHOOK_URL is unset, per
// AC-11/AC-12 zero-config degrade requirement. 5s AbortController timeout.
import type { DeliveryAttempt, DeliveryChannelConfig, LeadSubmission } from "@/types/lead";

const TIMEOUT_MS = 5000;

export async function webhookDeliver(
  submission: LeadSubmission,
  config: DeliveryChannelConfig,
): Promise<DeliveryAttempt> {
  const startedAt = Date.now();
  if (!config.webhookUrl) {
    return { channel: "webhook", status: "skipped", startedAt, durationMs: 0, timedOut: false };
  }

  const controller = new AbortController();
  // Timer is always cleared in `finally` below on every path (success,
  // rejection, abort) to avoid leaking a handle — verified against the
  // Resend channel's reported leak (lib/delivery/resend.ts P2).
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(config.webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: submission.name,
        contact: submission.contact,
        brief: submission.brief,
        role: submission.role,
        industry: submission.industry,
        companySize: submission.companySize,
        replyLang: submission.replyLang,
        receivedAt: submission.receivedAt,
      }),
      signal: controller.signal,
    });
    const durationMs = Date.now() - startedAt;
    if (!res.ok) {
      return {
        channel: "webhook", status: "rejected", startedAt, durationMs, timedOut: false,
        errorMessage: `http_${res.status}`,
      };
    }
    return { channel: "webhook", status: "fulfilled", startedAt, durationMs, timedOut: false };
  } catch (err) {
    const durationMs = Date.now() - startedAt;
    const timedOut = err instanceof Error && err.name === "AbortError";
    return {
      channel: "webhook", status: "rejected", startedAt, durationMs, timedOut,
      errorMessage: timedOut ? "timeout" : "network_error",
    };
  } finally {
    clearTimeout(timer);
  }
}
