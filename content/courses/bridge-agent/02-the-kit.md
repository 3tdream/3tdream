# Module 2 — The kit: install, run, check

**You build:** the five commands someone else runs on a machine you will never
touch, and a scheduled task that keeps working after they walk away.

**Model needed:** none. **Cost:** none.

---

## The situation you are actually designing for

The machine belongs to someone else. It sits in an office next to a plant
floor. The person who installs your agent is not a developer, will do it once,
and will not read a manual afterwards. If something breaks in three weeks, the
only diagnosis you get is a phone call saying "it stopped working".

Everything below follows from that.

## Five commands, one question each

Look at `agent/`. Each file answers exactly one question, and its name is the
question.

| command | the question |
|---|---|
| `install.bat` | put it on this machine, or re-apply the settings |
| `start.bat` | take one capture right now |
| `check.bat` | what did the server actually receive from this machine? |
| `diagnose.bat` | what is wrong with this machine? (changes nothing) |
| `uninstall.bat` | take it off cleanly |

Five is not a target, it is what is left after you remove everything that
could be a flag on something else. Resist adding a sixth.

## Installing must be boring

Run it:

```
install.bat test
```

A finished install ends like this:

```
[1/5] files copied
[2/5] config written
[3/5] token stored (Machine scope)
[4/5] scheduled task 'Bridge capture' registered
[4b/5] retry task 'Bridge capture-flush' registered
[5/5] self-test skipped
```

Note the last line. **Installing sends nothing.**

That is deliberate and it is the least obvious decision in the whole kit.
Install is the step you repeat every time a setting changes, so it must not:

- spend a capture (in module 5, a capture costs real money),
- rotate this machine's token (module 4 — a machine that silently gets a new
  token stops being able to talk, and nobody finds out for a day),
- or send anything to a production endpoint from a machine being set up.

Proof belongs to `start.bat`, which the operator runs when *they* are ready.

## The scheduled task

```powershell
Get-ScheduledTask -TaskName 'Bridge capture' | Get-ScheduledTaskInfo
```

Two rules that cost real days to learn:

**The user must stay signed in.** The capture reads a window, and a window
only exists inside a logged-in session. Locking the screen is fine — the
session is alive, the window is still drawn. Signing out is not.

**Sleep must be off on mains power.** A machine asleep at the scheduled minute
does not capture. Not late — never.

`diagnose.bat` checks both, along with the clock, the network and the screen
width, and prints them in one screen you can ask someone to photograph and
send you. That is the whole reason it exists.

## Configuration lives in one file, applied by one command

The operator edits `agent/agent.env` and the two `config/Agent_config.*.txt`
files. Nothing else.

And here is the rule that surprises everyone, including the person who wrote
it:

> **Editing a config file changes nothing by itself.** The agent keeps its own
> copy. Re-run `install.bat` to apply the edit.

That is a deliberate trade. The alternative — the agent re-reading the file at
every run — means a typo saved at 4 pm silently changes what happens at 23:59,
with nobody watching. Applying an edit through `install.bat` gives the change
a moment where a human is present and the tool can refuse:

```
file_path 'C:\nope\book.xlsx' does not exist on THIS PC
```

A wrong target caught at install is a corrected line. A wrong target caught at
capture is a phone call three days later.

## Check

1. `install.bat test` — ends with the five lines above, and **nothing was
   sent**.
2. Task Scheduler shows `Bridge capture`, with the time from your config file.
3. Change `Snapshot_Time`, run `install.bat test` again, and confirm the task's
   trigger moved. Re-running install is safe and repeatable — prove that to
   yourself now, because you will do it often.
4. `start.bat` → option 1 (dry) → a PNG appears. `check.bat` says the server
   has nothing yet, which is correct: you have not sent anything.

### If it did not work

| what you see | why |
|---|---|
| `Please run as administrator` | registering a scheduled task needs it. Right-click → Run as administrator |
| `agent.env is missing` | you skipped the copy from `agent.env.example` |
| install refuses and names a line | it means it — the value cannot be used. Fix that line |
| the task exists but never fires | the user is signed out, or the machine sleeps. `diagnose.bat` will say which |

## What you have

Something a stranger can install correctly, and that tells them what is wrong
when they do not. That is worth more than any feature you could add instead.

**Next:** [Module 3 — the network will drop](03-unreliable-network.md).
