"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { NAV } from "@/lib/content";
import { LangSwitcher } from "./lang-switcher";

export function Nav() {
  const { t } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur-sm border-b-2 border-ink">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand */}
          <Link href="/" className="group flex items-center gap-2 shrink-0">
            <span
              className="grid place-items-center w-9 h-9 bg-ink text-paper font-extrabold text-lg hard-shadow-sm group-hover:bg-accent transition-colors"
              aria-hidden
            >
              3
            </span>
            <span className="text-lg font-extrabold tracking-tight display">
              3TDream
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1.5",
                    active ? "text-accent" : "text-ink hover:text-accent",
                  ].join(" ")}
                >
                  <span
                    className="text-[10px] opacity-50"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {item.index}
                  </span>
                  {t(item.label)}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:block">
            <LangSwitcher />
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-3 md:hidden">
            <LangSwitcher />
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
              aria-expanded={open}
              className="grid place-items-center w-10 h-10 hard-border bg-paper"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="md:hidden overflow-hidden border-t-2 border-ink bg-paper"
          >
            <ul className="px-4 py-2">
              {NAV.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href} className="border-b border-ink/10 last:border-0">
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={[
                        "flex items-center gap-3 py-3.5 text-lg font-semibold",
                        active ? "text-accent" : "text-ink",
                      ].join(" ")}
                    >
                      <span
                        className="text-xs opacity-40"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {item.index}
                      </span>
                      {t(item.label)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
