// bunny-hood: the Bunny Hood from Ocarina of Time, at an angle like the game's render. An
// original drawing after the item: a hood that wraps round the head, with a pointed flap at
// each side and two small dark eyes on the brow, and two long rounded ears with a rolled
// golden tan rim around a concave plum hollow.
// It is a small 3D model: smooth surfaces in fine facets, turned and tilted, each facet
// shaded by the shared light (engine.mjs) and drawn back to front. One mark on a transparent
// background with a dark outline, like Lens of Truth's, plus a version for 32 px and under
// (shorter, wider ears, bigger eyes, turned less) that fills a small square.
// Model units: the head is about 66 wide; x right, y down, z towards the viewer.
import { norm, cross, sub, dot, ramp, svgDoc, f1, pathOf } from "./engine.mjs";

const tan = ramp([
  [0, "#2e2208"], [0.2, "#544210"], [0.34, "#76601e"], [0.48, "#9c7f2c"],
  [0.62, "#bf9f42"], [0.76, "#d8bd66"], [0.9, "#efdc9f"], [1, "#fcf5d8"],
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
// Hood: a band round the head at angle φ (0 at the front), t from its top edge (0) to its
// bottom edge (1). Past FLAP_START the band narrows to a point: the flaps.
const PHI_MAX = 106, FLAP_START = 64, THICK = 2.4;
function hoodEdges(phi, flapY) {
  const a = Math.abs(phi);
  if (a <= FLAP_START) {
    const s = a / FLAP_START;
    return [46 + 8 * s * s, 75 + 8 * s ** 1.6];
  }
  const s = (a - FLAP_START) / (PHI_MAX - FLAP_START);
  return [54 + (flapY - 54) * s ** 2.2, 83 + (flapY - 83) * s ** 0.55];
}
function hoodPoint(phi, t, { flapY, inset = 0 }) {
  const [top, bot] = hoodEdges(phi, flapY);
  const taper = 0.93 + 0.07 * t; // narrower towards the crown
  const bulge = 3 * Math.sin(Math.PI * t); // the brow's rounded crease
  const rx = (33 - inset) * taper, rz = (27 - inset) * taper + bulge;
  return [rx * Math.sin(phi * D), top + (bot - top) * t, rz * Math.cos(phi * D)];
}

// Ear: from its base (just behind the hood's top edge) along its axis a; v runs across it,
// -1..1. The middle (|v| < HOLLOW) dips into the plum hollow; the rim rolls round it.
const HOLLOW = 0.52;
function earFrame(side, { phi = 26, splay = 11, lean = 14, turn = 16 } = {}) {
  const base = add(hoodPoint(side * phi, 0, { flapY: 106 }), [0, 4, -2.5]);
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
    facets.push({ q, ramp: colour((i + 0.5) / nu, (j + 0.5) / nv), out: out(q), exposure });
  }
  return facets;
}

/** Every surface of the hood and both ears, at a resolution (fine to draw, coarse to outline). */
function model({ earL = 76, earW = 14, earPhi = 26, earSplay = 11, flapY = 106, res = 1 } = {}) {
  const R = (n) => Math.max(2, Math.round(n * res));
  const radial = (q) => { const c = centroid(q); return [c[0], 0, c[2]]; };
  const around = (u) => -PHI_MAX + 2 * PHI_MAX * u;
  const facets = [
    ...grid((u, v) => hoodPoint(around(u), v, { flapY }), R(44), R(8), () => tan, radial),
    // The inside of the hood, seen past the far flap: in shadow.
    ...grid((u, v) => hoodPoint(around(u), v, { flapY, inset: THICK }), R(44), R(8), () => tan, (q) => mul(radial(q), -1), -0.16),
  ];
  for (const side of [-1, 1]) {
    const f = earFrame(side, { phi: earPhi, splay: earSplay }), o = { L: earL, W: earW };
    facets.push(
      ...grid((u, v) => earPoint(f, u, -1 + 2 * v, o), R(28), R(22), (u, v) => (Math.abs(-1 + 2 * v) < HOLLOW * 0.92 && u < 0.94 ? plum : tan), () => f.n),
      ...grid((u, v) => earPoint(f, u, -1 + 2 * v, { ...o, back: true }), R(18), R(6), () => tan, () => mul(f.n, -1), -0.06),
    );
  }
  return facets;
}

// --- Drawing -----------------------------------------------------------------
// Turned so the face looks to the right, seen a little from below, tilted clockwise. The small
// version is turned less, so it stays a compact silhouette at 16 px.
export const VIEW = { yaw: 26, pitch: -4, roll: 16 };
const SMALL_VIEW = { yaw: 12, pitch: -4, roll: 8 };
const view = (p, v) => rotZ(rotX(rotY(p, v.yaw), v.pitch), v.roll);

function project(facets, v) {
  return facets.map((f) => {
    const q = f.q.map((p) => view(p, v));
    let n = cross(sub(q[2], q[0]), sub(q[3], q[1]));
    if (dot(n, view(f.out, v)) < 0) n = mul(n, -1);
    return { ...f, q, n: norm(n), depth: centroid(q)[2] };
  });
}

function draw({ size, fill, simple, v, outlineW }) {
  const shape = simple ? { earL: 62, earW: 15.5, earPhi: 32, earSplay: 19, flapY: 92 } : {};
  const flapY = shape.flapY ?? 106;
  // Visible facets, back to front; the coarse model (both sides) gives the outline.
  const fine = project(model(shape), v).filter((f) => f.n[2] > 0).sort((a, b) => a.depth - b.depth);
  const coarse = project(model({ ...shape, res: 0.3 }), v);
  const pts = coarse.flatMap((f) => f.q);
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const S = (size * fill) / (Math.max(x1 - x0, y1 - y0) / 2), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const place = ([x, y]) => [size / 2 + (x - cx) * S, size / 2 + (y - cy) * S];

  const m = { ambient: 0.16, diffuse: 0.66, spec: simple ? 0.14 : 0.28 };
  let body = "";
  for (const f of fine) {
    const c = f.ramp.shade(f.n, { ...m, exposure: f.exposure });
    body += `<path d="${pathOf(f.q.map(place))}" fill="${c}" stroke="${c}" stroke-width="1.3" stroke-linejoin="round"/>`;
  }
  // Eyes on the brow, following the hood's curve, with a glint towards the light.
  for (const phi of [-21, 21]) {
    const o = { flapY }, t = 0.45;
    const c0 = hoodPoint(phi, t, o);
    const tu = norm(sub(hoodPoint(phi + 0.5, t, o), hoodPoint(phi - 0.5, t, o)));
    const tv = norm(sub(hoodPoint(phi, t + 0.02, o), hoodPoint(phi, t - 0.02, o)));
    let nrm = norm(cross(tu, tv));
    if (dot(nrm, [c0[0], 0, c0[2]]) < 0) nrm = mul(nrm, -1);
    if (view(nrm, v)[2] < 0.15) continue;
    const [rx, ry] = simple ? [5.6, 4.6] : [4.2, 3.4];
    const C = place(view(add(c0, mul(nrm, 0.3)), v)), U = view(mul(tu, rx * S), v), V = view(mul(tv, ry * S), v);
    body += `<ellipse rx="1" ry="1" fill="${EYE}" transform="matrix(${[U[0], U[1], V[0], V[1], C[0], C[1]].map(f1).join(" ")})"/>`;
    if (!simple) body += `<circle cx="${f1(C[0] - 1.3 * S)}" cy="${f1(C[1] - 1.2 * S)}" r="${f1(1.05 * S)}" fill="#ffffff" fill-opacity="0.85"/>`;
  }
  const ring = `<g fill="${OUTLINE}" stroke="${OUTLINE}" stroke-width="${f1(size * outlineW * 2)}" stroke-linejoin="round">${coarse.map((f) => `<path d="${pathOf(f.q.map(place))}"/>`).join("")}</g>`;
  return ring + body;
}

/**
 * The hood on a transparent background with a dark outline: toolbar and app icon, header
 * logo, Ice Cavern door. `simple` is the version for 32 px and under.
 */
export function bare({ size = 512, fill = 0.44, outline, simple = false, view: v = simple ? SMALL_VIEW : VIEW } = {}) {
  const outlineW = outline ?? (simple ? 0.045 : 0.022);
  return svgDoc({ size, body: draw({ size, fill, simple, v, outlineW }), title: "Bunny Hood" });
}
