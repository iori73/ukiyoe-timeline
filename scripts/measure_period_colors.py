"""
Measure how much of each print is covered by each of the 9 canonical colour slots.

Method (docs/specs/artwork-selection.md, 「色の決め方」):
  1. Which slots a work USES is not decided here. Pixels cannot tell indigo from Prussian
     blue, and beni / dayflower blue fade to brown or grey. The input says, per work, which
     blue it has ("blue": "ai" | "bero" | "none"), from museum records and technique history.
  2. Proportions ARE measured: the paper ground (estimated from the image border) is removed,
     then every remaining pixel goes to the nearest slot by CIEDE2000. Blue pixels are given
     to the blue named in the input.
  3. Results describe the prints as they survive today (faded), not as first printed.
  4. Mica (gin) cannot be measured from photographs (it reads as light paper); like the blues,
     it has to come from the records. Light hue-less pixels are treated as paper.

Validation (2026-11-08): 4 ink-only prints (AIC 1942.60, 1925.1688, 1925.1689, 1925.1702)
measure 99.7–99.98% sumi. Colour prints not yet validated.

Usage:
  python scripts/measure_period_colors.py works.json out.json
  works.json: [{"id": "...", "era": "01", "path": "local/image.jpg", "blue": "ai|bero|none", "allowed": ["sumi", ...]}, ...]
Images are read from local files only (nothing is downloaded).
"""
import json
import sys

import numpy as np
from PIL import Image

# Same values as src/data/v2/eras.js SLOTS (10 slots; 丹 added 2026-11-09)
SLOTS = [
    ("sumi", "#1a1a1a"), ("tan", "#d27a3f"), ("beni", "#c04545"), ("kin", "#c9a050"), ("midori", "#7a9060"),
    ("ao", "#607888"), ("ai", "#2a3848"), ("bero", "#2d4f6e"), ("gin", "#b8b0a4"), ("hada", "#d9c5b8"),
]
BLUES = {"ai", "bero"}
GROUND_DE = 10.0  # pixels this close to the border's typical colour count as paper ground
MAX_SIDE = 600
ACHROMATIC_C = 12.0  # Lab chroma below this = no hue (ink greys, paper shading)
INK_L = 62.0         # hue-less and darker than this = ink (墨); lighter = paper, excluded
EDGE = 0.05          # inner crop on each side before measuring (sheet edges are often damaged)


def srgb_to_lab(rgb):
    """rgb: (...,3) floats 0..1 -> CIE Lab (D65)."""
    c = np.where(rgb <= 0.04045, rgb / 12.92, ((rgb + 0.055) / 1.055) ** 2.4)
    m = np.array([[0.4124564, 0.3575761, 0.1804375],
                  [0.2126729, 0.7151522, 0.0721750],
                  [0.0193339, 0.1191920, 0.9503041]])
    xyz = c @ m.T / np.array([0.95047, 1.0, 1.08883])
    f = np.where(xyz > (6 / 29) ** 3, np.cbrt(xyz), xyz / (3 * (6 / 29) ** 2) + 4 / 29)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], -1)


def ciede2000(lab1, lab2):
    """Vectorised CIEDE2000 between lab1 (N,3) and lab2 (3,)."""
    L1, a1, b1 = lab1[:, 0], lab1[:, 1], lab1[:, 2]
    L2, a2, b2 = lab2
    C1, C2 = np.hypot(a1, b1), np.hypot(a2, b2)
    Cb = (C1 + C2) / 2
    G = 0.5 * (1 - np.sqrt(Cb ** 7 / (Cb ** 7 + 25 ** 7)))
    a1p, a2p = (1 + G) * a1, (1 + G) * a2
    C1p, C2p = np.hypot(a1p, b1), np.hypot(a2p, b2)
    h1p = np.degrees(np.arctan2(b1, a1p)) % 360
    h2p = np.degrees(np.arctan2(b2, a2p)) % 360
    dLp, dCp = L2 - L1, C2p - C1p
    dh = h2p - h1p
    dh = np.where(C1p * C2p == 0, 0, np.where(dh > 180, dh - 360, np.where(dh < -180, dh + 360, dh)))
    dHp = 2 * np.sqrt(C1p * C2p) * np.sin(np.radians(dh / 2))
    Lbp, Cbp = (L1 + L2) / 2, (C1p + C2p) / 2
    hs = h1p + h2p
    hbp = np.where(C1p * C2p == 0, hs, np.where(np.abs(h1p - h2p) > 180, np.where(hs < 360, (hs + 360) / 2, (hs - 360) / 2), hs / 2))
    T = 1 - 0.17 * np.cos(np.radians(hbp - 30)) + 0.24 * np.cos(np.radians(2 * hbp)) + 0.32 * np.cos(np.radians(3 * hbp + 6)) - 0.20 * np.cos(np.radians(4 * hbp - 63))
    Sl = 1 + 0.015 * (Lbp - 50) ** 2 / np.sqrt(20 + (Lbp - 50) ** 2)
    Sc, Sh = 1 + 0.045 * Cbp, 1 + 0.015 * Cbp * T
    Rt = -2 * np.sqrt(Cbp ** 7 / (Cbp ** 7 + 25 ** 7)) * np.sin(np.radians(60 * np.exp(-(((hbp - 275) / 25) ** 2))))
    return np.sqrt((dLp / Sl) ** 2 + (dCp / Sc) ** 2 + (dHp / Sh) ** 2 + Rt * (dCp / Sc) * (dHp / Sh))


