"use client";

import { useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import {
  LEAD_ROLE_OPTIONS, LEAD_INDUSTRY_OPTIONS, LEAD_COMPANY_SIZE_OPTIONS,
  LEAD_FIELD_LABELS, LEAD_FORM_UI, leadErrorMessage,
} from "@/lib/content";
import { useI18n } from "@/lib/i18n";
import type { LeadField, LeadRequestBody, ReplyLang, ValidationErrorKey } from "@/types/lead";

// LEAD_FIELD_LABELS / option labels are keyed by lib/i18n's `Lang`, which is
// structurally identical to `ReplyLang` but a distinct alias — cast once here
// so downstream indexing with ReplyLang/LeadField is type-safe, not `any`.
const FIELD_LABELS = LEAD_FIELD_LABELS as unknown as Record<LeadField, Record<ReplyLang, string>>;

type Status = "idle" | "submitting" | "success" | "error";

// All LeadFields that can carry a per-field error message.
const ALL_LEAD_FIELDS: LeadField[] = ["name", "contact", "brief", "role", "industry", "companySize", "replyLang"];
const emptyErrors = (): Record<LeadField, string | null> =>
  Object.fromEntries(ALL_LEAD_FIELDS.map((f) => [f, null])) as Record<LeadField, string | null>;

const REPLY_LANGS: { value: ReplyLang; label: string }[] = [
  { value: "ru", label: "Русский" }, { value: "en", label: "English" }, { value: "he", label: "עברית" },
];
const SELECTS = [
  { field: "role" as const, options: LEAD_ROLE_OPTIONS },
  { field: "industry" as const, options: LEAD_INDUSTRY_OPTIONS },
  { field: "companySize" as const, options: LEAD_COMPANY_SIZE_OPTIONS },
];
const inputCls = "w-full border border-ink/20 bg-paper px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-ink transition-colors";
// Honeypot: in the DOM for bots, invisible + unreachable for humans.
const hpStyle: CSSProperties = {
  position: "absolute", width: 1, height: 1, padding: 0, margin: -1,
  overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0,
};

// Maps a ValidationErrorKey back to the LeadField it belongs to (if any).
function errorKeyToField(key: ValidationErrorKey): LeadField | null {
  for (const f of ALL_LEAD_FIELDS) {
    if (key.startsWith(f + "_") || key === `${f}_required` || key === `${f}_invalid`) return f;
  }
  if (key === "brief_length") return "brief";
  return null;
}

export function LeadForm() {
  // AC-07: seed replyLang and dir from the active UI language so Hebrew
  // visitors see RTL labels immediately without manually toggling.
  const { lang } = useI18n();
  const uiLang = (lang === "ru" || lang === "en" || lang === "he" ? lang : "en") as ReplyLang;

  // replyLang is independent state — user can change it without affecting UI lang.
  const [replyLang, setReplyLang] = useState<ReplyLang>(uiLang);

  const [status, setStatus] = useState<Status>("idle");
  // AC-06: per-field error map instead of a single banner string.
  const [fieldErrors, setFieldErrors] = useState<Record<LeadField, string | null>>(emptyErrors);
  // AC-14: single status message for aria-live (covers both success and generic errors).
  const [statusMsg, setStatusMsg] = useState<string>("");

  const renderedAt = useRef<number>(Date.now());

  // AC-07: dir is derived from replyLang (independent from UI lang).
  const dir = replyLang === "he" ? "rtl" : "ltr";
  const label = (f: LeadField) => FIELD_LABELS[f][replyLang];

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setFieldErrors(emptyErrors());
    setStatusMsg("");
    const form = e.currentTarget;
    const d = new FormData(form);
    const payload: LeadRequestBody = {
      name: String(d.get("name") || ""), contact: String(d.get("contact") || ""),
      brief: String(d.get("brief") || ""), role: String(d.get("role") || ""),
      industry: String(d.get("industry") || ""), companySize: String(d.get("companySize") || ""),
      replyLang, company_website: String(d.get("company_website") || ""), formRenderedAt: renderedAt.current,
    };
    try {
      const res = await fetch("/api/lead", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      if (res.status === 202) {
        setStatus("success");
        form.reset();
        renderedAt.current = Date.now();
        // AC-14: announce success via the persistent aria-live element.
        setStatusMsg((LEAD_FORM_UI.success as unknown as Record<ReplyLang, string>)[replyLang]);
        return;
      }
      const body = (await res.json().catch(() => null)) as { error?: ValidationErrorKey } | null;
      const errorKey: ValidationErrorKey = body?.error ?? "body_invalid";
      const msg = leadErrorMessage(errorKey, replyLang);
      // AC-06: route the error to the specific field if possible.
      const field = errorKeyToField(errorKey);
      if (field) {
        setFieldErrors((prev) => ({ ...prev, [field]: msg }));
        // AC-14: also surface in aria-live for screen readers.
        setStatusMsg(msg);
      } else {
        // Generic / body-level error — no field to attach to.
        setStatusMsg(msg);
      }
      setStatus("error");
    } catch {
      const msg = leadErrorMessage("body_invalid", replyLang);
      setStatusMsg(msg);
      setStatus("error");
    }
  }

  return (
    <form dir={dir} onSubmit={onSubmit} noValidate className="hard-border bg-paper p-6 sm:p-8 flex flex-col gap-5">
      {/* AC-14: single persistent aria-live region for both success and error outcomes. */}
      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={
          "text-sm font-semibold " +
          (status === "success" ? "text-ink" : "text-red-600") +
          (statusMsg ? "" : " sr-only")
        }
      >
        {statusMsg}
      </p>
      <div style={hpStyle} aria-hidden="true">
        <label htmlFor="company_website">Website</label>
        <input type="text" id="company_website" name="company_website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        {/* AC-06: pass per-field error to each Field wrapper */}
        <Field label={label("name")} error={fieldErrors.name}>
          <input name="name" type="text" required maxLength={100} autoComplete="name" className={inputCls} aria-invalid={!!fieldErrors.name} />
        </Field>
        <Field label={label("contact")} error={fieldErrors.contact}>
          <input name="contact" type="text" required autoComplete="email" className={inputCls} aria-invalid={!!fieldErrors.contact} />
        </Field>
      </div>
      <Field label={label("brief")} error={fieldErrors.brief}>
        <textarea name="brief" required minLength={10} maxLength={2000} rows={4} className={inputCls + " resize-none"} aria-invalid={!!fieldErrors.brief} />
      </Field>
      <div className="grid sm:grid-cols-3 gap-5">
        {SELECTS.map(({ field, options }) => (
          <Field key={field} label={label(field)} error={fieldErrors[field]}>
            <select name={field} required defaultValue="" className={inputCls} aria-invalid={!!fieldErrors[field]}>
              <option value="" disabled>—</option>
              {options.map((o) => <option key={o.value} value={o.value}>{(o.label as unknown as Record<ReplyLang, string>)[replyLang]}</option>)}
            </select>
          </Field>
        ))}
      </div>
      <Field label={label("replyLang")} error={fieldErrors.replyLang}>
        <div className="flex gap-2">
          {REPLY_LANGS.map((o) => (
            <button key={o.value} type="button" onClick={() => setReplyLang(o.value)} aria-pressed={replyLang === o.value}
              className={"px-3 py-2 text-sm font-semibold border transition-colors active:scale-[0.97] " +
                (replyLang === o.value ? "bg-ink text-paper border-ink" : "bg-paper text-ink border-ink/20 hover:border-ink/50")}>
              {o.label}
            </button>
          ))}
        </div>
      </Field>
      <button type="submit" disabled={status === "submitting"}
        className="mt-2 inline-flex items-center justify-center gap-2 bg-ink text-paper px-6 py-3.5 font-bold hard-shadow hover:bg-accent transition-colors disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]">
        {status === "submitting" ? LEAD_FORM_UI.sending[replyLang] : LEAD_FORM_UI.submit[replyLang]}
      </button>
    </form>
  );
}

// AC-06: Field now accepts an optional error string rendered adjacent to the input.
function Field({ label, error, children }: { label: string; error?: string | null; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-semibold text-ink-soft">{label}</span>
      {children}
      {error ? <span className="text-xs font-semibold text-red-600" role="alert">{error}</span> : null}
    </label>
  );
}
