# Module 7 — Deliver, and mean it

**You build:** the leg that hands numbers to the system that will act on
them, in that system's own vocabulary, exactly once.

**Model needed:** none. **Cost:** none.

---

> **vB — no receiver:** delivery happens straight from the machine, and the
> retry you need is the one you already built in module 3. The queue is not
> only for uploads to a receiver — it is for any send that can fail. Point it
> at the target API and the offline story is unchanged.

## The receiving API is not yours to design

By the time you build this, the customer's API already exists. It has opinions
about what its fields are called, how it wants to be authenticated, and what
it considers success. Every one of those is different at the next customer.

So none of it is code. Open `packages/core/src/mapping.ts`:

```ts
const shape = { ...DEFAULTS, ...(target.payload ?? {}) };
...
return {
  [shape.id_field]: target.id,
  [shape.timestamp_field]: capturedEpochSec,
  [shape.rows_field]: rows,
};
```

Four names in the target file, and the body changes shape:

```jsonc
"payload": {
  "id_field": "siteCode",
  "timestamp_field": "readingTime",
  "rows_field": "meters",
  "row_id_field": "meterId"
}
```

There is a test asserting exactly this — the same reading, a different target
file, a completely different body, and no code touched. If you take one thing
from this course into your own work, take this: **the parts that differ
between customers should be the parts that are data.**

Authentication is the same idea, in the environment rather than the file:

```ts
headers: { "Content-Type": "application/json", [ENV.deliverAuthHeader]: ENV.deliverToken() }
```

## Success is not always 200

```ts
function accepted(res: Response, body: unknown): boolean {
  if (!res.ok) return false;
  const field = ENV.deliverOkField;
  if (!field) return true;
  return String((body as Record<string, unknown>)?.[field]) === ENV.deliverOkValue;
}
```

Some APIs answer `200` with a failure inside the body. Treating that as
delivered is how a reading disappears silently — your side says sent, their
side never had it, and the gap is only found when somebody asks about a number
that does not exist.

If the API you are talking to does that, name the field. If it does not, leave
it empty and any 2xx counts.

## Three rules for what goes in the body

### A column nobody mapped is not delivered

```ts
const mappedId = byTag.get(c.column);
if (!mappedId) continue;
```

The screen shows twelve columns; the customer's system knows nine of them.
Unmapped columns are silently absent — which is how a customer switches one
off without anyone deploying anything.

### A null must never become a zero

```ts
if (c.paused && !keys.some((k) => typeof c[k] === "number")) continue;
```

A column with nothing numeric is skipped entirely, not sent as zeros.
Downstream, a null is far more likely to be stored as `0` than ignored — and
a zero in a consumption series is a real, wrong measurement, not a gap.

### Context fields never go out

The target file lists exactly what is delivered. A field marked `context` in
the source is read to sharpen the gate and stops there. Whoever wrote the
receiving API did not ask for it and should not have to ignore it.

## Deliver exactly once

Read the delivery cron in `packages/server/app/api/cron/deliver/route.ts`.
Three properties matter more than the code:

**Idempotent on the way in.** The agent's `runId` is the key. A queued run
replayed after an outage (module 3) is accepted quietly as a duplicate, not
stored twice.

**A failed delivery leaves no mark.** `forwardedAt` stays empty and the run is
picked up on the next tick. Delivery retries until it succeeds; nothing else
does.

**Rows are counted by the target's own name for them:**

```ts
const rowCount = payloadRowCount(target, payload);
if (!rowCount) { report.skipped.push({ runId: run.id, reason: "no mapped, active columns" }); continue; }
```

## The decision you have to make on purpose

A reading is flagged. Do you deliver it?

The system this comes from ships **both** — verified and flagged — because the
customer owns the numbers and a flag is a diagnostic, not a verdict. That is
one defensible answer. Holding flagged readings for review is another.

What is **not** defensible is the state that system was actually in for a
while: delivering both, and sending nothing that distinguishes them. Their API
received a flagged reading and a clean one as identical bodies. All the work
of module 6 stayed on our side of the wire.

So: pick a policy, and if you deliver flagged readings, make sure the receiver
can tell. An extra field if their contract allows one. A separate endpoint if
not. A daily summary if neither. Any of those beats a silent one.

## Check

1. Deliver a reading to `/api/dev/echo` (set `DEV_ECHO_RECEIVER=1`), then `GET`
   it back with your operator key. Inspect the body you actually sent.
2. Add a `payload` block to your target file renaming all four fields. Deliver
   again. **Different body, no code changed.**
3. Remove three columns from `mapping` and confirm those rows are gone.
4. Deliver the same `runId` twice — the second is a duplicate, not a second row.
5. Point `DELIVER_API_URL` at something that returns 500. Watch `forwardedAt`
   stay empty and the next tick retry it.

### If it did not work

| what you see | why |
|---|---|
| `no mapped, active columns` | the column tags in `mapping` do not match the numbers the reader returned |
| delivered, but the API says it got nothing | it answers 200 with an error inside — set `DELIVER_OK_FIELD` |
| duplicates at the far end | you are generating a new `runId` on retry. The id belongs to the capture, not the attempt |

## What you have

Numbers arriving in the customer's system, in the customer's words, once.

**Next:** [Module 8 — when you are not looking](08-operate-it.md).
