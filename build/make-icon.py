"""Generates the app icon: a neon hexagon with a lightning-bolt glyph.

    python build/make-icon.py      -> build/icon.ico, build/icon.png
"""
import os
from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
VOID = (7, 4, 15, 255)
PANEL = (27, 17, 49, 255)
YELLOW = (246, 236, 19, 255)
CYAN = (0, 229, 255, 255)
MAGENTA = (255, 42, 109, 255)


def hexagon(S, inset):
    m = inset
    return [(S * 0.25 + m * 0.5, S * 0.03 + m), (S * 0.75 - m * 0.5, S * 0.03 + m), (S - m, S / 2),
            (S * 0.75 - m * 0.5, S * 0.97 - m), (S * 0.25 + m * 0.5, S * 0.97 - m), (m, S / 2)]


def icon(size):
    S = size * 4
    img = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.polygon(hexagon(S, 0), fill=YELLOW)
    d.polygon(hexagon(S, S * 0.06), fill=VOID)
    d.polygon(hexagon(S, S * 0.10), fill=PANEL)
    bolt = [(0.56, 0.16), (0.30, 0.56), (0.47, 0.56), (0.42, 0.84), (0.70, 0.42), (0.53, 0.42), (0.60, 0.16)]
    off = S * 0.025
    d.polygon([(x * S - off, y * S) for x, y in bolt], fill=MAGENTA)
    d.polygon([(x * S + off, y * S) for x, y in bolt], fill=CYAN)
    d.polygon([(x * S, y * S) for x, y in bolt], fill=YELLOW)
    return img.resize((size, size), Image.LANCZOS)


big = icon(256)
big.save(os.path.join(HERE, 'icon.png'))
big.save(os.path.join(HERE, 'icon.ico'), sizes=[(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
print('icon written')
