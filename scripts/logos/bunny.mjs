// bunny-hood: the Bunny Hood from Ocarina of Time, at an angle like the game's render. An
// original drawing after the item: a hood that covers the head, with a pointed flap at each
// side and two small dark eyes on the brow, and two long rounded ears with a rolled
// golden tan rim around a concave plum hollow.
// It is a small 3D model: smooth surfaces in fine facets, turned a little, each facet
// shaded by the shared light (engine.mjs) and drawn back to front. One mark on a transparent
// background with a dark outline, like Lens of Truth's, plus a version for 32 px and under
// (shorter, wider ears, bigger eyes, turned less) that fills a small square.
// Model units: the head is about 66 wide; x right, y down, z towards the viewer.
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
// Hood: a cap over the head (an ellipsoid round HEAD_Y with radii RX, RY, RZ, y down). The
// dome covers the crown all the way round (domeBottom); below it the band wraps the front
// and sides to the brow's lower edge, and past FLAP_START narrows to a point: the flaps.
const HEAD_Y = 60, RX = 33, RY = 32, RZ = 28, BAND_TOP = 50;
const PHI_MAX = 106, FLAP_START = 64, THICK = 2.4;
/** The band's top and bottom edges at angle φ (0 at the front). */
function bandEdges(phi, flapY) {
  const a = Math.abs(phi);
  if (a <= FLAP_START) return [BAND_TOP, 75 + 8 * (a / FLAP_START) ** 1.6];
  const s = (a - FLAP_START) / (PHI_MAX - FLAP_START);
  return [BAND_TOP + (flapY - BAND_TOP) * s ** 2.2, 83 + (flapY - 83) * s ** 0.55];
}
/** A point on the head's surface at angle φ and height y; the brow bulges a little. */
function headPoint(phi, y, inset = 0) {
  const k = (HEAD_Y - y) / RY, r = y < HEAD_Y ? Math.sqrt(Math.max(0, 1 - k * k)) : 1;
  const brow = 2.5 * Math.sin(Math.PI * Math.min(1, Math.max(0, (y - BAND_TOP) / 26)));
  return [(RX - inset) * r * Math.sin(phi * D), y, ((RZ - inset) * r + brow) * Math.cos(phi * D)];
}
/** Where the dome stops: on the band's top edge round the front and sides (so the flaps grow
 * out of it without a notch), and at most DOME_LOW, which is also its edge at the back. */
const DOME_LOW = 64;
const domeBottom = (phi, flapY) => (Math.abs(phi) <= PHI_MAX ? Math.min(bandEdges(phi, flapY)[0], DOME_LOW) : DOME_LOW);
const outward = (q) => { const c = centroid(q); return [c[0], Math.min(0, c[1] - HEAD_Y), c[2]]; };

