# Module 8 — Operate it when you are not looking

**You build:** the parts that tell you something is wrong before the customer
does, and the limits that stop a fault from becoming a bill.

**Model needed:** none. **Cost:** none — this module exists to protect the one
that does.

---

> **vB — no receiver:** the spend cap and the retention rule move onto the
> machine, and that is straightforward. Silence is not. With nothing in the
> middle, a machine that stops sending is invisible until somebody notices a
> gap in the numbers — so arrange a signal deliberately: a daily heartbeat to
> any endpoint you own, or an alert on the receiving side when a site has not
> reported. Do not leave this one to be discovered.

## Silence is the only failure you cannot see

Every other fault announces itself. A wrong screen produces a verdict. A bad
token produces a 401. A network outage produces a queue. But a machine that
was switched off, or whose user signed out, or that someone took home,
produces exactly nothing — and nothing looks identical to a quiet night.

So the agent reports on every attempt, including the ones that failed:

```ts
// POST /api/heartbeat — status: ok | capture_failed | upload_failed
```

Now the watchdog can distinguish. Read
`packages/server/app/api/cron/watchdog/route.ts`:

- a machine that has not reported for longer than the tolerance,
- a machine reporting failures,
- a machine presenting a stale token (module 4).

## Choosing the silence tolerance

Not "as short as possible". Pick it from the capture rhythm: it must be long
enough that one late run is not an alarm, and short enough that a missed run
is caught the same day.

For a once-daily capture, fourteen hours is about right. It cannot fire from a
normal day's gap, and a machine that misses its slot is flagged well before
the next one.

An alert that fires when nothing is wrong gets muted, and a muted alert is
worse than none — because now you believe you have monitoring.

## Cap the spend, not just the errors

Module 5 costs money. So a failure loop there costs money continuously.

This one was found live: a frame the model could not parse stayed unextracted,
so the next tick tried it again, and the next. Every attempt was a real API
call. Nothing was broken loudly enough to notice — the system simply spent, at
four readings a tick, indefinitely.

```ts
// leg 0 — give up on frames that never extract. A frame the vision model
// cannot parse would otherwise retry forever (extracted stays NULL, every
// tick buys more calls on your key — an unbounded spend loop).
.where(and(
  eq(captures.status, "pending"),
  isNull(captures.extracted),
  sql`${captures.createdAt} < now() - interval '60 minutes'`,
))
```

After an hour the frame is parked and a person can still re-trigger it by
hand. The rule generalises: **any retry that costs money needs a stop
condition, and "it will probably succeed eventually" is not one.**

## Keep the evidence, then stop keeping it

A screenshot is a picture of somebody's working screen. It is invaluable for
about a month — when a number is disputed, you can look at what was actually
displayed — and a liability forever.

```ts
const SCREENSHOT_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;
```

The numbers and the verdicts stay. The image is blanked. Decide this before
the first customer asks, not after.

## What to look at when someone says "it stopped"

In order. This list is the whole runbook.

1. **`check.bat` on the machine.** It asks the server what it received from
   *this* machine. Answers most calls in one step.
2. **Heartbeats for that machine.** Silent, or failing? Silent points at the
   machine — signed out, asleep, switched off. Failing tells you which stage.
3. **The queue folder.** Files piling up means captures are happening and
   sends are not: network or token.
4. **`stale_token`?** Somebody re-enrolled that id. Re-run the installer.
5. **The verdicts.** If readings arrive but do not deliver, this is module 6,
   not module 8 — and the reasons say which rule.
6. **`diagnose.bat`.** Changes nothing, prints Windows version, clock, network,
   screen size, power settings and whether the target application is open.
   Ask for a photo of the output; it usually ends the conversation.

Notice that steps 1–5 are answered from your side, without anyone visiting the
machine. That is the point of every mechanism in modules 3 and 4.

## Check

1. Stop the agent on your test machine and let the tolerance pass. The
   watchdog should report it silent, with the hours.
2. Corrupt the stored token — set `BRIDGE_AGENT_TOKEN` to nonsense — and run a
   capture. The send fails with 401, **and** a `stale_token` heartbeat is
   written. Fix it with `install.bat test reenroll`.
3. Feed the extractor a frame it cannot read — a screenshot of an empty
   spreadsheet. Confirm it is parked after an hour rather than retried forever.
4. Run `diagnose.bat` and read every line. Ask yourself, for each one, which
   phone call it prevents.

### If it did not work

| what you see | why |
|---|---|
| no alert from a machine you switched off | the tolerance has not passed yet, or the watchdog is not scheduled |
| alerts every morning | the tolerance is shorter than the normal gap between captures |
| the spend cap never fires | `createdAt` is not being set, or the batch never selects the stuck frame |

## What you have

A system that survives being ignored: it tells you when a machine goes quiet,
it stops spending when it cannot succeed, and it forgets the pictures once
they stop being useful.

---

## You are done

Eight modules. One of them cost money.

Look back at what that one needed to be safe: a capture you can trust
(module 1), on a machine that installs correctly and stays configured
(module 2), that survives a dropped network (module 3) and can prove who it is
(module 4), whose output is measured against ground truth (module 5), checked
against yesterday (module 6), delivered exactly once in someone else's
vocabulary (module 7), and watched when nobody is looking (module 8).

The model reads a screen. Everything else is what makes that reading worth
acting on — and it is all ordinary engineering, which is the good news,
because ordinary engineering is the part you can be sure of.
