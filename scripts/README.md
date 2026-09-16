# optimize-images.py

Fixes and compresses the site's photos in place: corrects mislabeled formats,
caps oversized dimensions, and re-encodes JPEGs as **progressive** so they load
in pixelated-then-sharp instead of popping in all at once.

Safe to run as many times as you like — it skips anything already in good shape,
so it never re-compresses the same photo twice.

## Requirements

Just [`uv`](https://docs.astral.sh/uv/). The script declares its own dependency
(Pillow) inline, so there's nothing to install — `uv` handles it on first run.

```bash
brew install uv
```

If `uv: command not found`, add it to your PATH:

```bash
export PATH="$HOME/.local/bin:$PATH"
```

## Usage

Always look first — this reports what it *would* change and touches nothing:

```bash
uv run scripts/optimize-images.py --dry-run
```

Then apply:

```bash
uv run scripts/optimize-images.py
```

Run it from the project root (the folder containing `public/`).

## Adding new photos later

Drop them in `public/works/...` or `public/team/...` and run the script again.
Existing optimized images get skipped automatically; only the new ones are
processed. No need to track what you've already done.

## What counts as "needs work"

A file is rewritten only if it fails at least one check. Everything else is
left **completely untouched**:

| Check | Trigger |
|---|---|
| Wrong format | Real bytes are PNG but the file is named `.jpg` |
| Too large | Wider than `--max-width` (default 1600px) |
| Not progressive | Baseline JPEG over 150KB — no pixelated load-in |
| Bloated | Over 0.30 bytes/pixel, i.e. heavy for its dimensions |

Format is detected by **reading the file's actual content**, never by trusting
the extension.

## What it won't touch

- **`favicon`, `logo`, `icon`, `mark`, `og`, `apple-touch-icon`** — matched by
  filename, since re-encoding these breaks them or wrecks a tiny asset that's
  already small.
- **WebP files** (including ones misnamed `.jpg`). WebP already compresses
  better than JPEG, so converting them to "fix" the extension would make them
  *bigger*. They're only resized if they exceed the width cap, and saved back
  as WebP. The wrong extension is harmless — browsers detect the real type.
- **PNGs with real transparency** stay PNG. Only opaque images become JPEG.

## Options

| Flag | Default | Notes |
|---|---|---|
| `--dry-run` | off | Report only, change nothing |
| `--max-width` | `1600` | Cards render ~380px; 1600 covers retina and hero use |
| `--quality` | `82` | JPEG quality. Below ~75 starts showing artifacts |
| `--folders` | `works team` | Subfolders of `--root` to scan |
| `--root` | `public` | Base folder |
| `--max-bpp` | `0.30` | Bytes-per-pixel bloat threshold |
| `--progressive-min-kb` | `150` | Don't bother making small files progressive |
| `--no-backup` | off | Skip copying originals |
| `--backup-dir` | `.image-originals` | Where originals are copied |

## Backups and undo

Before overwriting anything, the original is copied to `.image-originals/`,
mirroring its path under `public/`. An existing backup is never overwritten, so
your first-run originals survive later runs.

To restore everything:

```bash
cp -R .image-originals/ public/
```

`.image-originals/` is already in `.gitignore` — it's a local safety net, not
something to commit.

> **Don't count on git here.** `.gitignore` contains `public/team/*`, so the
> team photos — the heaviest files in the project — aren't tracked at all.
> For those, `.image-originals/` is your **only** way back. Don't delete it
> until you've confirmed the results, and don't run with `--no-backup` on
> `team` unless the originals exist somewhere else.

## Transparency note

When an image with transparency is converted to JPEG (which has no alpha), it's
flattened onto `#050505` — the site's background — rather than the usual white,
so transparent edges don't turn into bright halos on the dark layout.
