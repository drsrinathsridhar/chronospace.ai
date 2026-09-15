#!/usr/bin/env python3
"""
camera-path.py - measure how the camera pans in a short clip and write the
`<clip>.camera.json` file the site's arc scrubber reads.

Usage
-----
    python3 scripts/camera-path.py public/media/product/wild.mp4 [more clips...]
        [--fps 10] [--width 480] [--fov 60] [--smooth 0.3]
        [--orbit-threshold 8] [--plot DIR] [--out PATH]

Each clip gets a JSON file next to it (`wild.mp4` -> `wild.camera.json`)
unless `--out` names a path (single clip only). `--plot DIR` also draws a
PNG of the raw and smoothed bearing curve per clip for eyeballing.

Needs numpy and opencv (`pip install numpy opencv-python-headless`;
matplotlib only for `--plot`). System python on the Mac lacks them, so
run from a virtualenv.

What it measures
----------------
1. The clip is sampled at `--fps` frames per second (default 10), each
   frame converted to greyscale and scaled to `--width` pixels wide.
2. For every consecutive pair, ~400 corners (`goodFeaturesToTrack`) are
   tracked with pyramidal Lucas-Kanade, and a similarity transform
   (`estimateAffinePartial2D` with RANSAC) gives the dominant image
   motion: translation dx, dy in pixels, rotation and scale. Only the
   horizontal translation is used for the bearing; dy, rotation and
   scale are reported in the console for context.
3. A step is flagged unreliable when too few corners are found (a blank
   or near-blank frame), too few of them survive tracking, or the RANSAC
   inlier ratio is low (a cut, heavy blur, or non-rigid motion filling
   the frame). Flagged steps contribute zero motion so a cut does not
   throw the handle across the arc.
4. dx is summed over time into a cumulative pan in pixels and converted
   to degrees by assuming the analysed frame width spans `--fov` degrees
   of horizontal field of view (default 60 deg -> 0.125 deg/px at 480
   px). The curve is centred on its mean and lightly smoothed with a
   centred moving average `--smooth` seconds wide (default 0.3 s).
5. If the peak-to-peak excursion is above `--orbit-threshold` degrees
   (default 8) the clip is `kind: "orbit"`, otherwise `kind: "fixed"`
   and the bearing is all zeros.

Assumptions
-----------
- The camera's horizontal motion shows up as a global horizontal
  translation of the image. That holds for a camera panning or orbiting
  a subject when the subject is not pinned dead centre; a perfect orbit
  around a centred subject would look like the subject rotating in
  place, which this method cannot see.
- Frame width = `--fov` degrees. This is a stated convention, not a
  calibration - the player only needs a consistent scale from clip to
  clip so the handle swings a plausible amount, and 60 deg is the
  typical horizontal FOV of the renders.
- Sign convention: a positive bearing means the camera has moved to the
  right of its mean position, i.e. image content has moved left
  (negative dx).

Output shape (fixed - the player is built against it)
-----------------------------------------------------
    {
      "clip": "wild.mp4",
      "fps": 10,
      "duration": 9.47,
      "kind": "orbit",
      "fov": 60,
      "span": 84.2,
      "bearing": [ -41.0, -40.6, ... ]
    }

`bearing` has one value per 1/fps s from t=0, length
ceil(duration * fps) + 1; the last sample past the end of the clip
holds the final measured value. Values are rounded to one decimal.
"""

from __future__ import annotations

import argparse
import json
import math
import os
import sys

import cv2
import numpy as np

# --- reliability thresholds -------------------------------------------------
MIN_CORNERS = 40        # fewer corners found in the first frame -> blank/flat
MIN_TRACKED = 20        # fewer corners survive LK -> cut or blur
MIN_INLIER_RATIO = 0.30 # RANSAC inliers / tracked -> non-rigid or cut
MIN_FRAME_STD = 4.0     # greyscale std below this -> essentially blank frame


