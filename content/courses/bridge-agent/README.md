# Build a bridge agent

Eight modules. By the end you have an agent that reads numbers off a desktop
application nobody will give you an API for, checks them, and posts them to
your own endpoint — running unattended on a machine you are not sitting at.

You build it against a **sandbox**: a synthetic screen this repository
generates, with the correct answers written down beside it. So "did it read
the screen right" is a comparison, never an opinion.

## What you need

- Windows 10 or 11, PowerShell, Excel (or LibreOffice Calc)
- Node 20+ for the receiving side, from module 5
- An Anthropic API key — **only for module 5**, about $0.02 per reading

## The modules

| # | you build | model needed | cost |
|---|---|---|---|
| 0 | [Two shapes: with a receiver, or without](00-two-shapes.md) | no | — |
| 1 | [Find the window and capture it](01-capture.md) | no | — |
| 2 | [The kit: install, run, check](02-the-kit.md) | no | — |
| 3 | [Survive an unreliable network](03-unreliable-network.md) | no | — |
| 4 | [Give the machine an identity](04-machine-identity.md) | no | — |
| 5 | [Read the screen](05-read-the-screen.md) | **yes** | ~$0.02 per reading |
| 6 | [Decide what to trust](06-decide-what-to-trust.md) | no | — |
| 7 | [Deliver, and mean it](07-deliver.md) | no | — |
| 8 | [Operate it when you are not looking](08-operate-it.md) | no | — |

**Seven of the eight cost nothing to run.** That is not a discount, it is the
shape of the problem: reading pixels is one step, and everything around it —
capturing reliably, surviving a dropped network, proving which machine sent
what, deciding whether a number is believable, delivering exactly once — is
ordinary engineering that you can build and test for free.

Bring your own key in module 5. You will watch the cost per reading with your
own eyes, on your own account, which is the only way that number ever means
anything.

## Two shapes

There are two ways to build this, and they share every file you write. **vA**
puts a small receiving service in the middle; **vB** does everything on the
machine and posts finished numbers straight to your API.

The course builds vA, because it is the larger of the two and every piece of
it appears in vB. Where they differ, the module says so in a `vB` note.
[Read the comparison first](00-two-shapes.md) — the choice affects which
secrets end up on a machine you do not control.

## How each module ends

With a **check you run**, not a paragraph saying it should work. If the check
does not pass, the module tells you which of the usual three things went
wrong. Every one of those was met in production before it was written down.

## Measuring, not guessing

Two scripts in this folder do the work no prose can:

- `course/score-extraction.mjs` — scores a reading against the sandbox's
  ground truth, cell by cell, and names the mirrored-table failure when it
  sees one.
- `course/check-references.mjs` — fails if any module names a file or links
  to a page that does not exist. A course that teaches a renamed command
  teaches a lie, and the reader blames themselves.

## A note on where this comes from

The agent you are building is real. It runs unattended on production machines,
reads a screen once a day, and has survived a fourteen-hour network outage
without losing a reading. The mistakes described in these modules are mistakes
that were actually made — a splash screen captured as a 5 KB "success", a
scrolled window read as a wrong screen, a token rotated by accident on a
machine that then went quiet for a day.

You are not being taught the clean version. You are being taught the one that
survived contact.
