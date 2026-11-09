"use client";
import { useState } from "react";
import Image from "next/image";
import { useI18n, L } from "@/lib/i18n";

export function ShareCase({ slug }: { slug: string }) {
  const { t } = useI18n();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
  if (!siteUrl) return null;

  const caseUrl = `${siteUrl}/projects/${slug}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(caseUrl);
      setStatus("success");
    } catch {
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 2000);
  };

  return (
    <div className="mt-10 sm:mt-12 hard-border bg-paper-alt p-6 sm:p-8" data-testid="share-case">
      <p className="label text-accent">{t(L("Поделиться кейсом", "Share this case", "שתף את המקרה הזה"))}</p>

      <div className="mt-6 flex flex-col sm:flex-row gap-6 items-start">
        <div className="flex-shrink-0">
          <Image
            src={`/api/qr/${slug}`}
            alt={t(L("QR-код для этого кейса", "QR code for this case", "קוד QR למקרה זה"))}
            width={160}
            height={160}
            unoptimized
            data-testid="share-qr"
            className="hard-border bg-paper"
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted uppercase tracking-widest mb-2">{t(L("Ссылка", "Link", "קישור"))}</p>
          <bdi dir="ltr" className="block text-sm font-mono text-ink break-all">{caseUrl}</bdi>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={copy}
              data-testid="share-copy"
              className="inline-flex items-center gap-2 bg-ink text-paper px-4 py-3 font-bold text-sm hard-border active:scale-95"
              aria-label={t(L("Скопировать ссылку", "Copy link", "העתק קישור"))}
            >
              {status === "success"
                ? t(L("Скопировано", "Copied", "הועתק"))
                : status === "error"
                ? t(L("Ошибка", "Failed", "שגיאה"))
                : t(L("Копировать", "Copy", "העתק"))}
            </button>

            <a
              href={`/api/qr/${slug}`}
              download={`${slug}-qr.svg`}
              data-testid="share-download"
              className="inline-flex items-center gap-2 bg-paper text-ink px-4 py-3 font-bold text-sm hard-border active:scale-95"
              aria-label={t(L("Загрузить QR-код как SVG", "Download QR code as SVG", "הורד קוד QR כ-SVG"))}
            >
              {t(L("Загрузить SVG", "Download SVG", "הורד SVG"))}
            </a>
          </div>

          <p
            role="status"
            aria-live="polite"
            data-testid="share-status"
            className={`mt-3 text-sm font-semibold ${status === "success" ? "text-accent" : status === "error" ? "text-red-600" : "sr-only"}`}
          >
            {status === "success"
              ? t(L("Ссылка скопирована в буфер обмена", "Link copied to clipboard", "הקישור הועתק ללוח"))
              : status === "error"
              ? t(L("Не удалось скопировать", "Failed to copy", "לא הצליח להעתיק"))
              : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
