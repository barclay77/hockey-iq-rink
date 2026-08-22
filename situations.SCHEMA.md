# situations.js — schema

`situations.js` is the **only** source of truth for what the app teaches.
`index.html` names no situation and decides no order. Add a situation here, reload,
and it appears in the menu, the age filter, the quiz, the coach prompt, Try mode and
the video list. That is the whole job.

The file is a **plain script** (`const SITUATIONS = [...]`, `const RINK = {...}`),
loaded before the app script. Never a JSON file fetched at runtime — the app reads
`SITUATIONS[0]` at parse time.

Verify any change with `node validate-situations.mjs` before shipping.

---

## Coordinate system

Feet, on a **200 × 85** NHL sheet.

| | |
|---|---|
| `x = 0` | our end boards |
| `x = 200` | their end boards |
| `y = 0` | top boards |
| `y = 85` | bottom boards |
| `y = 42.5` | center ice |

**We always defend the left and attack to the right.** A situation never flips this;
the app's "Flip sides of the ice" setting mirrors `y` at display time only, so authored
data stays in one orientation.

Observed range in the shipped data is `x` 6→194 and `y` 7→77 — players stay off the
boards by a few feet because a token has a radius. The validator allows `-6 … 206` on
`x` and `-6 … 91` on `y` so a `focus` rect can sit slightly outside the boards.

`focus: [x, y, w, h]` is the **camera rectangle** for the situation — the region the
rink zooms to, in the same feet. `[-5,-5,110,95]` frames our end plus a margin;
`[-6,-6,212,97]` is the whole sheet. It is a starting camera, not a clip: the app
widens it to keep every rostered player in view.

### Rink landmarks

`RINK` exports every named line and dot so generated data references a constant
instead of a guessed number. Mirrored pairs read `[ourEnd, theirEnd]`.

```js
RINK.goalLine      // [11, 189]
RINK.blueLine      // [75, 125]
RINK.centerLine    // 100
RINK.endDots       // [[31,20.5],[31,64.5],[169,20.5],[169,64.5]]
RINK.neutralDots   // [[80,20.5],[80,64.5],[120,20.5],[120,64.5]]
RINK.netMouth      // [[11,42.5],[189,42.5]]
RINK.ourZoneX      // [0,75]
RINK.neutralZoneX  // [75,125]
RINK.theirZoneX    // [125,200]
RINK.middleLaneY   // [30,55]
RINK.boardsLaneY   // [[0,22],[63,85]]
```

Also: `length`, `width`, `centerY`, `cornerRadius`, `centerDot`, `centerCircleR`,
`faceoffCircleR`, `hashOffsetX`, `hashInnerY`, `hashOuterY`, `creaseDepth`,
`creaseHalfHeight`, `topBoards`, `bottomBoards`, `attackDirection`.

---

## Player codes

**Ours** — `G`, `LD`, `RD`, `C`, `LW`, `RW`
**Theirs** — `X1`…`X5`, and `XG` for their goalie

By convention **low `y` is the left side of the ice**. Across the shipped data the
medians are `LW` 14, `LD` 30, `RW` 51, `RD` 52 — an `LD` sitting below an `RD` reads
as inverted to anyone checking the cue text against the dots.

`X1`…`X5` are name tags, not positions. What each one *is* comes from `roles`.

---

## Situation fields

| field | type | required | what it does |
|---|---|---|---|
| `id` | string | ✅ | unique, lowercase, no spaces. Used as the key in every lookup. |
| `name` | string | ✅ | menu title, e.g. `'Defensive zone coverage'` |
| `phase` | `'D'` \| `'T'` \| `'O'` | ✅ | which of the three phase columns it lands in. Defence / Transition / Offence. |
| `about` | string | ✅ | one line under the menu card, and spoken in the intro. |
| `order` | number | ✅ | menu sort. Shipped data uses 10, 20, 30 … so a new situation can slot between two without renumbering. |
| `ages` | string[] | ✅ | USA Hockey bands. Only `8U` `10U` `12U` `14U` `16U` `18U`. Several is fine. Drives the age filter. |
| `focus` | `[x,y,w,h]` | ✅ | opening camera rect. |
| `roster` | string[] | ✅ | which of ours are on the ice. Drives the position picker. |
| `variants` | object[] | ✅ | one or more variations. See below. |
| `coach` | object | ✅ | per-position teaching. Keyed by player code. |
| `group` | string | — | defaults to `phase`. Only set it if you need a label that differs. |
| `phases` | object | — | per-variant, per-frame phase override. `{variantId: ['D','D','T','O']}`. Without it every frame uses the situation's `phase`. |
| `next` | object | — | the teaching chain. `{variantId: {sit, v, label}}`. Omit and the situation dead-ends with no next-bar. |
| `roles` | object | — | `{X1:'in the corner', X2:'net front', …}`. Without it the "Label the other team" setting does nothing here. |
| `tests` | object[] | — | multiple-choice bank. Without it "Quiz me on this" falls through to the global pool and asks about *other* situations. |
| `placeq` | object[] | — | placement questions. |
| `videos` | object[] | — | `{id, t, c, w}` — YouTube id, title, channel, why-watch. Without it the video modal claims the situation is a play the user built. |
| `searchq` | string | — | fallback YouTube search string. |
| `keys` | object | — | coach-prompt keywords. `{base: [...], v: {variantId: [...]}}`. Without it typing or speaking the situation's name finds nothing. |

