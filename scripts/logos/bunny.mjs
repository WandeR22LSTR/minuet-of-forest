// bunny-hood: the Bunny Hood from Ocarina of Time, after its remake look: a soft padded band
// that arcs over the head, widest at the front where its two small dark eyes are, with two
// long rounded ears rising from it (a rolled golden tan rim round a concave plum hollow) and,
// optionally, a thin cord looped under it with a bow. An original drawing after the item.
// It is a small 3D model: smooth surfaces in fine facets, turned a little, each facet shaded
// by the shared light (engine.mjs) and drawn back to front. One mark on a transparent
// background with a dark outline, like Lens of Truth's, plus a version for 32 px and under
// (thicker band, shorter wider ears, bigger eyes, turned less) that fills a small square.
// Model units: the head is about 68 wide; x right, y down, z towards the viewer.
import { norm, cross, sub, dot, ramp, svgDoc, f1, pathOf } from "./engine.mjs";

const tan = ramp([
  [0, "#3a2a08"], [0.2, "#664e12"], [0.34, "#8a6c1e"], [0.48, "#ad8a2e"],
  [0.62, "#cba846"], [0.76, "#e1c46a"], [0.9, "#f2df9f"], [1, "#fdf6d8"],
]);
const plum = ramp([
  [0, "#1c1020"], [0.22, "#352338"], [0.42, "#4e3650"], [0.6, "#6a5070"], [0.78, "#8f7895"], [1, "#c9b6cc"],
]);
export const OUTLINE = "#24180f";
const EYE = "#22180c";

const D = Math.PI / 180;
const add = (...v) => v.reduce((a, b) => a.map((x, i) => x + b[i]));
const mul = (a, s) => a.map((x) => x * s);
const rotY = ([x, y, z], d) => [x * Math.cos(d * D) + z * Math.sin(d * D), y, -x * Math.sin(d * D) + z * Math.cos(d * D)];
const rotX = ([x, y, z], d) => [x, y * Math.cos(d * D) - z * Math.sin(d * D), y * Math.sin(d * D) + z * Math.cos(d * D)];
const rotZ = ([x, y, z], d) => [x * Math.cos(d * D) - y * Math.sin(d * D), x * Math.sin(d * D) + y * Math.cos(d * D), z];
/** Rotate vector v about unit axis k by d degrees. */
const rotAxis = (v, k, d) => {
  const c = Math.cos(d * D), s = Math.sin(d * D);
  return add(mul(v, c), mul(cross(k, v), s), mul(k, dot(k, v) * (1 - c)));
};
const centroid = (q) => mul(add(...q), 1 / q.length);

// --- The model ---------------------------------------------------------------
// Band: swept along an arc over the head, α from -BAND_END (left end) through 0 (the top of
// the forehead) to BAND_END. Its plane leans back, so the front sits high on the forehead and
// the ends come down at the sides. The cross-section is a padded oval: `width` across the
// head, `thick` off it, both largest at the front (`flare`: how much narrower the ends are)
// and rounded off at the ends.
const BAND_END = 100, CENTRE = [0, 72, -4], HEAD = [0, 70, -10], ARC = [34, 34, 18];
const bandCentre = (a) => add(CENTRE, [ARC[0] * Math.sin(a * D), -ARC[1] * Math.cos(a * D), ARC[2] * Math.cos(a * D)]);
/** The band's frame at α: centre, tangent, outward normal (off the head), across (width). */
function bandFrame(a) {
  const C = bandCentre(a);
  const T = norm(sub(bandCentre(a + 0.5), bandCentre(a - 0.5)));
  const B = norm(cross(T, norm(sub(C, HEAD))));
  return { C, T, N: norm(cross(B, T)), B };
}
function bandSize(a, { width, thick, flare = 0.38 }) {
  const k = Math.cos(a * D) ** 2, over = Math.abs(a) - (BAND_END - 9);
  const cap = over > 0 ? Math.sqrt(Math.max(0, 1 - (over / 9) ** 2)) : 1; // rounded ends
  return [(width / 2) * (1 - flare + flare * k) * cap, (thick / 2) * (0.8 + 0.2 * k) * cap];
}
const soft = (c) => Math.sign(c) * Math.abs(c) ** 0.8; // a fuller, padded oval
function bandPoint(a, th, size) {
  const f = bandFrame(a), [b, t] = bandSize(a, size);
  return add(f.C, mul(f.N, t * soft(Math.cos(th))), mul(f.B, b * soft(Math.sin(th))));
}

