# Module 5 — Read the screen

**You build:** the step that turns a PNG into numbers, and the measurement
that tells you how well it did.

**Model needed: yes.** **Cost:** about $0.02 per reading, on your own key.

---

## Bring your own key

Everything so far ran for free, and everything after this does too. This one
module spends. Get a key from console.anthropic.com and put it in your
receiver's environment as `ANTHROPIC_API_KEY`.

Use your own account on purpose. You are about to make a decision — how often
to read, at what resolution, in which mode — and the only way that decision
means anything is if you watch the number on your own bill.

## The prompt is generated, never written

Open `packages/core/src/prompt.ts`. There is no prose describing the screen
anywhere in it. Every sentence is built from the source spec:

```ts
const app = source?.app_name ?? "the application";
const screen = source?.screen ?? "the table with one column per unit";
const rtl = source?.layout?.direction !== "ltr";
const labelSide = source?.layout?.label_column ?? (rtl ? "rightmost" : "leftmost");
```

and the field list comes straight from the catalog:

```ts
${fields.map((f) => `  - "${f.label}" -> ${f.key} (${f.type === "int" ? "integer" : "decimal"})`).join("\n")}
```

This is the difference between a script and a product. Adding a row to read is
a line of JSON. Supporting a second application is a new file in `sources/`.
Neither is a code change, and neither can drift out of sync with the validator
— because the validator reads the same list.

## The three things the prompt must say

### Name the exact column numbers

```
This target's screen shows exactly 12 columns, numbered 1, 2, ... 12 — report
exactly these, no others. The numbers do NOT have to start at 1.
```

Real screens do not number from 1. One production site shows columns 6–9.
Before the prompt said this, a perfect capture of that screen was rejected as
the wrong screen, every day, because the reader expected 1–4.

### Say which way the table runs

```
CRITICAL — the table runs right-to-left: headers read 12, 11, ... 1 from
LEFT to RIGHT, so column 1 is the RIGHTMOST data column. Map every value by
the number printed in its own column header, never by visual position.
```

The sandbox screen is right-to-left on purpose. Reading by position instead of
by header mirrors every value — and the result looks completely plausible.
Every number is in range, every column is present, and the whole table is
wrong. `course/score-extraction.mjs` detects this specifically.

### Give it a way to say "this is not the screen"

```
If this is NOT that screen (a history view, a settings dialog, a chart), do
not guess: return {"columns":[],"screen":"other"}.
```

Without an escape hatch, a model asked for numbers will produce numbers. An
explicit refusal is worth more than a confident invention, and the caller
turns it into its own verdict:

```ts
if (parsed.screen === "other") {
  return { ..., reasons: [{ code: "wrong_screen", detail: "..." }] };
}
```

## Two modes

`readCapture` takes `mode: "frame" | "rows"`.

**frame** — one call, the whole screenshot. One price, one round trip. This is
the default and it is usually right.

**rows** — the image is cut into bands, and each parameter row is sent as a
stitched `[header | row]` strip, upscaled. More calls, more money, and much
harder to misread: each strip carries its own label and its own column
numbers, so a mis-picked band shows up as a **label mismatch** instead of
quietly feeding the wrong row into a contracted field:

```ts
const field = fieldForLabel(fields, parsed.label ?? "");
if (!field || field.key !== key) continue;  // wrong row read — drop it
```

Start with frame. Move a source to rows when the screen is dense and the frame
score will not come up.

## Parse defensively

```ts
const unfenced = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
try { return JSON.parse(unfenced); } catch {
  const s = unfenced.indexOf("{"), e = unfenced.lastIndexOf("}");
  ...
}
```

Models fence JSON and wrap it in a sentence. Strip the fence, then fall back to
the outermost brace pair, then give up **loudly**:

```ts
return { ..., error: "unparseable_output", detail: call.text.slice(0, 200) };
```

An unparseable answer is an error, not a verdict. It must never look like a
reading with no values.

## Check — this is the payoff

Module 1 wrote the answers down. Now use them.

1. Rebuild the sandbox and capture it. **Close the workbook in Excel first.**
   Module 1 told you to leave it open and Excel holds the file, so a rebuild
   while it is open is refused; reopen it before the capture:
   ```powershell
   powershell -File agent\src\mock\build-mock.ps1 -Seed 11
   powershell -File C:\bridge-agent\capture.ps1
   ```
2. Read it — through your receiver's extract endpoint, or by calling
   `readCapture` directly — and save the answer as `reading.json`.
3. Score it:
   ```bash
   node course/score-extraction.mjs reading.json
   ```

You get something like:

```
columns: 12 read / 12 on the screen
values : 47/48 correct  (97.9%)

what disagreed:
  column 7  avg_weight  got 0.585  want 0.612
```

**That is the number this whole course exists to produce.** Not "it seems to
work" — 47 of 48, and here is the cell.

Now change something and watch it move. Capture the window un-maximised.
Scroll the sheet so the header row is off screen. Set `direction` to `ltr` in
the source spec, which is a lie, and see the mirrored-table warning appear.

### If it did not work

| what you see | why |
|---|---|
| `wrong_screen` on a good capture | the column numbers in the target file do not match the screen's headers |
| a neighbour's value in the wrong column | direction or `label_column` is wrong for this screen — see above |
| `unparseable_output` | look at `detail`; the model usually said something in prose about why |
| every value null | the labels in your source spec do not match what is printed. They must match exactly |

## What you have

A reading, and an honest number for how good it is. Everything after this
assumes you can measure — module 6 decides what to do when the measurement is
not perfect, which it will not always be.

**Next:** [Module 6 — decide what to trust](06-decide-what-to-trust.md).
