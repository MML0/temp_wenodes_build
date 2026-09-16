#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.9"
# dependencies = ["pillow>=10.0"]
# ///
"""
Optimize site images in place: fix mislabeled formats, cap dimensions,
and re-encode JPEGs as progressive (the pixelated-then-sharp load).

Safe to re-run: files that already pass every check are skipped untouched,
so repeated runs never re-compress and degrade an image.

  uv run scripts/optimize-images.py --dry-run
  uv run scripts/optimize-images.py
"""

import argparse
import shutil
import sys
from pathlib import Path

from PIL import Image

JPEG_EXTS = {".jpg", ".jpeg"}
IMAGE_EXTS = JPEG_EXTS | {".png"}

# Names that must never be touched - re-encoding these breaks them or
# visibly degrades a tiny asset that is already small.
SKIP_NAMES = {"favicon", "logo", "icon", "apple-touch-icon", "og", "mark"}


def is_protected(path: Path) -> bool:
    stem = path.stem.lower()
    return any(k in stem for k in SKIP_NAMES) or any(
        k in p.lower() for p in path.parts for k in ("favicon", "logo")
    )


def bytes_per_pixel(path: Path, size) -> float:
    w, h = size
    return path.stat().st_size / max(w * h, 1)


def inspect(path: Path):
    """Real format, dimensions, progressive flag, alpha - from content, not extension."""
    with Image.open(path) as im:
        return {
            "format": im.format,
            "size": im.size,
            "progressive": "progressive" in im.info or "progression" in im.info,
            "has_alpha": im.mode in ("RGBA", "LA", "P") and "transparency" in im.info
            or im.mode in ("RGBA", "LA"),
        }


def decide(path: Path, info, args):
    """Return a list of reasons this file needs work. Empty list means skip."""
    ext = path.suffix.lower()
    reasons = []

    ext_says_jpeg = ext in JPEG_EXTS
    really_jpeg = info["format"] == "JPEG"

    # WebP under a .jpg name is mislabeled but harmless - browsers sniff the
    # real type. It also compresses better than JPEG, so "fixing" the label
    # by re-encoding would make the file bigger. Leave the format alone and
    # only touch it if the dimensions are actually too big.
    if info["format"] == "WEBP":
        if info["size"][0] > args.max_width:
            return [f"{info['size'][0]}px wide > {args.max_width}px (kept as WebP)"]
        return []

    if ext_says_jpeg and not really_jpeg:
        reasons.append(f"mislabeled {info['format']} named {ext}")

    if info["size"][0] > args.max_width:
        reasons.append(f"{info['size'][0]}px wide > {args.max_width}px")

    # Only ask for progressive on files that will end up as JPEG and are big
    # enough for the staged load to be perceptible.
    will_be_jpeg = really_jpeg or (ext_says_jpeg and not info["has_alpha"])
    if will_be_jpeg and not info["progressive"]:
        if path.stat().st_size >= args.progressive_min_kb * 1024:
            reasons.append("baseline JPEG (no pixelated load-in)")

    # Bloated for its dimensions - a well-encoded photo sits well under this.
    bpp = bytes_per_pixel(path, info["size"])
    if really_jpeg and bpp > args.max_bpp:
        reasons.append(f"{bpp:.2f} bytes/px > {args.max_bpp}")

    return reasons


def process(path: Path, info, args) -> int:
    """Rewrite the file. Returns new size in bytes."""
    with Image.open(path) as im:
        im.load()

        if info["size"][0] > args.max_width:
            ratio = args.max_width / im.width
            im = im.resize(
                (args.max_width, round(im.height * ratio)), Image.LANCZOS
            )

        ext = path.suffix.lower()
        keep_png = ext == ".png" and info["has_alpha"]

        if info["format"] == "WEBP":
            im.save(path, "WEBP", quality=args.quality, method=6)
        elif keep_png:
            im.save(path, "PNG", optimize=True)
        else:
            if im.mode in ("RGBA", "LA", "P"):
                # Flatten onto the site background rather than white, so any
                # transparent edge does not turn into a bright halo.
                bg = Image.new("RGB", im.size, (5, 5, 5))
                im = im.convert("RGBA")
                bg.paste(im, mask=im.split()[-1])
                im = bg
            elif im.mode != "RGB":
                im = im.convert("RGB")

            im.save(
                path,
                "JPEG",
                quality=args.quality,
                progressive=True,
                optimize=True,
                subsampling="4:2:0",
            )

    return path.stat().st_size


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--root", default="public", help="base folder (default: public)")
    p.add_argument(
        "--folders",
        nargs="+",
        default=["works", "team"],
        help="subfolders of root to process (default: works team)",
    )
    p.add_argument("--max-width", type=int, default=1100)
    p.add_argument("--quality", type=int, default=82)
    p.add_argument("--max-bpp", type=float, default=0.30, help="bytes/pixel bloat limit")
    p.add_argument("--progressive-min-kb", type=int, default=150)
    p.add_argument("--dry-run", action="store_true", help="report only, change nothing")
    p.add_argument("--no-backup", action="store_true")
    p.add_argument(
        "--backup-dir", default=".image-originals", help="where originals are copied"
    )
    args = p.parse_args()

    root = Path(args.root).resolve()
    if not root.is_dir():
        sys.exit(f"not a directory: {root}")

    targets = []
    for folder in args.folders:
        base = root / folder
        if not base.is_dir():
            print(f"  ! skipping missing folder: {base}")
            continue
        targets += [
            f
            for f in sorted(base.rglob("*"))
            if f.is_file() and f.suffix.lower() in IMAGE_EXTS
        ]

    if not targets:
        sys.exit("no images found")

    backup_root = Path(args.backup_dir).resolve()
    scanned = skipped = changed = failed = 0
    before_total = after_total = 0

    print(f"scanning {len(targets)} images under {root}")
    print(f"max width {args.max_width}px | quality {args.quality} | progressive on\n")

    for path in targets:
        scanned += 1
        rel = path.relative_to(root)

        if is_protected(path):
            skipped += 1
            continue

        try:
            info = inspect(path)
        except Exception as e:
            print(f"  ! unreadable {rel}: {e}")
            failed += 1
            continue

        reasons = decide(path, info, args)
        if not reasons:
            skipped += 1
            continue

        before = path.stat().st_size
        print(f"  {rel}")
        print(f"      {', '.join(reasons)}")

        if args.dry_run:
            before_total += before
            changed += 1
            continue

        if not args.no_backup:
            dest = backup_root / rel
            dest.parent.mkdir(parents=True, exist_ok=True)
            if not dest.exists():  # never overwrite a pristine original
                shutil.copy2(path, dest)

        try:
            after = process(path, info, args)
        except Exception as e:
            print(f"      ! failed: {e}")
            failed += 1
            continue

        before_total += before
        after_total += after
        changed += 1
        pct = (1 - after / before) * 100 if before else 0
        print(f"      {before/1e6:.2f}MB -> {after/1e6:.2f}MB  ({pct:+.0f}%)")

    print()
    print(f"scanned {scanned} | already fine {skipped} | changed {changed} | failed {failed}")
    if args.dry_run:
        print(f"dry run - {before_total/1e6:.1f}MB would be reprocessed")
        print("re-run without --dry-run to apply")
    elif changed:
        saved = before_total - after_total
        print(f"{before_total/1e6:.1f}MB -> {after_total/1e6:.1f}MB (saved {saved/1e6:.1f}MB)")
        if not args.no_backup:
            print(f"originals copied to {backup_root}")


if __name__ == "__main__":
    main()
