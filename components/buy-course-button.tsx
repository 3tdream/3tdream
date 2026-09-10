"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

/**
 * Asks the server for a Checkout session and follows it. The amount is never
 * sent from here — the server reads it from the product definition.
 */
export function BuyCourseButton({ label }: { label: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function go() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const body = (await res.json()) as { url?: string; error?: string };
      if (body.url) {
        window.location.href = body.url;
        return;
      }
      // Tell the visitor the truth: the shop is not open, and it is not their
      // browser's fault.
      setError(
        body.error === "not_configured"
          ? "Checkout is not switched on yet — email 3tdream@gmail.com and I will send you access."
          : "Could not start checkout. Try again, or email 3tdream@gmail.com.",
      );
    } catch {
      setError("Could not reach the server. Try again, or email 3tdream@gmail.com.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={go}
        disabled={busy}
        className="w-full inline-flex items-center justify-center gap-2 bg-ink text-paper border-2 border-ink px-6 py-3.5 font-bold hard-shadow-sm hover:bg-accent hover:border-accent transition-colors disabled:opacity-60"
      >
        {busy ? "Opening checkout…" : label}
        {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
      </button>
      {error && (
        <p role="alert" className="mt-3 text-xs text-accent leading-relaxed">
          {error}
        </p>
      )}
    </>
  );
}