def read_samples(path: str, fps: int, width: int):
    """Return (frames, native_fps, duration): greyscale frames sampled at `fps`."""
    cap = cv2.VideoCapture(path)
    if not cap.isOpened():
        raise SystemExit(f"cannot open {path}")
    native_fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    n_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    duration = n_frames / native_fps

    # Read every frame once (clips are short) and pick the nearest native
    # frame to each sample time. Avoids seek inaccuracies on H.264.
    all_frames = []
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        all_frames.append(frame)
    cap.release()
    if not all_frames:
        raise SystemExit(f"no frames decoded from {path}")
    n_frames = len(all_frames)
    duration = n_frames / native_fps

    n_samples = math.ceil(duration * fps) + 1
    frames = []
    for i in range(n_samples):
        t = i / fps
        idx = min(n_frames - 1, int(round(t * native_fps)))
        g = cv2.cvtColor(all_frames[idx], cv2.COLOR_BGR2GRAY)
        h = int(round(g.shape[0] * width / g.shape[1]))
        g = cv2.resize(g, (width, h), interpolation=cv2.INTER_AREA)
        frames.append(g)
    return frames, native_fps, duration


def estimate_step(prev: np.ndarray, cur: np.ndarray):
    """Dominant motion prev -> cur. Returns dict with dx, dy, rot_deg, scale,
    n_corners, n_tracked, n_inliers, ok, reason."""
    out = dict(dx=0.0, dy=0.0, rot_deg=0.0, scale=1.0,
               n_corners=0, n_tracked=0, n_inliers=0, ok=False, reason="")
    if prev.std() < MIN_FRAME_STD or cur.std() < MIN_FRAME_STD:
        out["reason"] = "blank frame"
        return out
    pts = cv2.goodFeaturesToTrack(prev, maxCorners=400, qualityLevel=0.01,
                                  minDistance=7, blockSize=7)
    if pts is None or len(pts) < MIN_CORNERS:
        out["n_corners"] = 0 if pts is None else len(pts)
        out["reason"] = f"only {out['n_corners']} corners"
        return out
    out["n_corners"] = len(pts)
    nxt, st, _err = cv2.calcOpticalFlowPyrLK(
        prev, cur, pts, None, winSize=(21, 21), maxLevel=3,
        criteria=(cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 30, 0.01))
    if nxt is None:
        out["reason"] = "LK failed"
        return out
    st = st.reshape(-1).astype(bool)
    p0 = pts.reshape(-1, 2)[st]
    p1 = nxt.reshape(-1, 2)[st]
    # Reject tracks that left the frame or jumped implausibly far.
    h, w = cur.shape
    inside = (p1[:, 0] >= 0) & (p1[:, 0] < w) & (p1[:, 1] >= 0) & (p1[:, 1] < h)
    p0, p1 = p0[inside], p1[inside]
    out["n_tracked"] = len(p0)
    if len(p0) < MIN_TRACKED:
        out["reason"] = f"only {len(p0)} tracked"
        return out
    M, inl = cv2.estimateAffinePartial2D(p0, p1, method=cv2.RANSAC,
                                         ransacReprojThreshold=3.0,
                                         maxIters=2000, confidence=0.99)
    disp = p1 - p0
    if M is None or inl is None:
        # Fall back to the median displacement.
        med = np.median(disp, axis=0)
        out.update(dx=float(med[0]), dy=float(med[1]), n_inliers=len(p0))
        out["reason"] = "RANSAC failed, median used"
        out["ok"] = True
        return out
    inl = inl.reshape(-1).astype(bool)
    n_inl = int(inl.sum())
    out["n_inliers"] = n_inl
    ratio = n_inl / max(1, len(p0))
    if ratio < MIN_INLIER_RATIO:
        out["reason"] = f"inlier ratio {ratio:.2f}"
        return out
    a, b = M[0, 0], M[0, 1]
    out["scale"] = float(math.hypot(a, b))
    out["rot_deg"] = float(math.degrees(math.atan2(M[1, 0], M[0, 0])))
    # Translation of the frame centre is the intuitive "how far did the
    # picture move" - M's raw translation is measured at the origin and
    # includes the rotation/scale pivot.
    c = np.array([w / 2.0, h / 2.0, 1.0])
    moved = M @ c
    out["dx"] = float(moved[0] - c[0])
    out["dy"] = float(moved[1] - c[1])
    out["ok"] = True
    return out