// Ear: from its base (set into the band's top) along its axis a; v runs across it, -1..1.
// The middle (|v| < HOLLOW) dips into the plum hollow; the rim rolls round it.
const HOLLOW = 0.52;
function earFrame(side, { at = 24, splay = 13, lean = 10, turn = 16 } = {}) {
  const f = bandFrame(side * at);
  const base = add(f.C, mul(f.N, 1));
  let a = [side * Math.sin(splay * D), -Math.cos(splay * D), 0];
  a = norm([a[0], a[1] * Math.cos(lean * D), -Math.sin(lean * D)]);
  let c = norm(cross(a, [0, 0, 1]));
  let n = norm(cross(c, a));
  if (n[2] < 0) { n = mul(n, -1); c = mul(c, -1); }
  // Each ear faces a little outwards.
  return { base, a, c: rotAxis(c, a, side * turn), n: rotAxis(n, a, side * turn) };
}
const earWidth = (u, W) => W * (0.86 + 0.32 * Math.sin(Math.PI * Math.min(u, 1) * 0.9)) * Math.sqrt(Math.max(0, 1 - u ** 2.6));
function earPoint(f, u, v, { L, W, back = false }) {
  const av = Math.abs(v);
  let d;
  if (back) d = -1.6;
  else if (av < HOLLOW) d = -3.2 * (1 - (v / HOLLOW) ** 2) * Math.min(1, u * 6) * (1 - u ** 4);
  else d = 1.6 * Math.sin((Math.PI * (av - HOLLOW)) / (1 - HOLLOW));
  const curl = 3 * u * u; // the tip leans forward a little
  return add(f.base, mul(f.a, L * u), mul(f.c, earWidth(u, W) * v), mul(f.n, d + curl));
}

/** A surface as a grid of quads: fn(u, v) → point, colour(u, v) → ramp, out(quad) → outward. */
function grid(fn, nu, nv, colour, out, exposure = 0) {
  const P = [];
  for (let i = 0; i <= nu; i++) { P.push([]); for (let j = 0; j <= nv; j++) P[i].push(fn(i / nu, j / nv)); }
  const facets = [];
  for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) {
    const q = [P[i][j], P[i + 1][j], P[i + 1][j + 1], P[i][j + 1]];
    facets.push({ q, ramp: colour((i + 0.5) / nu, (j + 0.5) / nv), out: out(q, (i + 0.5) / nu), exposure });
  }
  return facets;
}

/** Every surface of the band and both ears, at a resolution (fine to draw, coarse to outline). */
function model({ earL = 74, earW = 15.5, earAt = 24, earSplay = 13, width = 24, thick = 9, flare = 0.38, res = 1 } = {}) {
  const R = (n) => Math.max(2, Math.round(n * res));
  const along = (u) => -BAND_END + 2 * BAND_END * u;
  const size = { width, thick, flare };
  const facets = grid((u, v) => bandPoint(along(u), 2 * Math.PI * v, size), R(64), R(16), () => tan,
    (q, u) => sub(centroid(q), bandFrame(along(u)).C));
  for (const side of [-1, 1]) {
    const f = earFrame(side, { at: earAt, splay: earSplay }), o = { L: earL, W: earW };
    facets.push(...[
      ...grid((u, v) => earPoint(f, u, -1 + 2 * v, o), R(24), R(18), (u, v) => (Math.abs(-1 + 2 * v) < HOLLOW * 0.92 && u < 0.94 ? plum : tan), () => f.n),
      ...grid((u, v) => earPoint(f, u, -1 + 2 * v, { ...o, back: true }), R(18), R(6), () => tan, () => mul(f.n, -1), -0.06),
    ].map((x) => ({ ...x, ear: true })));
  }
  return facets;
}

