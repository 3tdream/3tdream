// Promise.allSettled fan-out orchestrator for Webhook + Resend delivery.
// ADR: parallel delivery, each channel bounded by its OWN 5s AbortController
// (enforced inside webhookDeliver/resendDeliver), never client-facing on
// failure — the route handler always returns 202 regardless of outcome here.
import type {
  DeliveryAttempt,
  DeliveryChannel,
  DeliveryChannelConfig,
  LeadSubmission,
} from "@/types/lead";
import { webhookDeliver } from "@/lib/delivery/webhook";
import { resendDeliver } from "@/lib/delivery/resend";

// Local ambient fallback — avoids a hard dependency on @types/node being
// configured project-wide; shadows nothing if node types ARE present since
// this is scoped to this module only (file has imports/exports).
declare const process: { env: Record<string, string | undefined> };

export function loadDeliveryChannelConfig(): DeliveryChannelConfig {
  return {
    webhookUrl: process.env.LEAD_WEBHOOK_URL || undefined,
    resendApiKey: process.env.RESEND_API_KEY || undefined,
    resendFromEmail: process.env.RESEND_FROM_EMAIL || undefined,
    resendToEmail: process.env.RESEND_TO_EMAIL || undefined,
  };
}

function skipped(channel: DeliveryChannel): DeliveryAttempt {
  return { channel, status: "skipped", startedAt: Date.now(), durationMs: 0, timedOut: false };
}

// Never throws — any unexpected exception from a channel deliverer is
// captured here so Promise.allSettled always resolves with a clean
// DeliveryAttempt, guaranteeing the caller can always answer 202.
async function guarded(
  channel: DeliveryChannel,
  run: () => Promise<DeliveryAttempt>,
): Promise<DeliveryAttempt> {
  const startedAt = Date.now();
  try {
    return await run();
  } catch (err) {
    return {
      channel,
      status: "rejected",
      startedAt,
      durationMs: Date.now() - startedAt,
      timedOut: false,
      // non-PII only: never surface submission fields here.
      errorMessage: err instanceof Error ? err.name || "error" : "unknown_error",
    };
  }
}

// Fans out to Webhook + Resend concurrently. A channel with no config is
// "skipped" without ever being attempted (AC-11/AC-12: zero-config degrade,
// partial-config attempts only the configured channel).
export async function deliverLead(
  submission: LeadSubmission,
  config: DeliveryChannelConfig = loadDeliveryChannelConfig(),
): Promise<DeliveryAttempt[]> {
  const settled = await Promise.allSettled([
    config.webhookUrl
      ? guarded("webhook", () => webhookDeliver(submission, config))
      : Promise.resolve(skipped("webhook")),
    config.resendApiKey
      ? guarded("resend", () => resendDeliver(submission, config))
      : Promise.resolve(skipped("resend")),
  ]);

  return settled.map((result, i) => {
    if (result.status === "fulfilled") return result.value;
    // Defensive only — `guarded` never rejects, so this branch should be
    // unreachable in practice.
    const channel: DeliveryChannel = i === 0 ? "webhook" : "resend";
    return {
      channel,
      status: "rejected",
      startedAt: Date.now(),
      durationMs: 0,
      timedOut: false,
      errorMessage: "unexpected_rejection",
    };
  });
}
