// Non-PII operational logging for the lead-capture pipeline (US-09).
// NEVER pass name/contact/brief into this module — LeadLogEntry's type
// intentionally has no fields for them, so a compile-time contract backs
// the "no PII in logs" requirement, not just code review discipline.
import type { LeadLogEntry } from "@/types/lead";

/** Writes a single-line, non-PII JSON log entry to stdout. Fire-and-forget. */
export function logLeadEvent(entry: LeadLogEntry): void {
  try {
    console.log(JSON.stringify({ event: "lead_event", ...entry }));
  } catch {
    // Never let a logging failure affect the request/response path.
  }
}
