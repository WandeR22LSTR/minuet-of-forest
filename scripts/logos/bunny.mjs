// bunny-hood: the Bunny Hood from Ocarina of Time, seen from the front. An original low-poly
// drawing after the game's item: two long ears splayed slightly outwards, each a golden tan
// rim around a concave plum inner ear, rising from a hood that wraps round the head, with a
// crease across the brow, a pointed flap at each side and two small dark eyes.
// Every facet is a 3D polygon shaded by the shared light (engine.mjs), like the medallions.
// One mark on a transparent background with a dark outline, like Lens of Truth's, plus a
// simplified version (flat tones, bigger eyes, heavier outline) for 32 px and under.
// Coordinates are in a 100-unit design grid (x right, y down, z towards the viewer); the left
// half is drawn and mirrored.
import { norm, cross, sub, ramp, svgDoc, f1, pathOf, placement } from "./engine.mjs";

const tan = ramp([
  [0, "#2e2208"], [0.2, "#544210"], [0.34, "#76601e"], [0.48, "#9c7f2c"],
  [0.62, "#bf9f42"], [0.76, "#d8bd66"], [0.9, "#efdc9f"], [1, "#fcf5d8"],
]);
const plum = ramp([
  [0, "#1c1020"], [0.22, "#352338"], [0.42, "#4e3650"], [0.6, "#6a5070"], [0.78, "#8f7895"], [1, "#c9b6cc"],
]);
export const OUTLINE = "#24180f";
const EYE = "#22180c";

const mirror = (p) => [100 - p[0], p[1], p[2]];

// The geometry, as a function of the ear tip, the ears' width and the flaps' length, so the
// small version can be squarer (shorter, wider ears, shorter flaps) and fill a 16 px square.
const INSET = 0.56;
const PROFILE = [[0, 9.5], [0.25, 11.2], [0.5, 10.8], [0.72, 8.6], [0.88, 5.4]];
function shape({ earTip = [19, -25], widen = 1, flapY = 108 } = {}) {
  // Hood: top rim, brow crease, lower edge, side and flap point (left half, then mirrored).
  const T = [[50, 55, 16], [38, 51, 15], [24, 52, 11], [13, 58, 5]];
  const M = [[50, 63, 18], [37, 62, 17], [23, 64, 12], [11, 67, 4]];
  const B = [[50, 72, 16], [36, 75, 14], [22, 80, 9]];
  const SIDE = [10, 77, 1], FLAP = [15, flapY, 0];
  const hoodLeft = [
    [T[0], T[1], M[1], M[0]], [T[1], T[2], M[2], M[1]], [T[2], T[3], M[3], M[2]],
    [M[0], M[1], B[1], B[0]], [M[1], M[2], B[2], B[1]], [M[2], M[3], SIDE, B[2]], [B[2], SIDE, FLAP],
  ];
  const hood = [...hoodLeft, ...hoodLeft.map((f) => f.map(mirror).reverse())];
  const hoodOutline = [T[3], T[2], T[1], T[0], ...[T[1], T[2], T[3], SIDE, FLAP, B[2], B[1]].map(mirror), B[0], B[1], B[2], FLAP, SIDE];
  // Upper half of the hood, lighter in the small version's flat tones.
  const hoodUpper = [T[3], T[2], T[1], T[0], ...[T[1], T[2], T[3], M[3], M[2], M[1]].map(mirror), M[0], M[1], M[2], M[3]];

  // Ear (left), built along its axis from the base (hidden under the hood's rim) to the tip:
  // [distance along the ear 0..1, half-width] for the rim; the plum inner ear is inset in it.
  // The rim slopes away from the plum edge; the plum dips to a spine down its middle.
  const base = [33, 60], [dx, dy] = [earTip[0] - base[0], earTip[1] - base[1]], L = Math.hypot(dx, dy);
  const along = (u, w, z) => [base[0] + dx * u + (-dy / L) * w * widen, base[1] + dy * u + (dx / L) * w * widen, z];
  const zb = (u) => 10 - 6 * u;
  const rimPts = [...PROFILE.map(([u, w]) => along(u, w, zb(u))), along(1, 0, zb(1)), ...PROFILE.slice().reverse().map(([u, w]) => along(u, -w, zb(u)))];
  const innerPts = [...PROFILE.map(([u, w]) => along(u * 0.97, w * INSET, zb(u) + 2)), along(0.93, 0, zb(0.93) + 2), ...PROFILE.slice().reverse().map(([u, w]) => along(u * 0.97, -w * INSET, zb(u) + 2))];
  const spine = [0, 0.25, 0.5, 0.72].map((u) => along(u * 0.97, 0, zb(u) - 2.5));
  const ear = (m = (p) => p) => {
    const R = rimPts.map(m), I = innerPts.map(m), C = spine.map(m);
    const rim = [];
    for (let i = 0; i < R.length - 1; i++) rim.push([R[i], R[i + 1], I[i + 1], I[i]]);
    // Plum: from each side of the inner outline to the spine, closing at the tip.
    const n = PROFILE.length, tip = I[n], inner = [];
    for (let i = 0; i < n - 1; i++) {
      const c0 = C[Math.min(i, C.length - 1)], c1 = C[Math.min(i + 1, C.length - 1)];
      inner.push([I[i], I[i + 1], c1, c0], [I[2 * n - i], I[2 * n - i - 1], c1, c0]);
    }
    inner.push([I[n - 1], tip, C[C.length - 1]], [I[n + 1], tip, C[C.length - 1]]);
    return { rim, inner, outline: R, innerOutline: I };
  };
  const ears = [ear(), ear(mirror)];
  const pts = [...ears.flatMap((e) => e.outline), ...hoodOutline];
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  return { hood, hoodOutline, hoodUpper, ears, box: { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) } };
}
const FULL = shape();
const SMALL = shape({ earTip: [16, -2], widen: 1.25, flapY: 96 });
const EYES = [[37, 64], [63, 64]];

