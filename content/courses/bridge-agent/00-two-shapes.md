# Two shapes

**Read this before module 1.** The rest of the course builds one of these two.
They share every file you will write; they differ only in *where the work
happens*.

---

## vA — with a receiver in the middle

```
machine ──PNG──► receiver ──numbers──► your API
                    │
              read · gate · store
```

The machine captures and uploads. A small service you host does the reading,
the checking and the delivery.

**Why you would:**

- The model's API key never touches the machine. On someone else's PC, in an
  office off a plant floor, that matters.
- Frames are kept for a while, so a disputed number can be looked at.
- One place to watch every machine, and one place to update.
- The machine stays trivial: capture, send, report. Almost nothing to go wrong
  on hardware you cannot see.

**What it costs you:** a service and a database to run, and every secret that
implies. Modules 4 to 8 assume this shape because it is the one with more
moving parts — learn it and the other is a simplification.

## vB — everything on the machine

```
machine ──numbers──► your API
   │
read · gate
```

The machine captures, reads, checks and posts finished numbers itself. There
is no middle.

**Why you would:**

- **Nothing to deploy.** No service, no database, no migrations, no hosting
  plan, no environment variables in someone's dashboard.
- Nothing leaves the machine except the numbers — no screenshot travels.
- No delivery lag: the numbers go out in the same minute they were read.

**What it costs you:**

- **The target API's token now lives on the machine.** That is the same
  objection that keeps the model key off it in vA, and it is the reason vB is
  not automatically the better choice.
- Nobody notices silence. The watchdog in module 8 lives in the receiver; in
  vB a machine that stops has to be missed by whoever reads the numbers.
- Updating means visiting machines instead of redeploying once.
- No frame archive, so a disputed number a week later cannot be checked
  against what was on screen.
- If the source is still pixels, the model key moves to the machine too — and
  then vB has traded one exposed secret for two.

## Choosing

| | vA | vB |
|---|---|---|
| something to host | yes | **no** |
| secrets on the machine | one machine token | the target API token, and the model key if reading pixels |
| notices a machine going quiet | yes, built in | you have to arrange it |
| frames kept for disputes | yes | no |
| updating | redeploy once | visit each machine |
| delivery lag | a scheduling tick | none |

The honest rule of thumb: **vB gets much simpler if the numbers do not come
from pixels.** If the application writes a file, or exports on a schedule, or
the device speaks a protocol, then vB has no model key, no frames worth
keeping, and almost nothing left to go wrong — and hosting a service to do
that work is hard to justify.

If you are reading a screen, vA is usually the better trade, and the reason is
one line: a key that spends money should not sit on a machine you do not
control.

## What actually changes between them

Only three modules, and only partly.

| module | vA | vB |
|---|---|---|
| 1–3 capture, kit, queue | identical | identical |
| 4 identity | enrol against the receiver, per-machine token | no enrolment; the machine's identity is its config, and the API token is provisioned with it |
| 5 read | on the receiver, its key | on the machine, its key |
| 6 gate | on the receiver, anchored on stored history | on the machine, anchored on the last reading kept on disk |
| 7 deliver | receiver → API, with retry | machine → API, with the same queue as module 3 |
| 8 operate | watchdog, retention, spend cap | spend cap locally; silence must be noticed elsewhere |

The source spec, the target spec and the agent kit are **the same files** in
both. That is the point of keeping domain knowledge in data: you can start
with a receiver and remove it later, or start without one and add it when the
second customer arrives, and nothing you wrote gets thrown away.

## The course builds vA

Because it is the larger of the two, and every piece of it appears in vB. When
a module has a vB variant that differs, it says so in a note like this one:

> **vB:** the same check, run on the machine, against the previous reading
> stored beside the agent instead of in a database.

**Next:** [Module 1 — find the window and capture it](01-capture.md).
