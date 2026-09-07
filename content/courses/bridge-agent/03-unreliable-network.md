# Module 3 — Survive an unreliable network

**You build:** a capture that still happens when the network is down, and
arrives by itself when it comes back.

**Model needed:** none. **Cost:** none.

---

## The failure this exists for

The scheduled capture fires at 23:59. The site's connection is down. If your
agent treats that as an error, the day is gone — and it is gone permanently,
because the screen showed a daily total that resets at midnight. There is no
"try again in the morning". The number no longer exists.

So the capture and the upload have to be separate things.

## Capture first, send second

In `agent/src/capture.ps1` the send is wrapped, and the failure path writes to
disk instead of throwing:

```powershell
try {
  Send-Run $cfg $token $json
  Log "sent: $runId"
} catch {
  Send-Heartbeat $cfg $token "upload_failed" $_.Exception.Message
  New-Item -ItemType Directory -Force $cfg.queueDir | Out-Null
  [IO.File]::WriteAllText(
    (Join-Path $cfg.queueDir "$runId.json"), $json,
    (New-Object System.Text.UTF8Encoding($false)))
  Log "send failed - queued $runId"
  exit 1
}
```

Three details in there are not obvious.

### `UTF8Encoding($false)` — no byte-order mark

A queued run is replayed later as an HTTP body. PowerShell's default UTF-8
writer prepends a BOM, and a BOM before the first `{` is a parse error on any
server that does not strip it. The capture that survived the outage would then
be rejected on arrival — the worst possible place to discover it.

### The heartbeat goes out *before* the queue write

If the network is down, that heartbeat fails too. That is fine. What matters
is the ordering when the network is only *half* down — the upload times out
but a small POST gets through. Then the server learns the machine is alive and
struggling, which is a completely different alarm from silence.

### `exit 1`

The scheduled task should record a failed run. The capture was saved, but it
has not been delivered, and pretending otherwise is how a queue quietly grows
to a thousand files.

## The flush task

Installing registers a *second* scheduled task, `Bridge capture-flush`, every
15 minutes:

```powershell
powershell -File C:\bridge-agent\capture.ps1 -FlushOnly
```

Read what `-FlushOnly` does at the top of the script:

```powershell
if ($FlushOnly) {
  $before = @(Get-ChildItem $cfg.queueDir -Filter *.json).Count
  if ($before -eq 0) { exit 0 }
  Flush-Queue $cfg $token
  ...
}
```

It exits **before any window code**. It never touches the screen, never brings
anything to the foreground, never interrupts whoever is using that machine.
And with an empty queue it exits silently: 96 no-op runs a day leave no log
lines, no heartbeats, no trace.

An operations feature that is noisy when nothing is wrong gets disabled.

## Why 15 minutes and not 1

The recovery deadline is not "instantly", it is "before anyone notices". A
daily reading that arrives 15 minutes after the network returns is on time by
every measure that matters, and a quarter-hourly wake-up is cheap enough that
nobody thinks about it. One minute would be 1,440 wake-ups a day to save
fourteen minutes nobody was waiting on.

## Check

Do this for real. It takes four minutes and it is the only way to believe it.

1. Break the network to your receiver — pull the cable, turn off Wi-Fi, or add
   a bogus entry for its host in `C:\Windows\System32\drivers\etc\hosts`.
2. `start.bat` → option 2 (real capture). It should say **`send failed -
   queued`** and exit non-zero.
3. Look in `C:\bridge-agent\queue\` — one `.json` file, named for the run.
4. `check.bat` — it reports how many captures are waiting and which is oldest.
5. Restore the network. Either wait for the flush task, or run it by hand:
   ```powershell
   powershell -File C:\bridge-agent\capture.ps1 -FlushOnly
   ```
6. The queue folder is empty. `check.bat` now shows the reading arrived.

**The capture you took while disconnected is the one that arrived.** Not a
retry, not a fresh capture of a screen that has since changed — that exact
frame, from that exact minute.

### If it did not work

| what you see | why |
|---|---|
| queue file written, flush never drains it | the token is wrong, not the network. Check `check.bat`, and module 4 |
| the server rejects the replayed run | a BOM on the queue file — see above |
| the queue keeps growing | every send is failing. Fix the cause; the queue is a buffer, not a fix |

## What you have

An agent whose worst network day costs 15 minutes instead of a day of data.
This one is not theoretical: the production system this comes from lost its
connection for fourteen hours and did not lose a single reading.

**Next:** [Module 4 — who is this machine?](04-machine-identity.md)
