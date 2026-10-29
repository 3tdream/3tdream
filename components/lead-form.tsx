"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useI18n } from "@/lib/i18n";
import { LEAD_FORM, leadErrorMessage } from "@/lib/content";
import { LEAD_FIELD_OPTIONS, HONEYPOT_FIELD_NAME } from "@/lib/lead-values";
import type { LeadRequestBody, LeadApiResponse, ReplyLang, ValidationErrorKey } from "@/types/lead";
type Status = "idle" | "submitting" | "success" | "error";

export function LeadForm() {
  const { lang, dir, t } = useI18n();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [replyLang, setReplyLang] = useState<ReplyLang>(lang);
  const renderedAt = useRef(Date.now());
  const disabled = status === "submitting";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (disabled) return;
    setStatus("submitting");
    setMessage("");
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload: LeadRequestBody = {
      name: String(data.get("name") || ""),
      contact: String(data.get("contact") || ""),
      brief: String(data.get("brief") || ""),
      role: String(data.get("role") || ""),
      industry: String(data.get("industry") || ""),
      companySize: String(data.get("companySize") || ""),
      replyLang,
      company_website: String(data.get(HONEYPOT_FIELD_NAME) || ""),
      formRenderedAt: renderedAt.current,
    };
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 202) {
        (await res.json()) as LeadApiResponse;
        setStatus("success");
        setMessage(t(LEAD_FORM.success));
        form.reset();
        renderedAt.current = Date.now();
        return;
      }
      const body = (await res.json().catch(() => null)) as { error?: ValidationErrorKey } | null;
      setMessage(t(body?.error ? leadErrorMessage(body.error) : LEAD_FORM.genericError));
      setStatus("error");
    } catch {
      setMessage(t(LEAD_FORM.genericError));
      setStatus("error");
    }
  }

  const selects = [
    { id: "role" as const, opts: LEAD_FIELD_OPTIONS.role, copy: LEAD_FORM.fields.role },
    { id: "industry" as const, opts: LEAD_FIELD_OPTIONS.industry, copy: LEAD_FORM.fields.industry },
    { id: "companySize" as const, opts: LEAD_FIELD_OPTIONS.companySize, copy: LEAD_FORM.fields.companySize },
  ];

  return (
    <form id="lead-form" dir={dir} onSubmit={onSubmit} noValidate className="hard-border bg-paper p-6 sm:p-8 flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-extrabold display">{t(LEAD_FORM.title)}</h2>
        <p className="mt-2 text-sm text-ink-soft">{t(LEAD_FORM.subtitle)}</p>
      </div>
      <p role="status" aria-live="polite" aria-atomic="true"
        className={"status-message " + (status === "success" ? "success " : status === "error" ? "error " : "") + (message ? "" : "sr-only")}>
        {message}
      </p>
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor={HONEYPOT_FIELD_NAME}>Website</label>
        <input type="text" id={HONEYPOT_FIELD_NAME} name={HONEYPOT_FIELD_NAME} tabIndex={-1} autoComplete="off" />
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="label">{t(LEAD_FORM.fields.name.label)}</label>
          <input id="name" name="name" type="text" required placeholder={t(LEAD_FORM.fields.name.placeholder)} className="form-input" disabled={disabled} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact" className="label">{t(LEAD_FORM.fields.contact.label)}</label>
          <input id="contact" name="contact" type="text" required placeholder={t(LEAD_FORM.fields.contact.placeholder)} className="form-input" disabled={disabled} />
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-5">
        {selects.map((s) => (
          <div key={s.id} className="flex flex-col gap-1.5">
            <label htmlFor={s.id} className="label">{t(s.copy.label)}</label>
            <select id={s.id} name={s.id} required defaultValue="" className="form-input" disabled={disabled}>
              <option value="" disabled>{t(s.copy.placeholder)}</option>
              {s.opts.map((opt) => (
                <option key={opt.value} value={opt.value}>{t(opt.label)}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="brief" className="label">{t(LEAD_FORM.fields.brief.label)}</label>
        <textarea id="brief" name="brief" required minLength={10} maxLength={2000} placeholder={t(LEAD_FORM.fields.brief.placeholder)} className="form-input" disabled={disabled} />
      </div>
      <div className="flex flex-col gap-1.5 sm:w-64">
        <label htmlFor="replyLang" className="label">{t(LEAD_FORM.fields.replyLang.label)}</label>
        <select id="replyLang" name="replyLang" value={replyLang} onChange={(e: ChangeEvent<HTMLSelectElement>) => setReplyLang(e.target.value as ReplyLang)} className="form-input" disabled={disabled}>
          {LEAD_FIELD_OPTIONS.replyLang.map((opt) => (
            <option key={opt.value} value={opt.value}>{t(opt.label)}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn btn-accent self-start" disabled={disabled}>
        {disabled ? t(LEAD_FORM.submitting) : t(LEAD_FORM.submit)}
      </button>
    </form>
  );
}
