#!/usr/bin/env node
/* Validate situations.js. Plain node, no deps.
     node validate-situations.mjs            # from the app/ directory
   Exits 0 clean, 1 on any error. Warnings never fail the build.

   Checks: schema conformance, unique ids, legal age bands, coordinates inside the
   rink, frame timing, puck ownership, implausible skating distance between frames,
   menu reachability (the offsides bug as a test) and every cue present in
   audio/lines.json. */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

/* ---- load the data the same way the browser does: as a plain script ---- */
let SITUATIONS, RINK;
try {
  const src = readFileSync(join(here, 'situations.js'), 'utf8');
  ({ SITUATIONS, RINK } = new Function(src + '\n;return {SITUATIONS, RINK};')());
} catch (e) {
  console.error('FATAL: situations.js did not parse — ' + e.message);
  process.exit(1);
}

/* ---- rules ---- */
const BANDS = ['8U', '10U', '12U', '14U', '16U', '18U'];
const OURS = ['G', 'LD', 'RD', 'C', 'LW', 'RW'];
const THEIRS = ['X1', 'X2', 'X3', 'X4', 'X5', 'XG'];
const PHASES = ['D', 'T', 'O'];
/* a token may sit slightly off the boards, and a focus rect may overhang them */
const X = [-6, 206];
const Y = [-6, 91];
/* 200 ft of ice in roughly 4 frames means ~50 ft a frame is normal and 85 is the
   whole sheet end to end. Over 95 ft between consecutive frames is a teleport. */
const MAX_JUMP = 95;

const isNum = (v) => typeof v === 'number' && isFinite(v);
const isStr = (v) => typeof v === 'string' && v.length > 0;
const isPt = (v) => Array.isArray(v) && v.length >= 2 && isNum(v[0]) && isNum(v[1]);
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

if (!Array.isArray(SITUATIONS) || !SITUATIONS.length) err('SITUATIONS is not a non-empty array');
if (!RINK || !isNum(RINK.length)) err('RINK constants are missing');

