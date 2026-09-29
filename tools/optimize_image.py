"""Resize an image for the site and, for galleries, create its thumbnail.

Requires Pillow:  pip install Pillow

Examples
  # Add a photo to a project's gallery (creates gallery/13.jpg and gallery/thumbs/13.jpg)
  python tools/optimize_image.py photo.png --gallery astria

  # Resize any picture to a given path (e.g. a new cover or hero image)
  python tools/optimize_image.py shot.png assets/img/projects/astria/cover.jpg --width 800
"""
import argparse
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent


def save_jpeg(src: Path, dst: Path, max_width: int, quality: int) -> None:
    im = Image.open(src)
    if im.mode in ("P", "LA", "RGBA"):
        im = im.convert("RGBA")
        background = Image.new("RGB", im.size, (0, 0, 0))
        background.paste(im, mask=im.split()[-1])
        im = background
    im = im.convert("RGB")
    if im.width > max_width:
        im = im.resize((max_width, round(im.height * max_width / im.width)), Image.LANCZOS)
    dst.parent.mkdir(parents=True, exist_ok=True)
    im.save(dst, "JPEG", quality=quality, optimize=True, progressive=True)
    print(f"wrote {dst.relative_to(ROOT)} ({im.width}x{im.height})")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("source", type=Path)
    parser.add_argument("dest", type=Path, nargs="?", help="output path (omit when using --gallery)")
    parser.add_argument("--gallery", metavar="PROJECT", help="append to assets/img/projects/PROJECT/gallery/")
    parser.add_argument("--width", type=int, default=1600)
    args = parser.parse_args()

    if args.gallery:
        gallery = ROOT / "assets/img/projects" / args.gallery / "gallery"
        existing = sorted(p.stem for p in gallery.glob("[0-9]*.jpg"))
        name = f"{int(existing[-1]) + 1 if existing else 1:02d}.jpg"
        save_jpeg(args.source, gallery / name, args.width, 80)
        save_jpeg(args.source, gallery / "thumbs" / name, 640, 75)
    elif args.dest:
        save_jpeg(args.source, args.dest.resolve(), args.width, 80)
    else:
        parser.error("give a destination path or --gallery PROJECT")


if __name__ == "__main__":
    main()