def smooth(x: np.ndarray, win: int) -> np.ndarray:
    if win <= 1:
        return x.copy()
    pad = win // 2
    xp = np.pad(x, pad, mode="edge")
    k = np.ones(win) / win
    return np.convolve(xp, k, mode="valid")


def analyse(path: str, fps: int, width: int, fov: float, smooth_s: float,
            orbit_threshold: float):
    frames, native_fps, duration = read_samples(path, fps, width)
    steps = [estimate_step(frames[i - 1], frames[i]) for i in range(1, len(frames))]

    dx = np.array([s["dx"] if s["ok"] else 0.0 for s in steps])
    cum_px = np.concatenate([[0.0], np.cumsum(dx)])
    deg_per_px = fov / width
    bearing_raw = -cum_px * deg_per_px          # content left => camera right
    bearing_raw -= bearing_raw.mean()

    win = int(round(smooth_s * fps))
    if win % 2 == 0:
        win += 1
    bearing = smooth(bearing_raw, win)
    bearing -= bearing.mean()

    span = float(bearing.max() - bearing.min())
    kind = "orbit" if span > orbit_threshold else "fixed"
    if kind == "fixed":
        bearing = np.zeros_like(bearing)

    flagged = [(i + 1, s["reason"]) for i, s in enumerate(steps) if not s["ok"]]
    return dict(
        clip=os.path.basename(path), fps=fps, duration=duration, kind=kind,
        fov=fov, span=span, bearing=bearing, bearing_raw=bearing_raw,
        steps=steps, flagged=flagged, native_fps=native_fps, width=width,
        smooth_win=win,
    )


def turning_points(b: np.ndarray, fps: int, min_deg: float = 2.0):
    """Times where the smoothed curve reverses direction by more than
    `min_deg` since the last turn - for pulling frames to check by eye."""
    turns = []
    last_val = b[0]
    last_dir = 0
    for i in range(1, len(b)):
        d = b[i] - b[i - 1]
        direction = 1 if d > 0.05 else (-1 if d < -0.05 else 0)
        if direction and last_dir and direction != last_dir:
            if abs(b[i - 1] - last_val) >= min_deg:
                turns.append(((i - 1) / fps, float(b[i - 1]), "right" if last_dir > 0 else "left"))
                last_val = b[i - 1]
        if direction:
            last_dir = direction
    return turns


def write_json(res: dict, out_path: str):
    data = {
        "clip": res["clip"],
        "fps": res["fps"],
        "duration": round(res["duration"], 2),
        "kind": res["kind"],
        "fov": res["fov"] if res["fov"] != int(res["fov"]) else int(res["fov"]),
        "span": round(res["span"], 1),  # measured even for a fixed clip, so it shows why it was called fixed
        "bearing": [round(float(v) + 0.0, 1) for v in res["bearing"]],
    }
    # Avoid "-0.0" in the output.
    data["bearing"] = [0.0 if v == 0 else v for v in data["bearing"]]
    with open(out_path, "w") as f:
        # Compact bearing array on a few lines, header fields one per line.
        head = {k: v for k, v in data.items() if k != "bearing"}
        s = json.dumps(head, indent=2)[:-2]  # strip closing "\n}"
        vals = data["bearing"]
        rows = [", ".join(f"{v:.1f}" for v in vals[i:i + 12]) for i in range(0, len(vals), 12)]
        s += ',\n  "bearing": [\n    ' + ",\n    ".join(rows) + "\n  ]\n}\n"
        f.write(s)
    return data