/* ---- per situation ---- */
const seen = new Map();
for (const s of SITUATIONS) {
  const at = `[${s && s.id ? s.id : '?'}]`;

  if (!isStr(s.id)) { err(`${at} id must be a non-empty string`); continue; }
  if (!/^[a-z][a-z0-9]*$/.test(s.id)) err(`${at} id must be lowercase letters/digits, no spaces`);
  if (seen.has(s.id)) err(`${at} duplicate id (also at index ${seen.get(s.id)})`);
  seen.set(s.id, SITUATIONS.indexOf(s));

  if (!isStr(s.name)) err(`${at} name is required`);
  if (!isStr(s.about)) err(`${at} about is required`);
  if (!PHASES.includes(s.phase)) err(`${at} phase must be one of ${PHASES.join('/')}, got ${JSON.stringify(s.phase)}`);
  if (!isNum(s.order)) err(`${at} order must be a number (menu sort)`);

  if (!Array.isArray(s.ages) || !s.ages.length) err(`${at} ages must be a non-empty array`);
  else for (const a of s.ages) if (!BANDS.includes(a)) err(`${at} illegal age band ${JSON.stringify(a)} — allowed: ${BANDS.join(', ')}`);

  if (!Array.isArray(s.focus) || s.focus.length !== 4 || !s.focus.every(isNum)) err(`${at} focus must be [x,y,w,h]`);
  else {
    /* a camera rect may sit further outside the boards than a player may */
    const FX = [-10, 210], FY = [-10, 95];
    const [fx, fy, fw, fh] = s.focus;
    if (fx < FX[0] || fx + fw > FX[1]) err(`${at} focus overhangs the rink on x: ${fx}..${fx + fw} (allowed ${FX[0]}..${FX[1]})`);
    if (fy < FY[0] || fy + fh > FY[1]) err(`${at} focus overhangs the rink on y: ${fy}..${fy + fh} (allowed ${FY[0]}..${FY[1]})`);
    if (fw <= 0 || fh <= 0) err(`${at} focus width/height must be positive`);
  }

  if (!Array.isArray(s.roster) || !s.roster.length) err(`${at} roster must be a non-empty array`);
  else for (const p of s.roster) if (!OURS.includes(p)) err(`${at} roster has unknown player code ${JSON.stringify(p)} — allowed: ${OURS.join(', ')}`);

  /* ---- coach ---- */
  if (!s.coach || typeof s.coach !== 'object') err(`${at} coach is required`);
  else {
    for (const p of Object.keys(s.coach)) {
      if (!OURS.includes(p)) err(`${at} coach has unknown player code ${JSON.stringify(p)}`);
      const c = s.coach[p];
      if (!isStr(c.job)) err(`${at} coach.${p}.job is required`);
      if (c.look) for (const l of c.look) {
        if (!isStr(l.label)) err(`${at} coach.${p}.look entry needs a label`);
        const to = l.to;
        const ok = to === 'puck' || to === 'ourNet' || to === 'theirNet' ||
                   OURS.includes(to) || THEIRS.includes(to) || isPt(to);
        if (!ok) err(`${at} coach.${p}.look "to" is not a player, landmark or [x,y]: ${JSON.stringify(to)}`);
      }
      if (c.do && !Array.isArray(c.do)) err(`${at} coach.${p}.do must be an array`);
    }
    for (const p of (s.roster || [])) if (p !== 'G' && !s.coach[p]) warn(`${at} no coach entry for rostered ${p}`);
  }

  /* ---- variants and frames ---- */
  if (!Array.isArray(s.variants) || !s.variants.length) { err(`${at} variants must be a non-empty array`); continue; }
  const vids = new Set();
  let hasRight = false;
  for (const v of s.variants) {
    const va = `${at}/${v && v.id ? v.id : '?'}`;
    if (!isStr(v.id)) { err(`${va} variant id required`); continue; }
    if (vids.has(v.id)) err(`${va} duplicate variant id`);
    vids.add(v.id);
    if (!isStr(v.name)) err(`${va} variant name required`);
    if (!v.wrong) hasRight = true;

    if (!Array.isArray(v.frames) || v.frames.length < 2) { err(`${va} needs at least 2 frames`); continue; }

    /* timing */
    if (v.frames[0].t !== 0) err(`${va} first frame t must be 0, got ${v.frames[0].t}`);
    if (v.frames[v.frames.length - 1].t !== 1) err(`${va} last frame t must be 1, got ${v.frames[v.frames.length - 1].t}`);
    for (let i = 1; i < v.frames.length; i++) {
      if (!(v.frames[i].t > v.frames[i - 1].t)) err(`${va} frame ${i} t=${v.frames[i].t} is not greater than frame ${i - 1} t=${v.frames[i - 1].t}`);
    }

    /* positions, ownership, and skating distance - carrying forward like the app does */
    const last = {};
    v.frames.forEach((f, i) => {
      const fa = `${va} frame ${i}`;
      if (!isNum(f.t)) err(`${fa}: t must be a number`);
      if (!isStr(f.cue)) err(`${fa}: cue is required`);
      if (i === 0 && (!f.us || !Object.keys(f.us).length)) err(`${fa}: the first frame must place the whole roster`);

      for (const side of ['us', 'them']) {
        if (f[side] == null) continue;
        if (typeof f[side] !== 'object') { err(`${fa}: ${side} must be an object`); continue; }
        for (const id of Object.keys(f[side])) {
          const legal = side === 'us' ? OURS : THEIRS;
          if (!legal.includes(id)) err(`${fa}: ${side} has unknown code ${JSON.stringify(id)}`);
          if (side === 'us' && s.roster && !s.roster.includes(id)) err(`${fa}: ${id} is not on the roster`);
          const p = f[side][id];
          if (!isPt(p)) { err(`${fa}: ${id} is not [x,y]`); continue; }
          if (p[0] < X[0] || p[0] > X[1]) err(`${fa}: ${id} x=${p[0]} is off the rink (${X[0]}..${X[1]})`);
          if (p[1] < Y[0] || p[1] > Y[1]) err(`${fa}: ${id} y=${p[1]} is off the rink (${Y[0]}..${Y[1]})`);
          if (last[id]) {
            const d = dist(last[id], p);
            if (d > MAX_JUMP) err(`${fa}: ${id} jumps ${d.toFixed(0)} ft since it last moved (limit ${MAX_JUMP} ft)`);
          }
          last[id] = p;
        }
      }

      if (!f.puck) err(`${fa}: puck is required`);
      else if (!isPt(f.puck)) err(`${fa}: puck must be [x,y] or [x,y,'OWNER']`);
      else {
        if (f.puck[0] < X[0] || f.puck[0] > X[1] || f.puck[1] < Y[0] || f.puck[1] > Y[1]) err(`${fa}: puck is off the rink`);
        const own = f.puck[2];
        if (own != null) {
          if (!OURS.includes(own) && !THEIRS.includes(own)) err(`${fa}: puck owner ${JSON.stringify(own)} is not a player code`);
          else if (!last[own]) err(`${fa}: puck owner ${own} has no position in this frame or any earlier one`);
        }
      }
    });
  }
  if (!hasRight) err(`${at} every variant is wrong:true — there is nothing correct to compare against`);

  /* ---- per-variant maps must reference real variants ---- */
  for (const [field, label] of [['phases', 'phases'], ['next', 'next'], ['keys', 'keys.v']]) {
    const m = field === 'keys' ? (s.keys && s.keys.v) : s[field];
    if (!m) continue;
    for (const k of Object.keys(m)) if (!vids.has(k)) err(`${at} ${label} names variant ${JSON.stringify(k)}, which does not exist`);
  }
  if (s.phases) for (const k of Object.keys(s.phases)) {
    const v = s.variants.find((x) => x.id === k);
    if (v && Array.isArray(s.phases[k]) && s.phases[k].length !== v.frames.length)
      err(`${at} phases.${k} has ${s.phases[k].length} entries but the variant has ${v.frames.length} frames`);
    if (Array.isArray(s.phases[k])) for (const p of s.phases[k]) if (!PHASES.includes(p)) err(`${at} phases.${k} has illegal phase ${JSON.stringify(p)}`);
  }

  /* ---- quiz ---- */
  const anyWrong = s.variants.some((v) => v.wrong);
  for (const q of (s.tests || [])) {
    if (!isStr(q.q)) err(`${at} a test is missing its question`);
    if (!Array.isArray(q.o) || q.o.length < 2) err(`${at} test "${String(q.q).slice(0, 30)}" needs at least 2 options`);
    else if (!isNum(q.a) || q.a < 0 || q.a >= q.o.length) err(`${at} test "${String(q.q).slice(0, 30)}" answer index ${q.a} is out of range`);
    if (!isStr(q.why)) warn(`${at} test "${String(q.q).slice(0, 30)}" has no why-text`);
  }
  for (const q of (s.placeq || [])) {
    if (!OURS.includes(q.pos)) err(`${at} placeq pos ${JSON.stringify(q.pos)} is not a player code`);
    else if (s.roster && !s.roster.includes(q.pos)) err(`${at} placeq pos ${q.pos} is not on the roster`);
    if (!isStr(q.ask)) err(`${at} a placeq is missing its ask text`);
    const v = q.v ? s.variants.find((x) => x.id === q.v) : s.variants[0];
    if (q.v && !v) err(`${at} placeq pins variant ${JSON.stringify(q.v)}, which does not exist`);
    if (v && (!isNum(q.fr) || q.fr < 0 || q.fr >= v.frames.length)) err(`${at} placeq fr=${q.fr} is out of range for variant ${v ? v.id : '?'} (${v ? v.frames.length : 0} frames)`);
    if (anyWrong && !q.v) err(`${at} placeq must pin a variant with v: — this situation has a wrong:true variant, and an unpinned question can grade against the mistake`);
    if (v && v.wrong) err(`${at} placeq is pinned to ${v.id}, which is wrong:true — a mistake variant has no answer key`);
  }

  /* ---- the soft ones: each has a visible failure mode in the app ---- */
  if (!s.tests || !s.tests.length) warn(`${at} no tests — "Quiz me on this" will fall through to the global pool and ask about other situations`);
  if (!s.roles) warn(`${at} no roles — the "Label the other team" setting will do nothing here`);
  if ((!s.videos || !s.videos.length) && !s.searchq) warn(`${at} no videos and no searchq — the video modal has nothing to offer`);
  else if (!s.videos || !s.videos.length) warn(`${at} no hand-picked videos — the modal falls back to the searchq`);
  if (!s.searchq) warn(`${at} no searchq`);
  if (!s.keys) warn(`${at} no keys — the coach prompt cannot find this situation`);
  if (!s.next) warn(`${at} no next — this situation dead-ends with no next-bar`);
}

