# Module 6 — Decide what to trust

**You build:** the check that stands between a reading and the system that
will act on it.

**Model needed:** none — you already have the readings. **Cost:** none.

---

> **vB — no receiver:** the same gate, the same flags, running on the
> machine. The only difference is where "yesterday" comes from: a JSON file
> kept beside the agent rather than a row in a database. Everything about
> anchors below still applies — including rule 3, which is exactly as easy to
> get wrong with a file as with a table.

## The failure that matters is not the obvious one

You will be tempted to write range checks. Water between 0 and 20000, weight
between 0 and 6. Do write them — they cost nothing and they catch a decimal
point in the wrong place.

They will also catch almost nothing.

On a frame that scored 95%, two values were wrong. One column's weight came
back as its **neighbour's** value, and one came back null. Both sat
comfortably inside every range you would have written. A static range cannot
catch a plausible-but-wrong number, because the number is plausible.

The previous reading can.

## Domain knowledge belongs in the source file

Open `packages/core/src/gate.ts`. Notice what is *not* in it: no field names,
no units, nothing about what is being measured. Two flags on a field do all
the work.

```jsonc
"avg_weight":  { "monotonic": "up", "monotonic_tolerance": 0.03 },
"water_daily": { "daily_counter": true }
```

**`monotonic`** — this value only moves one way while a cycle runs. A reading
that moves the other way is the sharpest signal you have:

```ts
const back = f.monotonic === "up"
  ? was > 0 && now < was * (1 - slack)
  : was > 0 && now > was * (1 + slack);
if (back) reasons.push({ ..., code: "moved_backwards" });
```

That single rule is what catches the neighbour's-value failure. A value that
belongs to the column next door reads as a quantity that went backwards
overnight.

**`daily_counter`** — this accumulates through the day and resets at midnight.
Only these get the jump-and-collapse comparison.

There is a test in `packages/core/__tests__/core.test.ts` that removes
`monotonic` from the source and asserts the gate then says nothing about the
same data. The rule genuinely lives in the file.

## Three things about the comparison that are easy to get wrong

Each of these was found in production, in this order, and each one cost weeks
of noise before anyone looked.

### 1. Compare against a reading from the same time of day

A counter that resets at midnight cannot be compared across hours. A capture
at 06:42 holds a partial total; last night's 23:59 capture holds a finished
one. Compare them and you see a collapse that never happened.

```ts
const countersComparable = days <= COUNTER_MAX_GAP_DAYS && previous.sameSlot !== false;
```

**No comparable anchor beats a wrong one.** If there is no reading from the
same slot, the counter rules step aside rather than invent a fault.

### 2. Scale the tolerance to the gap

The thresholds — +60%, −50% — describe **one day**. If the anchor is three
days old, applying a one-day tolerance to a three-day change flags perfectly
normal growth.

```ts
const span = Math.max(days, 1);
const jumpLimit = (1 + COUNTER_JUMP) ** span - 1;
```

At one day this is exactly the original threshold: nothing loosens for the
normal case. Past a week the anchor says nothing useful and the rule stops.

### 3. The anchor must not be "the last reading that passed"

This is the subtle one, and it is worth understanding properly because the
same shape appears in many systems.

If the anchor is *the last reading that passed the gate*, then a flagged
reading never becomes the new anchor. The gap to the anchor grows. A one-day
tolerance is applied to an ever-larger gap. So the next reading is flagged
too — and the gap grows again.

In production this reached **91% of readings flagged on one site**, whose
anchor had frozen 5.4 days earlier. Across five sites, the age of the anchor
predicted the flag rate almost perfectly.

The fix is one word: anchor on the last reading **with numbers**, whatever its
verdict. Replaying the historical captures with that change took the flag rate
from 46-in-83 down to 15 — and every one of the 15 that remained was a real
event.

## Report, never repair

```ts
// Reasons are reported, never repaired: a silently "corrected" number is
// indistinguishable from a real one downstream.
```

It is tempting to clamp an out-of-range value, or to substitute yesterday's.
Do not. A repaired number arrives at the far end looking exactly like a
measured one, and nobody downstream can ever tell them apart again.

## Check

You have real readings from module 5. Now break them on purpose.

1. Take a good reading, change one column's `avg_weight` **downwards** by 10%,
   and gate it against the original. You should get `moved_backwards`.
2. Remove `monotonic` from `avg_weight` in `sources/demo-grid.json` and gate
   the same pair again. Silence. **The rule came from the file, not the code.**
3. Triple one `feed_daily` and gate against yesterday → `counter_jump`.
4. Gate the same tripled reading against an anchor marked `sameSlot: false` →
   nothing. That is rule 1 working.
5. Gate it against an anchor four days old → nothing, because a four-day
   tolerance is wide. That is rule 2 working.

Steps 4 and 5 look like the gate failing. They are the gate declining to
answer a question it has no business answering.

### If it did not work

| what you see | why |
|---|---|
| everything flags | your anchor is stale — check what you passed as `previous` |
| nothing ever flags | the fields carry no `monotonic` or `daily_counter` |
| flags on the first reading of a machine | there is no anchor yet; with `previous: null` only the static checks run, by design |

## What you have

A verdict with reasons, in the reading's own words, that a person can act on.
Module 7 decides what to actually do with a flagged reading — and the answer
is less obvious than "hold it".

**Next:** [Module 7 — deliver, and mean it](07-deliver.md).
