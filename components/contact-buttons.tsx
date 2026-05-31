"use client";

import { ArrowUpRight, Mail, Linkedin, Github, Palette, Send, MessageCircle } from "lucide-react";
import { CONTACTS } from "@/lib/content";

const ICONS: Record<string, React.ElementType> = {
  telegram: Send,
  whatsapp: MessageCircle,
  email: Mail,
  linkedin: Linkedin,
  github: Github,
  behance: Palette,
};

export function ContactButtons({ variant = "grid" }: { variant?: "grid" | "row" }) {
  return (
    <div
      className={
        variant === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 gap-3"
          : "flex flex-wrap gap-3"
      }
    >
      {CONTACTS.map((c) => {
        const Icon = ICONS[c.id] ?? Mail;
        return (
          <a
            key={c.id}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-3 bg-paper hard-border px-4 py-3 hover-shadow hover:-translate-y-0.5 transition-transform"
          >
            <span className="flex items-center gap-3">
              <Icon className="w-5 h-5 text-accent" />
              <span className="flex flex-col leading-tight">
                <span className="font-bold">{c.label}</span>
                <span
                  className="text-xs text-muted"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {c.handle}
                </span>
              </span>
            </span>
            <ArrowUpRight className="w-4 h-4 text-ink/40 group-hover:text-accent transition-colors" />
          </a>
        );
      })}
    </div>
  );
}