The optional fields are optional to the *parser*, not to the product — each one has a
visible failure mode, listed above. The validator warns on all of them.

---

## Variant fields

| field | type | required | what it does |
|---|---|---|---|
| `id` | string | ✅ | unique within the situation. |
| `name` | string | ✅ | shown in the variation chip row. |
| `note` | string | — | one line under the name. |
| `frames` | object[] | ✅ | the play, in order. |
| `wrong` | boolean | — | **this variant demonstrates a mistake.** See below. |

### `wrong: true`

A variant that exists to show the error, e.g. crossing the blue line before the puck.
It changes three things:

- **No answer key.** `target()` returns `null`, so the ghost, the "N ft off" readout,
  the drag feedback and the quiz check all fall silent. A mistake variant has no
  correct position to compare against — borrowing the correct sibling's positions
  breaks the moment the two stories diverge.
- **Try mode refuses it.** Entering Try switches to the first non-`wrong` sibling,
  because the sim measures against the authored play.
- **Placement questions skip it** unless they pin their own variant with `v:`.

A situation with a `wrong` variant should also have a non-`wrong` one, or there is
nothing to compare to. `placeq` entries for such a situation should carry `v:'<the
correct variant id>'`.

---

## Frame fields

| field | type | required | what it does |
|---|---|---|---|
| `t` | number | ✅ | 0 → 1, ascending. First frame is `0`, last is `1`. It is a fraction of the play, not seconds. |
| `cue` | string | ✅ | the step text, shown under the rink and spoken. |
| `us` | object | ✅ | `{C:[x,y], LW:[x,y], …}` |
| `them` | object | — | `{X1:[x,y], …}` |
| `puck` | `[x,y]` or `[x,y,'OWNER']` | ✅ | position, and who has it. Loose puck omits the owner. |

**Frames list only players who moved.** A player omitted from a frame holds the
position they had in the previous frame — the app interpolates between the frames that
mention them. So frame 0 should place everyone on the roster, and later frames name
only the movers. That is why frames get shorter down the list.

`puck[2]` is a player code that must appear in that frame's `us`/`them` **or** in an
earlier frame (it can be carried by someone who has not moved).

---

## Coach fields

Keyed by player code. Every rostered skater should have an entry.

| field | type | required | what it does |
|---|---|---|---|
| `job` | string | ✅ | the one-line summary. Spoken as "Your job. …" |
| `look` | object[] | — | `[{n:1, label:'The puck', to:'puck'}]` — where the eyes go, in order. `to` is a player code, `'puck'`, `'ourNet'`, `'theirNet'`, or a literal `[x,y]`. Drawn as vision beams, brightest first. |
| `do` | string[] | — | the checklist. |
| `mistake` | string | — | the common error. |
| `remember` | string | — | a short mantra. |

---

## Quiz entries

Both live on the situation.

```js
tests: [
  { q:'the question',
    o:['option one','option two','option three','option four'],
    a:1,                       // index of the correct option
    why:'why that is right' }
]

placeq: [
  { pos:'C',                   // which position the kid places
    fr:0,                      // frame index the question is set at
    ask:'the prompt',
    v:'onside' }               // optional: pin to a variant. Required if any
                               // variant is wrong:true
]
```

Placement answers are graded against `target(pos, frames()[fr].t)` with a 10 ft
tolerance.

---

## ⚠ Cue text determines its audio id

Every spoken line's id is a slug plus a hash of **its exact text**. The same text
always produces the same id, and committed mp3s are keyed to those ids.

**Rewording a cue changes its id and orphans its recording.** That line silently drops
to robot voice until it is re-rendered. So:

- Do not edit existing `cue`, `about`, `job`, `ask`, `q`, `o` or `why` text casually.
- When text does change or get added, run `window.__exportAudioScript()` in the
  console, diff against `audio/lines.json`, write the delta to `audio/to-render.json`
  as `{id: text}`, and re-export `lines.json` in full.
- When the delta is zero, `audio/to-render.json` must be `{}`.

---

## A fully worked example

Every optional field, exercised.