// --- Drawing -----------------------------------------------------------------
// Nearly front on, like the family's other emblems, seen a little from above and turned and
// tilted just a little so the face looks to the right. The small version is turned less.
export const VIEW = { yaw: 12, pitch: 8, roll: 6 };
const SMALL_VIEW = { yaw: 8, pitch: 6, roll: 4 };
const view = (p, v) => rotZ(rotX(rotY(p, v.yaw), v.pitch), v.roll);

function project(facets, v) {
  return facets.map((f) => {
    const q = f.q.map((p) => view(p, v));
    let n = cross(sub(q[2], q[0]), sub(q[3], q[1]));
    if (dot(n, view(f.out, v)) < 0) n = mul(n, -1);
    return { ...f, q, n: norm(n), depth: centroid(q)[2] };
  });
}
// The ears rise from behind the band's top, so they are drawn first and the band over them.
const order = (a, b) => (b.ear ?? false) - (a.ear ?? false) || a.depth - b.depth;

/** The cord: from the band's ends down to a bow under the middle, as 3D points. */
function cordPoints() {
  const L = bandCentre(-BAND_END + 4), Rr = bandCentre(BAND_END - 4), K = [0, 112, 2];
  const bez = (p0, p1, p2, t) => add(mul(p0, (1 - t) ** 2), mul(p1, 2 * t * (1 - t)), mul(p2, t * t));
  const side = (E, s) => Array.from({ length: 13 }, (_, i) => bez(E, [s * 22, 112, 0], K, i / 12));
  return { left: side(L, -1), right: side(Rr, 1), knot: K };
}

