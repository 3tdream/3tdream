# Module 1 — Find the window and capture it

**You build:** a script that finds one specific application window on this
machine and saves exactly what it shows to a PNG.

**Model needed:** none. **Cost:** none.

---

## Build the sandbox first

You need a screen to read that is not a customer's.

The sandbox is **free and stands alone** —
[github.com/3tdream/bridge-agent-sandbox](https://github.com/3tdream/bridge-agent-sandbox),
MIT, three files, no account. Clone it and work from there, or use the copy in
this repository at `agent/src/mock/` if you have it:

```powershell
powershell -ExecutionPolicy Bypass -File agent\src\mock\build-mock.ps1 -Seed 11
```

Two files appear next to the script:

- `grid-mock.xlsx` — a workbook that looks like an industrial control screen:
  one column per unit, row labels down the side, values that change every time
  you rebuild it.
- a **ground-truth JSON** — the exact values it drew.

That second file is the point of this whole course. Later you will ask a model
to read the screen, and you will be able to say *11 of 12 correct, and here is
the cell that was wrong*, instead of *looks about right*.

Open the workbook and leave it open.

## The four things that make a capture reliable

Read `agent/src/capture.ps1` alongside this. It is the real thing, not a
teaching copy.

### 1. Find the window by TITLE, not by process

```powershell
Get-Process -Name $cfg.target.processName |
  Where-Object { $_.MainWindowHandle -ne 0 } |
  Where-Object { $_.MainWindowTitle -match $cfg.target.windowTitleRegex }
```

A process that has *some* window is not the screen you contracted to read. An
application starting up shows a splash and an "Opening…" window on its way. In
production, grabbing one of those produced a **5 KB capture of nothing that
still looked like a success** — the run uploaded, the server accepted it, and
the failure only surfaced a day later as a reading nobody could explain.

Match the title. Nothing else identifies the screen.

### 2. Maximise before you shoot

```powershell
[Win32]::ShowWindow($hwnd, 3)          # SW_MAXIMIZE
[Win32]::SetForegroundWindow($hwnd)
Start-Sleep -Milliseconds 900          # let it repaint
```

Every extra pixel per cell is accuracy. At 88% correct, the errors were not
wild — they were digit-level misreads on small text. Maximising is not
cosmetic; it is the cheapest accuracy you will ever buy.

The 900 ms matters too. A window that has just been resized is still painting.

### 3. `PrintWindow`, not a screen grab

```powershell
[Win32]::PrintWindow($hwnd, $hdc, 2)   # PW_RENDERFULLCONTENT
```

A screen grab captures whatever is on top — a notification, a colleague's chat
window, a screensaver. `PrintWindow` asks the window itself to draw. Flag `2`
is what makes it work for windows the compositor owns; without it modern
applications come back blank.

### 4. Refuse rather than guess

```powershell
if ($w -le 0 -or $h -le 0) { throw "window rect is empty ($w x $h)" }
```

An empty rectangle means the window is minimised or gone. A capture that
cannot be trusted must fail loudly here, not travel onward as a valid-looking
PNG.

## Run it

Nothing is installed yet — module 2 does that. For now run the script where it
sits in the repository, against a config of your own. Copy the example and
point it at the workbook you just opened:

```powershell
copy agent\src\config.example.json agent\src\config.json
```

Two values in it matter here, and they are the ones §1 is about. The example
ships placeholders on purpose, so this is your first look at the only thing
that identifies the screen:

```json
"target": {
  "processName": "EXCEL",
  "windowTitleRegex": "grid-mock"
}
```

`processName` is the process without `.exe`; `windowTitleRegex` matches the
title bar. If you have other workbooks open, that regex is what keeps this from
capturing one of them. Then:

```powershell
powershell -ExecutionPolicy Bypass -File agent\src\capture.ps1 `
  -ConfigPath agent\src\config.json -DryRun
```

`-DryRun` captures and writes to disk, and sends nothing. Everything in this
course that touches a network has a switch like this. Build the habit now.

> From module 2 onwards the same script runs from `C:\bridge-agent\capture.ps1`,
> where `install.bat` puts it with a config it writes for you, and you no longer
> pass `-ConfigPath`.

## Check

1. The output names a folder and a byte count. **A capture under 20 KB is not
   your screen** — it is a splash, a minimised window, or an empty rectangle.
2. Open the PNG. You should see the whole grid: column headers along the top,
   row labels down the side, and no other application in front of it.
3. Compare a few cells against the ground-truth JSON from the sandbox. They
   should agree exactly — you are only comparing *your eyes* to it at this
   stage.

### If it did not work

| what you see | why |
|---|---|
| `cannot find path ... config.json` | you skipped the `copy` above, or ran it from somewhere other than the repository root |
| `target window not present` | the workbook is closed, or `windowTitleRegex` does not match its title. Check the title bar, literally |
| a tiny PNG | you captured a splash or a minimised window — see §1 |
| a black or blank PNG | `PrintWindow` without flag `2`, or a window that was never painted |
| the right window, but scrolled | the sheet was left scrolled away from the header. Module 2 handles this |

## What you have

A capture you can trust to be of the right window, at the largest size that
window can be, drawn by the window itself. Everything from here on assumes
that — which is why it is worth getting exactly right before moving on.

**Next:** [Module 2 — the kit](02-the-kit.md). This machine is not yours, and
you will not be sitting at it.