def plot(res: dict, plot_dir: str):
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    t = np.arange(len(res["bearing"])) / res["fps"]
    fig, ax = plt.subplots(figsize=(10, 4), dpi=110)
    ax.plot(t, res["bearing_raw"], color="#999", lw=0.8, label="raw")
    ax.plot(t, res["bearing"], color="#c33", lw=1.8, label=f"smoothed ({res['smooth_win']} samples)")
    for idx, reason in res["flagged"]:
        ax.axvline(idx / res["fps"], color="#39f", alpha=0.4, lw=1)
    for tt, val, _ in turning_points(res["bearing"], res["fps"]):
        ax.plot(tt, val, "o", color="#c33", ms=5)
    ax.axhline(0, color="k", lw=0.5)
    ax.set_xlabel("t (s)")
    ax.set_ylabel("bearing (deg, + = camera right)")
    ax.set_title(f"{res['clip']}  kind={res['kind']}  span={res['span']:.1f} deg  "
                 f"(blue = flagged steps: {len(res['flagged'])})")
    ax.legend(loc="best")
    ax.grid(alpha=0.3)
    fig.tight_layout()
    out = os.path.join(plot_dir, os.path.splitext(res["clip"])[0] + ".camera.png")
    fig.savefig(out)
    plt.close(fig)
    return out


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("clips", nargs="+")
    ap.add_argument("--fps", type=int, default=10, help="samples per second (default 10)")
    ap.add_argument("--width", type=int, default=480, help="analysis frame width in px (default 480)")
    ap.add_argument("--fov", type=float, default=60.0, help="assumed horizontal FOV in degrees (default 60)")
    ap.add_argument("--smooth", type=float, default=0.3, help="smoothing window in seconds (default 0.3)")
    ap.add_argument("--orbit-threshold", type=float, default=8.0,
                    help="peak-to-peak degrees above which a clip is an orbit (default 8)")
    ap.add_argument("--plot", metavar="DIR", help="write a debug PNG per clip into DIR")
    ap.add_argument("--out", metavar="PATH", help="output JSON path (single clip only)")
    ap.add_argument("--verbose", "-v", action="store_true", help="print every step")
    args = ap.parse_args(argv)

    if args.out and len(args.clips) != 1:
        ap.error("--out only makes sense with a single clip")
    if args.plot:
        os.makedirs(args.plot, exist_ok=True)

    for path in args.clips:
        res = analyse(path, args.fps, args.width, args.fov, args.smooth, args.orbit_threshold)
        out_path = args.out or os.path.splitext(path)[0] + ".camera.json"
        data = write_json(res, out_path)

        print(f"\n== {res['clip']}  {res['native_fps']:.0f} fps native, {res['duration']:.3f} s, "
              f"{len(res['bearing'])} samples at {res['fps']}/s, analysed at {res['width']} px "
              f"({res['fov'] / res['width']:.4f} deg/px)")
        print(f"   kind={res['kind']}  span={res['span']:.1f} deg  "
              f"min={res['bearing'].min():.1f} max={res['bearing'].max():.1f}")
        if res["flagged"]:
            print(f"   flagged steps ({len(res['flagged'])}): " +
                  ", ".join(f"t={i / res['fps']:.1f}s ({r})" for i, r in res["flagged"]))
        else:
            print("   no flagged steps")
        ok = [s for s in res["steps"] if s["ok"]]
        if ok:
            print(f"   median inlier ratio {np.median([s['n_inliers'] / max(1, s['n_tracked']) for s in ok]):.2f}, "
                  f"median |dy| {np.median([abs(s['dy']) for s in ok]):.2f} px, "
                  f"median |rot| {np.median([abs(s['rot_deg']) for s in ok]):.2f} deg, "
                  f"scale range {min(s['scale'] for s in ok):.3f}-{max(s['scale'] for s in ok):.3f}")
        turns = turning_points(res["bearing"], res["fps"])
        if turns:
            print("   turning points: " + ", ".join(
                f"t={tt:.1f}s {val:+.1f} deg (was going {d})" for tt, val, d in turns))
        if args.verbose:
            for i, s in enumerate(res["steps"], 1):
                print(f"   t={i / res['fps']:5.1f}  dx={s['dx']:+7.2f} dy={s['dy']:+6.2f} "
                      f"rot={s['rot_deg']:+5.2f} sc={s['scale']:.3f} "
                      f"corners={s['n_corners']:3d} tracked={s['n_tracked']:3d} "
                      f"inl={s['n_inliers']:3d} {'' if s['ok'] else 'FLAG ' + s['reason']}")
        print(f"   wrote {out_path}  ({len(data['bearing'])} values)")
        if args.plot:
            print(f"   plot  {plot(res, args.plot)}")


if __name__ == "__main__":
    main()