def hex_lab(h):
    return srgb_to_lab(np.array([int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]))


SLOT_LAB = [(sid, hex_lab(hx)) for sid, hx in SLOTS]


def measure(path, blue, allowed=None):
    im = Image.open(path).convert("RGB")
    im.thumbnail((MAX_SIDE, MAX_SIDE))
    px = np.asarray(im, dtype=np.float64) / 255
    lab = srgb_to_lab(px)
    h, w = lab.shape[:2]
    b = max(2, int(min(h, w) * 0.03))
    border = np.concatenate([lab[:b].reshape(-1, 3), lab[-b:].reshape(-1, 3), lab[:, :b].reshape(-1, 3), lab[:, -b:].reshape(-1, 3)])
    ground = np.median(border, axis=0)
    # Measure only the inner area: torn, browned sheet edges otherwise read as gold/ochre
    # (AIC 1925.1689, ink-only, measured 6% 金/茶 from its damaged top edge).
    cy, cx = int(h * EDGE), int(w * EDGE)
    flat = lab[cy:h - cy, cx:w - cx].reshape(-1, 3)
    keep = ciede2000(flat, ground) > GROUND_DE
    ink = flat[keep]
    # Hue-less pixels (ink lines, their anti-aliased edges, shading of the paper) are decided by
    # lightness, not by nearest slot: CIEDE2000 weights chroma lightly, so mid greys otherwise land
    # on the greyish green/blue-grey slots (an ink-only print measured 61% green before this rule).
    # "No hue" is measured from the PAPER's tint, not from neutral grey: ink is semi-transparent and
    # its edges carry the paper's (yellowish) colour, only darker. Measured on AIC 1942.60: those
    # pixels sat at a≈-3, b≈16 like the ground, L 42–66.
    chroma = np.hypot(ink[:, 1] - ground[1], ink[:, 2] - ground[2])
    grey = chroma < ACHROMATIC_C
    dark_grey = grey & (ink[:, 0] < INK_L)
    ink_cnt = int(dark_grey.sum())
    ink = ink[~grey]  # light greys are paper/shade: excluded
    total = ink_cnt + len(ink)
    if total == 0:
        return {"ground_lab": ground.round(1).tolist(), "printed_share": 0.0, "slots": {}}
    # 2026-11-12: a pixel may only go to a slot the era USES (eras.js activeSlots, from records and
    # technique history). Without this, faded reds and browned paper land on slots the print never had.
    cand = [(sid, l) for sid, l in SLOT_LAB if not allowed or sid in allowed or (sid in BLUES and blue in BLUES)]
    d = np.stack([ciede2000(ink, l) for _, l in cand], 1) if len(ink) else np.zeros((0, len(cand)))
    nearest = np.concatenate([np.array([cand[i][0] for i in d.argmin(1)], dtype=object), np.array(["sumi"] * ink_cnt, dtype=object)])
    if blue in BLUES:
        nearest = np.where(np.isin(nearest, list(BLUES)), blue, nearest)
    elif blue == "none":
        # no blue pigment recorded: blue-looking pixels are faded/other colours, keep them as blue-grey
        nearest = np.where(np.isin(nearest, list(BLUES)), "ao", nearest)
    ids, counts = np.unique(nearest, return_counts=True)
    share = {sid: 0.0 for sid, _ in SLOTS}
    share.update({i: round(c / total, 4) for i, c in zip(ids, counts)})
    return {"ground_lab": ground.round(1).tolist(), "printed_share": round(total / len(flat), 4), "slots": share}


def main(src, dst):
    works = json.load(open(src, encoding="utf-8"))
    per_work, per_era = [], {}
    for wk in works:
        r = measure(wk["path"], wk.get("blue", "none"), wk.get("allowed"))
        per_work.append({"id": wk["id"], "era": wk["era"], **r})
        per_era.setdefault(wk["era"], []).append(r["slots"])
    eras = {}
    for era, rows in per_era.items():
        rows = [r for r in rows if r]
        eras[era] = {sid: round(float(np.mean([r[sid] for r in rows])), 4) for sid, _ in SLOTS} if rows else {}
    out = {"method": "paper ground removed (border median, CIEDE2000 > %.0f); nearest of the era's recorded slots by CIEDE2000; blue assigned from records; faded state as photographed" % GROUND_DE,
           "works": per_work, "eras": eras}
    json.dump(out, open(dst, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print(f"measured {len(per_work)} works in {len(eras)} eras -> {dst}")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