/* ---- the rendered PATH, not just the keyframes ----
   A play is watched as continuous motion, so a violation can live entirely between
   two legal keyframes. This samples the interpolated path the way the app draws it.
   That is how offside/onside shipped with the winger crossing the line at 22% of a
   segment while the puck crossed at 69% - legal at every keyframe, wrong on screen. */
const BLUE = 125;
const seriesOf = (v, side, id) => { const o = []; for (const f of v.frames) if (f[side] && f[side][id]) o.push({ t: f.t, p: f[side][id] }); return o; };
const sampleAt = (ser, t) => {
  if (!ser.length) return null;
  if (t <= ser[0].t) return ser[0].p;
  if (t >= ser[ser.length - 1].t) return ser[ser.length - 1].p;
  for (let i = 1; i < ser.length; i++) if (t <= ser[i].t) {
    const a = ser[i - 1], b = ser[i], k = (t - a.t) / (b.t - a.t);
    return [a.p[0] + (b.p[0] - a.p[0]) * k, a.p[1] + (b.p[1] - a.p[1]) * k];
  }
  return ser[ser.length - 1].p;
};
const STEPS = 400;
for (const s of SITUATIONS) {
  for (const v of s.variants) {
    if (!Array.isArray(v.frames) || v.frames.length < 2) continue;
    const ps = v.frames.filter((f) => f.puck).map((f) => ({ t: f.t, p: f.puck }));
    if (!ps.length) continue;
    let puckIn = null;
    for (let k = 0; k <= STEPS; k++) { const t = k / STEPS; if (sampleAt(ps, t)[0] >= BLUE) { puckIn = t; break; } }
    for (const id of (s.roster || [])) {
      if (id === 'G') continue;
      const ser = seriesOf(v, 'us', id);
      if (!ser.length) continue;
      let first = null;
      for (let k = 0; k <= STEPS; k++) { const t = k / STEPS; if (sampleAt(ser, t)[0] > BLUE) { first = t; break; } }
      if (first === null) continue;
      const msg = puckIn === null
        ? `[${s.id}/${v.id}] ${id} skates into their zone but the puck never gets in — offside on screen`
        : `[${s.id}/${v.id}] ${id} crosses their blue line at t=${first.toFixed(3)} but the puck does not until t=${puckIn.toFixed(3)} — offside for ${((puckIn - first) * 100).toFixed(0)}% of the play`;
      if (puckIn === null || first < puckIn - 0.002) { if (v.wrong) warn(msg + ' (wrong:true, presumably the point)'); else err(msg); }
    }
    /* two players of the SAME team must not occupy the same patch of ice */
    const cur = {};
    v.frames.forEach((f, i) => {
      for (const side of ['us', 'them']) for (const id of Object.keys(f[side] || {})) cur[id] = { p: f[side][id], side };
      const ids = Object.keys(cur);
      for (let a = 0; a < ids.length; a++) for (let b = a + 1; b < ids.length; b++) {
        const A = cur[ids[a]], B = cur[ids[b]];
        const d = Math.hypot(A.p[0] - B.p[0], A.p[1] - B.p[1]);
        if (d < 1) err(`[${s.id}/${v.id}] frame ${i}: ${ids[a]} and ${ids[b]} are ${d.toFixed(1)} ft apart — drawn on top of each other`);
        else if (d < 4 && A.side === B.side) warn(`[${s.id}/${v.id}] frame ${i}: teammates ${ids[a]} and ${ids[b]} are only ${d.toFixed(1)} ft apart`);
      }
    });
    /* goalies belong in front of their own net */
    const g = {};
    v.frames.forEach((f, i) => {
      for (const side of ['us', 'them']) for (const id of Object.keys(f[side] || {})) if (id === 'G' || id === 'XG') g[id] = f[side][id];
      if (g.XG && g.XG[0] < 150) err(`[${s.id}/${v.id}] frame ${i}: their goalie is at x=${g.XG[0]}, nowhere near their net`);
      if (g.G && g.G[0] > 50) err(`[${s.id}/${v.id}] frame ${i}: our goalie is at x=${g.G[0]}, nowhere near our net`);
    });
  }
}

