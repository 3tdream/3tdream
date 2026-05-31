"use client";

export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y-2 border-ink bg-accent text-paper select-none">
      <div className="flex w-max animate-marquee py-2.5">
        {row.map((item, i) => (
          <span
            key={i}
            className="mx-6 inline-flex items-center gap-6 text-sm font-bold uppercase tracking-wider whitespace-nowrap"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {item}
            <span aria-hidden className="text-lime">
              ◆
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
