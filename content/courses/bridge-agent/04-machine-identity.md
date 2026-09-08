# Module 4 — Give the machine an identity

**You build:** a machine that proves which one it is, with a secret it fetched
itself and that you never had to send anyone.

**Model needed:** none. **Cost:** none.

---

> **vB — no receiver:** there is nothing to enrol against, so this module
> becomes provisioning instead of exchange. The machine's identity is the
> `machine_id` in its config, and its credential is the target API's token,
> placed the same way a machine token is here: as a file next to the
> installer, into a Machine-scope variable, deleted afterwards. Read the rest
> of this module anyway — the rotation trap and the reason a machine must be
> able to say "my credential is stale" apply to any secret on a machine you
> do not control.

## Why not one shared key

The obvious design is one API key in every install. It works until the day you
need any of these:

- a leaked key revoked without visiting every site,
- an answer to "which machine sent this reading?",
- one machine disabled while the rest keep working,
- an alert saying *that* machine has gone quiet.

None of those is possible with a shared secret. All of them are free with one
credential per machine.

## Enrolment: the machine fetches its own secret

The operator types an **enrol key** once, at install. The machine exchanges it
for a token of its own. Read `packages/server/app/api/enroll/route.ts`:

```ts
if (!safeSecretEq(body.enrollKey, ENV.enrollKey())) {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}
const target = targetForMachine(machineId);
...
const token = newMachineToken();
await db.insert(machines).values({ machineId, tokenHash: sha256Hex(token), ... });
return NextResponse.json({ ok: true, token, target, source, ingest });
```

Four things worth stopping on.

**The token is returned once and never stored in readable form.** The server
keeps `sha256Hex(token)`. Lose it and you re-enrol; there is nothing to look
up, for you or for anyone who gets into the database.

**`safeSecretEq`, not `===`.** Constant-time comparison. An attacker who can
measure your response times should not be able to learn your key one character
at a time.

**The machine id must already be configured.** `targetForMachine` looks it up
in `config/targets/`. An unknown machine is refused. Enrolment authenticates
the *installer*; configuration decides *what that machine is allowed to be*.

**The response carries the settings too** — which columns, which fields, which
schedule, where to post. So changing a target's configuration on the server
reaches the machine on its own. No second visit.

## Where the token lives on the machine

A Machine-scope environment variable, not a file:

```powershell
[Environment]::SetEnvironmentVariable("BRIDGE_AGENT_TOKEN", $token, "Machine")
```

Not in the install folder, so copying that folder to another machine copies no
secret. Not in the user's profile, so it survives a different operator signing
in. Readable only with administrator rights, which is what installing it took
anyway.

And the token never travels as text a human handles. In production it moves as
a file — `TOKEN-<machine-id>.txt` placed next to the installer, deleted after —
never pasted into a chat window, and never typed on a command line, because a
command line is readable by any process listing on that machine.

## Rotation, and the failure it creates

Re-running enrolment issues a fresh token and invalidates the old one. That is
how you replace a leaked credential: run the installer again on that machine.

It is also a trap, and the kit is shaped around it:

> Enrolling a machine id that is **already installed somewhere** silently
> takes that machine offline. It keeps presenting a token the server has just
> replaced, gets 401 on every send, and nobody finds out until the readings
> stop.

This is why `install.bat` does not re-enrol by default, why re-enrolment is an
explicit `install.bat prod reenroll`, and why you must never call `/api/enroll`
from curl with a real machine id just to see what it says.

## The heartbeat that saves you

A machine with a stale token cannot authenticate — so how does it tell you?
Look at `app/api/heartbeat/route.ts`:

```ts
if (!auth.ok) {
  if (claimed && auth.reason === "auth_invalid") {
    const [known] = await db.select(...).where(eq(machines.machineId, claimed));
    if (known && (await rateOk(claimed))) {
      await db.insert(heartbeats).values({
        machineId: claimed, status: "stale_token",
        detail: "agent presented a token that does not match — run `install.bat prod reenroll` on this PC, as administrator, to issue a fresh one",
      });
    }
  }
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}
```

A **known** machine presenting a **wrong** token still gets a row written,
then is refused. Without that, a rotation makes the machine invisible exactly
when someone needs to be told to fix it — silence, indistinguishable from a
machine that is simply off.

The rate limit is there because an unauthenticated caller can write those rows.

## Check

Use the reference receiver, or your own.

1. Wrong key:
   ```bash
   curl -X POST https://<receiver>/api/enroll \
     -H "content-type: application/json" -d '{}'
   ```
   → `401 {"error":"unauthorized"}`

2. Right key, machine that is not configured:
   ```bash
   curl -X POST https://<receiver>/api/enroll -H "content-type: application/json" \
     -d '{"enrollKey":"<key>","machineId":"nobody-pc9"}'
   ```
   → `404 no_target_for_machine`, and the hint lists the ids it does know.

3. Right key, a configured machine → `200` with a token, the target's
   settings, and the ingest URL. **That token is shown once.**

4. Send an ingest with a deliberately wrong token → `401`. Then look at the
   heartbeats table: a `stale_token` row for that machine.

Step 4 is the one to actually do. It is the difference between an agent that
fails loudly and one that disappears.

### If it did not work

| what you see | why |
|---|---|
| `500 no_targets_loaded` | the *server* is misconfigured — it loaded zero target files. Not your machine id |
| `404` on an id you are sure about | compare it character by character with the `machine_id` in the target file |
| enrolled, but every send is 401 | something re-enrolled that id afterwards. See rotation, above |

## What you have

Every reading traceable to one machine; any machine revocable on its own; and
a machine that has lost its credential saying so instead of going quiet.

**Next:** module 5 — reading the screen. This is where you bring your own API
key, and where you find out how accurate any of this is, because the sandbox
wrote the answers down in module 1.
