"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useI18n, L } from "@/lib/i18n";
import { BRAND, CONTACTS, NAV } from "@/lib/content";

export function Footer() {
  const { t } = useI18n();
  const year = "2026";

  return (
    <footer className="border-t-2 border-ink bg-ink text-paper">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="text-3xl font-extrabold display">3TDream</div>
            <p className="mt-1 text-sm font-semibold text-paper/80">
              by Michael Shigrin Sokol
            </p>
            <p
              className="mt-2 text-sm text-paper/60"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {t(BRAND.expansion)}
            </p>
            <p className="mt-4 max-w-xs text-sm text-paper/70">{t(BRAND.tagline)}</p>
          </div>

          {/* Nav */}
          <div>
            <div className="label text-paper/50 mb-4">
              {t(L("Навигация", "Navigation", "ניווט"))}
            </div>
            <ul className="space-y-2">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-paper/80 hover:text-lime transition-colors"
                  >
                    {t(item.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="label text-paper/50 mb-4">
              {t(L("Связаться", "Get in touch", "צרו קשר"))}
            </div>
            <ul className="space-y-2">
              {CONTACTS.map((c) => (
                <li key={c.id}>
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1 text-paper/80 hover:text-lime transition-colors"
                  >
                    {c.label}
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-paper/15 flex flex-col sm:flex-row gap-2 justify-between text-xs text-paper/50">
          <span style={{ fontFamily: "var(--font-mono)" }}>
            © {year} 3TDream · Time To Team Dream
          </span>
          <span style={{ fontFamily: "var(--font-mono)" }}>
            {t(L("Сделано вручную", "Handcrafted", "נבנה ביד"))} · Next.js
          </span>
        </div>
      </div>
    </footer>
  );
}