/* ---- next-step targets must exist ---- */
for (const s of SITUATIONS) {
  for (const k of Object.keys(s.next || {})) {
    const n = s.next[k];
    const tgt = SITUATIONS.find((x) => x.id === n.sit);
    if (!tgt) { err(`[${s.id}] next.${k} points at situation ${JSON.stringify(n.sit)}, which does not exist`); continue; }
    if (n.v && !tgt.variants.some((v) => v.id === n.v)) err(`[${s.id}] next.${k} points at ${n.sit}/${n.v}, and that variant does not exist`);
    if (!isStr(n.label)) warn(`[${s.id}] next.${k} has no label`);
  }
}

/* ---- menu reachability: the offsides bug, as a test ---- */
const html = (() => { try { return readFileSync(join(here, 'index.html'), 'utf8'); } catch { return ''; } })();
if (html) {
  const ids = SITUATIONS.map((s) => s.id);
  /* FORMKEYS is the play-builder's keyword index; words like 'forecheck' there are
     search terms, not situation references. Exclude it before scanning. */
  const fk = html.indexOf('const FORMKEYS');
  const scan = fk < 0 ? html
    : html.slice(0, fk) + html.slice(html.indexOf('};', fk) + 2);
  const hardcoded = ids.filter((id) => new RegExp(`['"]${id}['"]\\s*:|\\bbyId\\.${id}\\b`).test(scan));
  if (hardcoded.length) err(`index.html names situation ids (${hardcoded.join(', ')}) — situations.js must be the only source of truth`);
  if (/const\s+order\s*=\s*\[/.test(html)) err('index.html still has a hardcoded order array');
  const unreachable = SITUATIONS.filter((s) => !isNum(s.order) || !PHASES.includes(s.phase));
  if (unreachable.length) err(`unreachable in the menu (need order + a valid phase): ${unreachable.map((s) => s.id).join(', ')}`);
}

/* ---- every cue has a recorded line ---- */
let lines = null;
try { lines = JSON.parse(readFileSync(join(here, 'audio', 'lines.json'), 'utf8')); }
catch { warn('audio/lines.json unreadable — skipped the audio coverage check'); }
if (lines) {
  /* mirror the app: sayable() then chunk() by sentence, then slug+hash */
  const NUMWORD = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const sayable = (txt) => {
    let s = String(txt).replace(/<[^>]+>/g, ' ');
    s = s.replace(/\bLD\b/g, 'left D').replace(/\bRD\b/g, 'right D')
      .replace(/\bLW\b/g, 'left wing').replace(/\bRW\b/g, 'right wing')
      .replace(/\bF1\b/g, 'F one').replace(/\bF2\b/g, 'F two').replace(/\bF3\b/g, 'F three')
      .replace(/\bD-?zone\b/gi, 'defensive zone').replace(/\bO-?zone\b/gi, 'offensive zone')
      .replace(/\bD-to-D\b/gi, 'D to D').replace(/\bd to d\b/gi, 'D to D')
      .replace(/\bPK\b/g, 'penalty kill').replace(/\bPP\b/g, 'power play')
      .replace(/\bG\b/g, 'goalie').replace(/\bC\b/g, 'center')
      .replace(/\b(\d)-(\d)-(\d)\b/g, (m, a, b, c) => NUMWORD[+a] + ' ' + NUMWORD[+b] + ' ' + NUMWORD[+c])
      .replace(/\b(\d) on (\d)\b/g, (m, a, b) => NUMWORD[+a] + ' on ' + NUMWORD[+b])
      .replace(/\bft\b/g, 'feet').replace(/\bvs\.?\b/gi, 'versus')
      .replace(/\bcentre\b/gi, 'center');
    s = s.replace(/\b[A-Z]{3,}\b/g, (w) => w.charAt(0) + w.slice(1).toLowerCase());
    s = s.replace(/\s+-\s+/g, ', ').replace(/\.\.\./g, ', ')
      .replace(/[()]/g, '').replace(/\s{2,}/g, ' ').trim();
    return s;
  };
  /* must match audioId() in index.html EXACTLY, trailing dash included */
  const audioId = (t) => {
    let h = 0; for (let i = 0; i < t.length; i++) { h = (h * 31 + t.charCodeAt(i)) | 0; }
    const slug = t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48);
    return (slug || 'line') + '-' + (h >>> 0).toString(36);
  };
  const idsFor = (txt) => (String(txt).replace(/<[^>]+>/g, ' ').match(/[^.!?]+[.!?]*/g) || [String(txt)])
    .map(sayable).filter(Boolean).map(audioId);

  const missing = [];
  for (const s of SITUATIONS) {
    const check = (txt, where) => { for (const id of idsFor(txt)) if (!(id in lines)) missing.push(`${where}: ${id}`); };
    check(s.about, `[${s.id}] about`);
    for (const v of s.variants) for (const f of v.frames) check(f.cue, `[${s.id}/${v.id}] cue`);
    for (const p of Object.keys(s.coach || {})) check('Your job. ' + s.coach[p].job, `[${s.id}] coach.${p}.job`);
    for (const q of (s.tests || [])) { check(q.q, `[${s.id}] test q`); check(q.why, `[${s.id}] test why`); for (const o of q.o) check(o + '.', `[${s.id}] test option`); }
    for (const q of (s.placeq || [])) check(q.ask, `[${s.id}] placeq ask`);
  }
  if (missing.length) {
    err(`${missing.length} spoken line(s) have no entry in audio/lines.json — these will fall back to robot voice:`);
    for (const m of missing.slice(0, 25)) err('    ' + m);
    if (missing.length > 25) err(`    …and ${missing.length - 25} more`);
  }
}

/* ---- report ---- */
const frames = SITUATIONS.reduce((n, s) => n + s.variants.reduce((m, v) => m + v.frames.length, 0), 0);
console.log(`situations.js: ${SITUATIONS.length} situations, ${SITUATIONS.reduce((n, s) => n + s.variants.length, 0)} variants, ${frames} frames`);
for (const w of warnings) console.log('WARN  ' + w);
for (const e of errors) console.error('ERROR ' + e);
if (errors.length) { console.error(`\n${errors.length} error(s).`); process.exit(1); }
console.log(warnings.length ? `\nOK with ${warnings.length} warning(s).` : '\nOK.');
