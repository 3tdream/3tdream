"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useI18n, L } from "@/lib/i18n";
import { LEAD_FIELD_OPTIONS, HONEYPOT_FIELD_NAME } from "@/lib/lead-values";
import type { LeadRequestBody, LeadApiResponse, ReplyLang } from "@/types/lead";

type Status = "idle" | "submitting" | "success" | "error";

export function LeadForm() {
  const { t, lang } = useI18n();
  const [status, setStatus] = useState<Status>("idle");
  const [role, setRole] = useState("");
  const [industry, setIndustry] = useState("");
  const [replyLang, setReplyLang] = useState<ReplyLang>(() => lang as ReplyLang);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const renderedAt = useRef(Date.now());
  const replyLangTouched = useRef(false);

  // Re-sync replyLang when the site-wide language changes, but only until
  // the visitor has manually touched the replyLang select (Q3 default).
  useEffect(() => {
    if (!replyLangTouched.current) {
      setReplyLang(lang as ReplyLang);
    }
  }, [lang]);
  const disabled = status === "submitting";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (disabled) return;
    setStatus("submitting");
    setFieldErrors({});

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload: LeadRequestBody = {
      name: String(data.get("name") || "").trim(),
      contact: String(data.get("contact") || "").trim(),
      role,
      roleOther: role === "other" ? String(data.get("roleOther") || "").trim() : undefined,
      industry,
      industryOther: industry === "other" ? String(data.get("industryOther") || "").trim() : undefined,
      companySize: String(data.get("companySize") || ""),
      brief: String(data.get("brief") || "").trim(),
      replyLang,
      honeypot: String(data.get(HONEYPOT_FIELD_NAME) || ""),
      formRenderedAt: renderedAt.current,
    };

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await res.json()) as LeadApiResponse;
      if (body.ok) {
        setStatus("success");
        form.reset();
        setRole("");
        setIndustry("");
        renderedAt.current = Date.now();
      } else {
        setFieldErrors(body.errors);
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const fieldErr = (field: string) =>
    fieldErrors[field]
      ? t(L("Проверьте это поле", "Check this field", "בדקו שדה זה"))
      : null;

  return (
    <form onSubmit={onSubmit} noValidate className="hard-border bg-paper p-6 sm:p-8 flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-extrabold display">
          {t(L("Расскажите о задаче", "Tell me about the project", "ספרו לי על הפרויקט"))}
        </h2>
        <p className="mt-2 text-sm text-ink-soft">
          {t(L("Отвечу в выбранном языке.", "I'll reply in the language you pick.", "אענה בשפה שתבחרו."))}
        </p>
      </div>

      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={"success-message " + (status === "success" ? "" : status === "error" ? "error-message" : "sr-only")}
      >
        {status === "success"
          ? t(L("Спасибо! Заявка отправлена.", "Thanks! Your message is on its way.", "תודה! ההודעה נשלחה."))
          : status === "error"
            ? t(L("Проверьте форму и попробуйте снова.", "Please check the form and try again.", "בדקו את הטופס ונסו שוב."))
            : ""}
      </p>

      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor={HONEYPOT_FIELD_NAME}>Website</label>
        <input type="text" id={HONEYPOT_FIELD_NAME} name={HONEYPOT_FIELD_NAME} tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="form-group">
          <label htmlFor="name" className="label">{t(L("Имя", "Name", "שם"))}</label>
          <input id="name" name="name" type="text" required maxLength={200} className="form-input" disabled={disabled} />
          {fieldErr("name") && <span className="error-message">{fieldErr("name")}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="contact" className="label">{t(L("Email / Telegram", "Email / Telegram", "אימייל / טלגרם"))}</label>
          <input id="contact" name="contact" type="text" required maxLength={200} className="form-input" disabled={disabled} />
          {fieldErr("contact") && <span className="error-message">{fieldErr("contact")}</span>}
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        <div className="form-group">
          <label htmlFor="role" className="label">{t(L("Роль", "Role", "תפקיד"))}</label>
          <select id="role" name="role" required value={role} onChange={(e) => setRole(e.target.value)} className="form-input" disabled={disabled}>
            <option value="" disabled>{t(L("Выберите", "Select", "בחרו"))}</option>
            {LEAD_FIELD_OPTIONS.role.map((opt) => (
              <option key={opt.code} value={opt.code}>{t(L(opt.label.ru, opt.label.en, opt.label.he))}</option>
            ))}
          </select>
          {role === "other" && (
            <input name="roleOther" type="text" required maxLength={200} placeholder={t(L("Уточните", "Specify", "פרטו"))} className="form-input" disabled={disabled} />
          )}
          {fieldErr("role") && <span className="error-message">{fieldErr("role")}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="industry" className="label">{t(L("Индустрия", "Industry", "תעשייה"))}</label>
          <select id="industry" name="industry" required value={industry} onChange={(e) => setIndustry(e.target.value)} className="form-input" disabled={disabled}>
            <option value="" disabled>{t(L("Выберите", "Select", "בחרו"))}</option>
            {LEAD_FIELD_OPTIONS.industry.map((opt) => (
              <option key={opt.code} value={opt.code}>{t(L(opt.label.ru, opt.label.en, opt.label.he))}</option>
            ))}
          </select>
          {industry === "other" && (
            <input name="industryOther" type="text" required maxLength={200} placeholder={t(L("Уточните", "Specify", "פרטו"))} className="form-input" disabled={disabled} />
          )}
          {fieldErr("industry") && <span className="error-message">{fieldErr("industry")}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="companySize" className="label">{t(L("Размер команды", "Team size", "גודל צוות"))}</label>
          <select id="companySize" name="companySize" required defaultValue="" className="form-input" disabled={disabled}>
            <option value="" disabled>{t(L("Выберите", "Select", "בחרו"))}</option>
            {LEAD_FIELD_OPTIONS.companySize.map((opt) => (
              <option key={opt.code} value={opt.code}>{t(L(opt.label.ru, opt.label.en, opt.label.he))}</option>
            ))}
          </select>
          {fieldErr("companySize") && <span className="error-message">{fieldErr("companySize")}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="brief" className="label">{t(L("Опишите задачу", "Describe the project", "תארו את הפרויקט"))}</label>
        <textarea id="brief" name="brief" required minLength={1} maxLength={2000} className="form-input" disabled={disabled} />
        {fieldErr("brief") && <span className="error-message">{fieldErr("brief")}</span>}
      </div>

      <div className="form-group sm:w-64">
        <label htmlFor="replyLang" className="label">{t(L("Язык ответа", "Reply language", "שפת תשובה"))}</label>
        <select
          id="replyLang"
          name="replyLang"
          value={replyLang}
          onChange={(e) => { replyLangTouched.current = true; setReplyLang(e.target.value as ReplyLang); }}
          className="form-input"
          disabled={disabled}
        >
          {LEAD_FIELD_OPTIONS.replyLang.map((opt) => (
            <option key={opt.code} value={opt.code}>{t(L(opt.label.ru, opt.label.en, opt.label.he))}</option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn btn-primary self-start" disabled={disabled}>
        {disabled && <span className="spinner" aria-hidden="true" />}
        {disabled ? t(L("Отправка…", "Sending…", "שולח…")) : t(L("Отправить", "Send", "שלח"))}
      </button>
    </form>
  );
}