// Ear: from its base (set into the dome) along its axis a; v runs across it,
// -1..1. The middle (|v| < HOLLOW) dips into the plum hollow; the rim rolls round it.
const HOLLOW = 0.52;
function earFrame(side, { phi = 26, splay = 11, lean = 10, turn = 16 } = {}) {
  const top = headPoint(side * phi, 37);
  const base = add(top, mul(norm(outward([top])), -2.5)); // set into the dome
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
function model({ earL = 76, earW = 15.5, earPhi = 30, earSplay = 14, flapY = 98, res = 1 } = {}) {
  const R = (n) => Math.max(2, Math.round(n * res));
  const around = (u) => -PHI_MAX + 2 * PHI_MAX * u;
  const band = (u, v, inset) => { const phi = around(u), [t, b] = bandEdges(phi, flapY); return headPoint(phi, t + (b - t) * v, inset); };
  const facets = [
    // The dome, all the way round, from the crown down to the band.
    ...grid((u, v) => { const phi = -180 + 360 * u, top = HEAD_Y - RY + 0.5; return headPoint(phi, top + (domeBottom(phi, flapY) - top) * v ** 0.8); }, R(48), R(9), () => tan, outward),
    ...grid((u, v) => band(u, v, 0), R(44), R(10), () => tan, outward),
    // The inside of the band, seen past the far flap: in shadow.
    ...grid((u, v) => band(u, v, THICK), R(32), R(6), () => tan, (q) => mul(outward(q), -1), -0.16),
  ];
  for (const side of [-1, 1]) {
    const f = earFrame(side, { phi: earPhi, splay: earSplay }), o = { L: earL, W: earW };
    facets.push(
      ...[...grid((u, v) => earPoint(f, u, -1 + 2 * v, o), R(24), R(18), (u, v) => (Math.abs(-1 + 2 * v) < HOLLOW * 0.92 && u < 0.94 ? plum : tan), () => f.n),
        ...grid((u, v) => earPoint(f, u, -1 + 2 * v, { ...o, back: true }), R(18), R(6), () => tan, () => mul(f.n, -1), -0.06)].map((x) => ({ ...x, ear: true })),
    );
  }
  return facets;
}

// --- Drawing -----------------------------------------------------------------
// Nearly front on, like the family's other emblems, turned and tilted just a little so the
// face looks to the right. The small version is turned less still.
export const VIEW = { yaw: 12, pitch: -2, roll: 6 };
const SMALL_VIEW = { yaw: 8, pitch: -2, roll: 4 };
const view = (p, v) => rotZ(rotX(rotY(p, v.yaw), v.pitch), v.roll);

function project(facets, v) {
  return facets.map((f) => {
    const q = f.q.map((p) => view(p, v));
    let n = cross(sub(q[2], q[0]), sub(q[3], q[1]));
    if (dot(n, view(f.out, v)) < 0) n = mul(n, -1);
    return { ...f, q, n: norm(n), depth: centroid(q)[2] };
  });
}

function draw({ size, fill, simple, v, outlineW, tweak }) {
  const shape = { ...(simple ? { earL: 62, earW: 15.5, earPhi: 32, earSplay: 19, flapY: 92 } : {}), ...tweak };
  // Visible facets, back to front (half as fine for the small version, which is never shown
  // large); the coarse model (both sides) gives the outline.
  // The ears are drawn over the cap they rise from, so their bases sit cleanly on the dome.
  const fine = project(model({ ...shape, res: simple ? 0.5 : 1 }), v).filter((f) => f.n[2] > 0)
    .sort((a, b) => (a.ear ?? false) - (b.ear ?? false) || a.depth - b.depth);
  const coarse = project(model({ ...shape, res: 0.3 }), v);
  const pts = coarse.flatMap((f) => f.q);
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const S = (size * fill) / (Math.max(x1 - x0, y1 - y0) / 2), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const place = ([x, y]) => [size / 2 + (x - cx) * S, size / 2 + (y - cy) * S];

  const m = { ambient: 0.2, diffuse: 0.64, spec: simple ? 0.14 : 0.26 };
  // A base in each surface's middle tone under the fine facets, so the hairline seams between
  // them show a matching colour rather than the dark outline (as on Saria's Song).
  let body = coarse.filter((f) => f.n[2] > 0).sort((a, b) => (a.ear ?? false) - (b.ear ?? false) || a.depth - b.depth)
    .map((f) => { const c = f.ramp.tone(0.6); return `<path d="${pathOf(f.q.map(place))}" fill="${c}" stroke="${c}" stroke-width="1"/>`; }).join("");
  for (const f of fine) {
    const c = f.ramp.shade(f.n, { ...m, exposure: f.exposure });
    body += `<path d="${pathOf(f.q.map(place))}" fill="${c}" stroke="${c}" stroke-width="1.3" stroke-linejoin="round"/>`;
  }
  // Eyes on the brow, following the hood's curve, with a glint towards the light.
  for (const phi of [-21, 21]) {
    const y = 63, c0 = headPoint(phi, y);
    const tu = norm(sub(headPoint(phi + 0.5, y), headPoint(phi - 0.5, y)));
    const tv = norm(sub(headPoint(phi, y + 0.5), headPoint(phi, y - 0.5)));
    let nrm = norm(cross(tu, tv));
    if (dot(nrm, outward([c0])) < 0) nrm = mul(nrm, -1);
    if (view(nrm, v)[2] < 0.15) continue;
    const [rx, ry] = simple ? [6.2, 5.2] : [5.5, 4.5];
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
export function bare({ size = 512, fill = 0.44, outline, simple = false, view: v = simple ? SMALL_VIEW : VIEW, tweak = {} } = {}) {
  const outlineW = outline ?? (simple ? 0.045 : 0.022);
  return svgDoc({ size, body: draw({ size, fill, simple, v, outlineW, tweak }), title: "Bunny Hood" });
}