```js
{
  /* ---- identity and placement in the menu ---- */
  id:'example',                       // unique key, used by every lookup
  name:'Example situation',           // menu title
  phase:'T',                          // D / T / O -> which column
  group:'T',                          // optional; defaults to phase
  order:75,                           // sorts between 70 and 80
  about:'One line the menu card and the intro both use.',
  ages:['10U','12U'],                 // USA Hockey bands only

  /* ---- the ice ---- */
  focus:[80,-5,122,95],               // opening camera: neutral zone + their end
  roster:['C','LW','RW','LD','RD'],   // no goalie in this one

  /* ---- what the red players ARE (drives the role labels) ---- */
  roles:{X1:'their D', X2:'their wing', X3:'their wing',
         X4:'their D', X5:'back-checker', XG:'goalie'},

  /* ---- the play ---- */
  variants:[
    { id:'right', name:'The right way', note:'What it looks like when it works.',
      frames:[
        /* frame 0 places EVERYONE on the roster */
        {t:0, cue:'C carries it up the middle.',
         us:{C:[104,42], LW:[110,16], RW:[108,66], LD:[86,32], RD:[84,54]},
         them:{XG:[187,42.5], X1:[132,40], X2:[140,22],
               X3:[140,60], X4:[124,32], X5:[124,54]},
         puck:[104,42.5,'C']},                    // C has it

        /* later frames name only who MOVED - LW/RW/RD hold their last spot */
        {t:0.5, cue:'LD steps up to the line.',
         us:{C:[114,42], LD:[96,32]},
         them:{X1:[134,40]},
         puck:[114,42.5,'C']},

        {t:1, cue:'In clean with the puck.',
         us:{C:[146,40], LW:[152,16], RW:[150,64]},
         them:{X1:[148,44]},
         puck:[146,40.5,'C']}
      ]},

    /* a variant that exists to SHOW THE ERROR - see the wrong:true rules */
    { id:'wrong', name:'The mistake', wrong:true,
      note:'Same rush, one player early.',
      frames:[
        {t:0, cue:'Same rush. Watch the left wing.',
         us:{C:[104,42], LW:[110,16], RW:[108,66], LD:[86,32], RD:[84,54]},
         them:{XG:[187,42.5], X1:[132,40], X2:[140,22],
               X3:[140,60], X4:[124,32], X5:[124,54]},
         puck:[104,42.5,'C']},
        {t:1, cue:'He crossed before the puck. Whistle.',
         us:{LW:[132,16]},
         puck:[112,42.5,'C']}                     // puck never got in
      ]},
  ],

  /* ---- per-frame phase, per variant. Omit and every frame uses phase above ---- */
  phases:{right:['T','T','O'], wrong:['T','T']},

  /* ---- the teaching chain, per variant ---- */
  next:{
    right:{sit:'ozone', v:'cycle', label:'We got in clean. Now go to work.'},
    wrong:{sit:'faceoff', v:'ozone', label:'A whistle means a draw. Win it back.'}
  },

  /* ---- teaching, per position ---- */
  coach:{
    C:{ job:'You have the puck, so you decide when it goes in.',
      look:[{n:1, label:'The blue line', to:[125,42]},   // a literal spot
            {n:2, label:'Your wings',    to:'LW'},        // a player
            {n:3, label:'The puck',      to:'puck'}],     // or the puck
      do:['Carry it in yourself if nobody is open.',
          'Never pass to a man already over the line.'],
      mistake:'Passing to a wing who has already crossed.',
      remember:'Puck first, then feet.' },
    LW:{ job:'Get to the line with speed, then wait.',
      look:[{n:1, label:'The puck', to:'puck'}],
      do:['Skates stay onside until the puck is in.'],
      mistake:'Watching the puck and forgetting your feet.' }
  },

  /* ---- quiz ---- */
  tests:[
    {q:'The puck is still behind you at the line. What do you do?',
     o:['Cross and wait','Slow down','Yell for it','Cut inside'], a:1,
     why:'The puck crosses first. Half a second of patience saves the rush.'}
  ],
  placeq:[
    {pos:'LW', fr:1, v:'right',       // pinned, because a wrong variant exists
     ask:'Drag YOU to where the left wing waits.'}
  ],

  /* ---- video + coach prompt ---- */
  videos:[{id:'YOUTUBE_ID', t:'Video title', c:'Channel',
           w:'Why this one is worth watching.'}],
  searchq:'hockey zone entry for kids',
  keys:{ base:['example','blue line','zone entry'],
         v:{right:['clean','right way'], wrong:['early','offside','whistle']} }
}
```

---

## Runtime extension

`CUSTOM` is the runtime extension point — plays added after load, persisted to
`localStorage`. `addSituation(obj)` validates an object against the same rules the
validator enforces and registers it if it passes, returning `{ok:true}` or
`{ok:false, errors:[…]}`. That is the hook a generated play would use without
touching this file.
