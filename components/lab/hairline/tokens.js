/**
 * Tokens: a palette tray of twenty-four wells, six by four, one well per
 * token. The values the audit found lie on it as thin chips, crooked and
 * piled by hand; near the pointer every chip slides square onto its well, on
 * its well's spring, and the falloff by distance leaves the far ones as they
 * were. At rest the tray is half sorted: a crooked rise at the back, square
 * stacks at the front, and the nearest well lit. The slider is the radius, in
 * wells.
 *
 * Diagrama ilustrativo del caso «Design system: 267 → 24 tokens»: las 24
 * celdas son los 24 tokens; las pilas no son el recuento por token, que no se
 * midió.
 */
const {
  Cam, clamp, facing, fit, poly, prism, proj, rings, rrect, ringAt, unproj, spring, stepS,
  mk, pointer, put, register, disposer, solid,
} = HL;

const NX = 6, NY = 4, CELL = 24, CHIP = 11, CH = 5, PB = 6, PAD = 8;
const EX = NX * CELL, EY = NY * CELL;
/** Chips per well, row by row. Illustrative: not the audit's count per token. */
const PILE = [2, 3, 1, 2, 3, 2, 1, 3, 2, 1, 2, 2, 3, 1, 2, 3, 1, 3, 2, 2, 1, 3, 2, 1];

/** The share of full answer at u radii from the pointer: 1 → .31 at 42% → .09 at the edge and beyond. */
const falloff = (u) =>
  u <= 0 ? 1 : u <= 0.417 ? 1 - (u / 0.417) * 0.6875 : u <= 1 ? 0.3125 - ((u - 0.417) / 0.583) * 0.2185 : 0.094;
/** How far a well is pulled square: 1 under the pointer, 0 at the radius and beyond. */
const pull = (u) => (falloff(u) - 0.094) / 0.906;
/** A fixed jitter in −1…1, so the pile lies the same way on every load. */
const jit = (n) => { const s = Math.sin(n * 12.9898) * 43758.5453; return (s - Math.floor(s)) * 2 - 1; };
/** A ring turned by a radians and moved to (cx, cy), its normals turned with it. */
const turn = (ring, cx, cy, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: cx + q.u * c - q.v * s, v: cy + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.66);
  const TOP = Math.max(...PILE) * CH;
  fit(C, [[-PAD, -PAD, -PB], [EX + PAD, EY + PAD, -PB], [EX + PAD, -PAD, -PB], [-PAD, EY + PAD, -PB], [0, 0, TOP]], 200, 166);
  const P = proj(C), front = facing(C);
  let R = value * CELL, over = null;

  // The tray, then every well's rim on its face: all of it lies under the chips.
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(-PAD, -PAD, EX + PAD, EY + PAD, 10, 2.2);
  put(solid(g), prism(P, front, tr, ti, -PB, 0));
  const [cr, ci] = rings(-CHIP / 2, -CHIP / 2, CHIP / 2, CHIP / 2, 2.6, 0.9);
  const wells = [];
  for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
    const u = i / (NX - 1), v = j / (NY - 1), cx = (i + 0.5) * CELL, cy = (j + 0.5) * CELL;
    // How crooked the well's pile lies at rest: a rise at the back corner, square at the front.
    const loose = clamp(1.25 * Math.exp(-((u - 0.1) ** 2 + (v - 0.15) ** 2) / 0.6) - 0.2, 0, 1);
    const rim = mk("path", { class: "lo nf", d: poly(ringAt(P, rrect(cx - 9, cy - 9, cx + 9, cy + 9, 3.5), 0)) }, g);
    wells.push({ i, j, cx, cy, loose, rim, sp: spring(loose, { eps: 0.002 }), chips: [], drawn: NaN });
  }
  // Chips diagonal by diagonal from the back corner, bottom chip first. A chip
  // never leaves its own cell (offset 4 + a turned half-width under 8), so
  // this order stays the painting order in every pose.
  for (let s = 0; s <= NX + NY - 2; s++) for (const w of wells) {
    if (w.i + w.j !== s) continue;
    for (let k = 0; k < PILE[w.j * NX + w.i]; k++) {
      const id = (w.j * NX + w.i) * 3 + k;
      w.chips.push({ k, dx: 4 * jit(id), dy: 4 * jit(id + 101), a: 0.75 * jit(id + 202), el: solid(g) });
    }
  }

  // A well whose spring hasn't moved keeps its paths: most of the tray is still on most frames.
  function drawWell(w) {
    const t = w.sp.x;
    if (t === w.drawn) return;
    w.drawn = t;
    for (const c of w.chips) {
      // Loose, the pile slumps to a quarter of its height; square, it stands as one column.
      const x = w.cx + c.dx * t, y = w.cy + c.dy * t, a = c.a * t, z = c.k * CH * (1 - 0.75 * t);
      put(c.el, prism(P, front, turn(cr, x, y, a), turn(ci, x, y, a), z, z + CH - 0.6));
    }
  }

  // One highlight: a well's rim and its chips. At rest, the nearest square well.
  const mark = wells.reduce((a, b) => (b.loose < a.loose || (b.loose === a.loose && b.i + b.j > a.i + a.j) ? b : a));
  let lit = null;
  function light(w) {
    if (w === lit) return;
    if (lit) { lit.rim.classList.replace("hi", "lo"); lit.chips.forEach((c) => c.el.sil.classList.remove("hi")); }
    lit = w;
    w.rim.classList.replace("lo", "hi");
    w.chips.forEach((c) => c.el.sil.classList.add("hi"));
  }
  light(mark);

  const B = register(stage, (dt) => {
    let m = false;
    for (const w of wells) { if (stepS(w.sp, dt)) m = true; drawWell(w); }
    return m;
  });
  bag.add(B.unregister);

  function retarget() {
    for (const w of wells) {
      w.sp.t = over ? w.loose * (1 - pull(Math.hypot(w.cx - over[0], w.cy - over[1]) / R)) : w.loose;
    }
    if (over) {
      const i = clamp(Math.floor(over[0] / CELL), 0, NX - 1), j = clamp(Math.floor(over[1] / CELL), 0, NY - 1);
      light(wells[j * NX + i]);
      read.textContent = `tok ${String(j * NX + i + 1).padStart(2, "0")}`;
    } else { light(mark); read.textContent = "rest"; }
    B.wake();
  }

  // The pointer lands on a fixed plane at the piles' middle height, so a tall
  // pile doesn't pick the well behind it, and nothing moving is ever measured.
  bag.add(pointer(stage, {
    move: (p) => { over = unproj(C, p[0], p[1], CH * 1.5); retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { R = v * CELL; if (over) retarget(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "tokens",
  means: "Loose values lie crooked on a tray of 24 wells; near the pointer each one slides square onto its token.",
  rules: [1, 3, 5, 9],
  range: [1.4, 2.4, 3.6],
  tour: [[172, 115], [115, 129], [242, 150], null],
  mount,
});