/** Shade a facet: the normal from its diagonals (quads) or edges (triangles), facing the viewer. */
function shade(f, r, m) {
  let n = f.length === 4 ? cross(sub(f[2], f[0]), sub(f[3], f[1])) : cross(sub(f[1], f[0]), sub(f[2], f[0]));
  if (n[2] < 0) n = n.map((v) => -v);
  return r.shade(norm(n), m);
}
const poly = (pts, place, fill) => `<path d="${pathOf(pts.map(place))}" fill="${fill}" stroke="${fill}" stroke-width="0.6" stroke-linejoin="round"/>`;

function draw(place, m, { simple = false } = {}) {
  const g = simple ? SMALL : FULL;
  let body = "";
  for (const e of g.ears) {
    if (simple) {
      // Flat tones: the rim in one tan, the inner ear in one plum.
      body += poly(e.outline, place, tan.tone(0.66 + (m.exposure ?? 0))) + poly(e.innerOutline, place, plum.tone(0.4));
    } else {
      for (const f of e.rim) body += poly(f, place, shade(f, tan, m));
      for (const f of e.inner) body += poly(f, place, shade(f, plum, m));
    }
  }
  if (simple) {
    body += poly(g.hoodOutline, place, tan.tone(0.58 + (m.exposure ?? 0))) + poly(g.hoodUpper, place, tan.tone(0.74 + (m.exposure ?? 0)));
  } else {
    for (const f of g.hood) body += poly(f, place, shade(f, tan, m));
  }
  // Eyes: small dark ovals with a glint towards the light.
  const S = place.scale, [rx, ry] = simple ? [5.6, 4.6] : [4.2, 3.3];
  for (const [x, y] of EYES) {
    const [cx, cy] = place([x, y]);
    body += `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx * S)}" ry="${f1(ry * S)}" fill="${EYE}"/>`;
    if (!simple) body += `<circle cx="${f1(cx - 1.3 * S)}" cy="${f1(cy - 1.1 * S)}" r="${f1(1.1 * S)}" fill="#ffffff" fill-opacity="0.85"/>`;
  }
  const silhouettes = g.ears.map((e) => `<path d="${pathOf(e.outline.map(place))}"/>`).join("") + `<path d="${pathOf(g.hoodOutline.map(place))}"/>`;
  return { silhouettes, body };
}


/**
 * The hood on a transparent background with a dark outline: toolbar and app icon, header
 * logo, Ice Cavern door. `simple` is the version for 32 px and under.
 */
export function bare({ size = 512, fill = 0.44, outline, simple = false } = {}) {
  const b = (simple ? SMALL : FULL).box, extent = Math.max(b.x1 - b.x0, b.y1 - b.y0) / 2;
  const place = placement(size, { extent, box: b, origin: [(b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2], fill });
  const e = draw(place, { ambient: 0.16, diffuse: 0.66, spec: 0.28 }, { simple });
  const w = outline ?? (simple ? 0.045 : 0.022);
  const ring = `<g fill="${OUTLINE}" stroke="${OUTLINE}" stroke-width="${f1(size * w * 2)}" stroke-linejoin="round">${e.silhouettes}</g>`;
  return svgDoc({ size, body: ring + e.body, title: "Bunny Hood" });
}