function draw({ size, fill, simple, v, outlineW, tweak, cord }) {
  const shape = { ...(simple ? { earL: 56, earW: 17, earAt: 26, earSplay: 19, width: 28, thick: 11 } : {}), ...tweak };
  // Visible facets, back to front (half as fine for the small version, which is never shown
  // large); the coarse model (both sides) gives the outline.
  const fine = project(model({ ...shape, res: simple ? 0.5 : 1 }), v).filter((f) => f.n[2] > 0).sort(order);
  const coarse = project(model({ ...shape, res: 0.3 }), v);
  const cords = cord ? cordPoints() : null;
  const pts = [...coarse.flatMap((f) => f.q), ...(cords ? [...cords.left, ...cords.right].map((p) => view(p, v)) : [])];
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const S = (size * fill) / (Math.max(x1 - x0, y1 - y0) / 2), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const place = ([x, y]) => [size / 2 + (x - cx) * S, size / 2 + (y - cy) * S];

  // The cord sits behind everything: a light line with its own dark outline, and a bow.
  let back = "";
  if (cords) {
    const line = (p) => pathOf([...p.left, ...p.right.slice().reverse()].map((q) => place(view(q, v))), false);
    const K = place(view(cords.knot, v)), r = 4.2 * S;
    const bow = `M${f1(K[0])} ${f1(K[1])}c${f1(-r)} ${f1(-r * 0.9)} ${f1(-2.2 * r)} ${f1(-0.2 * r)} ${f1(-1.6 * r)} ${f1(0.5 * r)}c${f1(0.4 * r)} ${f1(0.5 * r)} ${f1(1.2 * r)} ${f1(0)} ${f1(1.6 * r)} ${f1(-0.5 * r)}` +
      `M${f1(K[0])} ${f1(K[1])}c${f1(r)} ${f1(-r * 0.9)} ${f1(2.2 * r)} ${f1(-0.2 * r)} ${f1(1.6 * r)} ${f1(0.5 * r)}c${f1(-0.4 * r)} ${f1(0.5 * r)} ${f1(-1.2 * r)} ${f1(0)} ${f1(-1.6 * r)} ${f1(-0.5 * r)}` +
      `M${f1(K[0])} ${f1(K[1])}l${f1(-0.9 * r)} ${f1(1.8 * r)}M${f1(K[0])} ${f1(K[1])}l${f1(0.8 * r)} ${f1(1.9 * r)}`;
    const d = line(cords) + bow;
    back = `<path d="${d}" fill="none" stroke="${OUTLINE}" stroke-width="${f1(size * outlineW * 1.6)}" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="${d}" fill="none" stroke="${tan.tone(0.8)}" stroke-width="${f1(1.6 * S)}" stroke-linecap="round" stroke-linejoin="round"/>`;
  }

  const m = { ambient: 0.2, diffuse: 0.64, spec: simple ? 0.14 : 0.26 };
  // A base in each surface's middle tone under the fine facets, so the hairline seams between
  // them show a matching colour rather than the dark outline (as on Saria's Song).
  let body = coarse.filter((f) => f.n[2] > 0).sort(order)
    .map((f) => { const c = f.ramp.tone(0.6); return `<path d="${pathOf(f.q.map(place))}" fill="${c}" stroke="${c}" stroke-width="1"/>`; }).join("");
  for (const f of fine) {
    const c = f.ramp.shade(f.n, { ...m, exposure: f.exposure });
    body += `<path d="${pathOf(f.q.map(place))}" fill="${c}" stroke="${c}" stroke-width="1.3" stroke-linejoin="round"/>`;
  }
  // Eyes on the band's front face (where it faces the viewer most), following its curve, with
  // a glint towards the light.
  const sizeOf = { width: shape.width ?? 24, thick: shape.thick ?? 9, flare: shape.flare ?? 0.38 };
  for (const side of [-1, 1]) {
    const a = side * 13, fr = bandFrame(a);
    const dirAt = (th) => add(mul(fr.N, Math.cos(th)), mul(fr.B, Math.sin(th)));
    let th = 0;
    for (let k = -90; k <= 90; k += 2) if (view(dirAt(k * D), v)[2] > view(dirAt(th), v)[2]) th = k * D;
    const c0 = add(bandPoint(a, th, sizeOf), mul(dirAt(th), 0.3));
    if (view(dirAt(th), v)[2] < 0.15) continue;
    const across = norm(sub(bandPoint(a, th + 0.05, sizeOf), bandPoint(a, th - 0.05, sizeOf)));
    const [rx, ry] = simple ? [6.2, 5.2] : [5.2, 4.3];
    const C = place(view(c0, v)), U = view(mul(fr.T, rx * S), v), V = view(mul(across, ry * S), v);
    body += `<ellipse rx="1" ry="1" fill="${EYE}" transform="matrix(${[U[0], U[1], V[0], V[1], C[0], C[1]].map(f1).join(" ")})"/>`;
    if (!simple) body += `<circle cx="${f1(C[0] - 1.3 * S)}" cy="${f1(C[1] - 1.2 * S)}" r="${f1(1.05 * S)}" fill="#ffffff" fill-opacity="0.85"/>`;
  }
  const ring = `<g fill="${OUTLINE}" stroke="${OUTLINE}" stroke-width="${f1(size * outlineW * 2)}" stroke-linejoin="round">${coarse.map((f) => `<path d="${pathOf(f.q.map(place))}"/>`).join("")}</g>`;
  return back + ring + body;
}

/**
 * The hood on a transparent background with a dark outline: toolbar and app icon, header
 * logo, Ice Cavern door. `simple` is the version for 32 px and under; `cord` adds the cord
 * and bow under the band (large sizes only).
 */
export function bare({ size = 512, fill = 0.44, outline, simple = false, view: v = simple ? SMALL_VIEW : VIEW, tweak = {}, cord = false } = {}) {
  const outlineW = outline ?? (simple ? 0.045 : 0.022);
  return svgDoc({ size, body: draw({ size, fill, simple, v, outlineW, tweak, cord: cord && !simple }), title: "Bunny Hood" });
}
