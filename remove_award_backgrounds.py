#!/usr/bin/env python3
"""
Remove backgrounds from award photos using rembg (AI-based U2Net model).

Setup (run once):
    pip install rembg pillow

Usage:
    python3 remove_award_backgrounds.py

Input:  public/awards/award-01.webp … award-14.webp
Output: public/awards/award-01.webp … award-14.webp  (replaced in-place, PNG transparency → WebP)

The first run downloads the U2Net ONNX model (~170 MB) automatically.
"""

from pathlib import Path
from rembg import remove
from PIL import Image
import io

AWARDS_DIR = Path(__file__).parent / "public" / "awards"
PATTERN = "award-*.webp"

def process(src: Path) -> None:
    print(f"  Processing {src.name} …", end=" ", flush=True)

    # Read original
    with open(src, "rb") as f:
        raw = f.read()

    # Remove background → returns PNG bytes with transparency
    result_bytes = remove(raw)

    # Open result, convert to RGBA if needed
    img = Image.open(io.BytesIO(result_bytes)).convert("RGBA")

    # Save back as WebP with transparency (lossless alpha, lossy RGB)
    img.save(src, format="WEBP", quality=88, method=6)
    print(f"done  ({src.stat().st_size // 1024} KB)")

def main():
    files = sorted(AWARDS_DIR.glob(PATTERN))
    if not files:
        print(f"No files found matching {AWARDS_DIR / PATTERN}")
        return

    print(f"Found {len(files)} award image(s) in {AWARDS_DIR}\n")
    for f in files:
        process(f)

    print("\nAll done! Refresh your dev server to see the changes.")

if __name__ == "__main__":
    main()
