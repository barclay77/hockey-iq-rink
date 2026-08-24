# Above The Puck — project rules

A hockey situational-awareness trainer for a Squirt/U10 player: one self-contained
static PWA. Four modes — Watch, Play, Quiz for the kid, Build for a coach. Pace and
scope are settings on Play, not modes. Audience is one nine-year-old and, eventually,
his coaches. Audio is pre-rendered to mp3 and committed.

(Repo and cache names keep the hockey-iq slug; renaming them would orphan installs.)

## 0. The rule that outranks the rest

**Never state a verdict you cannot support.** A HUD that is confidently wrong is worse
than no HUD. Every defect in this project's history is one shape: a claim emitted from
the *absence of contrary evidence* rather than the presence of supporting evidence —
"Reads 0 of 0", "clean but incomplete", "POSITION GOOD" on a goalie thirty feet out,
"Copied" on a failed clipboard write.

A test that cannot fail for a role is not evidence that the role is right. Verdicts need
a positive-test path and per-role declarations of which tests are meaningful. If a
calculation cannot honour an input, say so rather than narrating a world that does not
match the picture.

Same rule in reports: do not call something verified when it was reasoned about.

## 1. What deploys, and from where

GitHub Pages, repo `barclay77/hockey-iq-rink`, served at
`https://barclay77.github.io/hockey-iq-rink/`. `.github/workflows/pages.yml` uploads
`path: '.'` on every push to `main` — **the repo root IS the web root. There is no
`app/` directory in the repo and nothing copies one there.**

This project's working copy lives in `app/`. Ship the folder under that name (the
validator resolves `situations.js`, `index.html` and `audio/` relative to its own
location) — but its *contents* land at the repo root. A file uploaded to the repo root
inside an `app/` folder does not serve.

`pages.yml` gates the deploy as of commit 6b8f98d. Two steps run before anything is
published, and a non-zero exit stops the deploy: **Validate situations**
(`node validate-situations.mjs`) and **Validate audio manifest** — manifest.json must be a
non-empty bare array of bare ids, every id must have a non-zero mp3 behind it, no
committed clip may be missing from the manifest, and no mp3 may sit at the repo root. It
also prints `manifest N | mp3s N | lines.json N` on every run, so the real file count is
in the deploy log.

Lines in `lines.json` with no clip are a NOTE, not a failure — per-line fallback to device
speech is a legitimate shipping state. Run the validator locally anyway; failing in CI
after a push is a slower way to learn the same thing.

Upload from `.../upload/main/audio` so the breadcrumb reads *hockey-iq-rink / audio*.

Before editing, check the working copy against the deployed file. They have drifted
before, which produced a round of "I fixed it" against "nothing changed."

## 2. Situations data lives in situations.js

`SITUATIONS` is a plain script that assigns the array (`const SITUATIONS = [...]`),
loaded before the main script:

    <script src="situations.js"></script>

NOT a JSON file fetched at runtime — the app reads `SITUATIONS[0]` at parse time and
rebuilds the array later, so an async fetch breaks startup. Keep this data out of
index.html. `situations.js` must also be listed in the sw.js precache ASSETS.

## 3. Every situation carries a `level` field

USA Hockey bands, array form: `level: ['10U','12U']`. Allowed values only:
`8U`, `10U`, `12U`, `14U`, `16U`, `18U`. Several is fine. Used for grouping and
filtering drills by level.

`level` is authored content metadata. `hiq_level` is the on-device filter band. The
older `ages:` field is gone — do not reintroduce it.

## 4. Frames are deltas

A player holds his last position until a later frame overrides him, so frame `i+1`
contains only whoever moved on that beat. **Any evaluation at a later time must resolve
positions cumulatively first.** This has bitten twice.

`at()` interpolates with ease, and both `shown()` and `puckAt()` go through it. A
geometric test evaluated between keyframes must use the same function the picture uses,
or the test and the screen disagree. Ease-in means very little movement in the first
quarter of a leg.

## 5. Rink geometry and camera

Our goal line x=11, our blue x=75, centre x=100, their blue x=125, their goal x=189.
y 0–85, centre ice 42.5. **Low y is the top of the screen** (SVG y increases downward).
Net posts y=39.5 and y=45.5. Crease is a 6-foot arc off the goal line, 8 feet wide:
y 38.5–46.5, out to x=17 at centre.

**Our net at the bottom of the screen, always.** One orientation, not two — gaze is
up-ice whether the play comes at you or you go at it. The left/right flip stays; that is
which boards are nearest. Framing is separate and per step: crop from `frameBox`, which
unions the men, the puck and the consequence. Three constraints — keep an orientation
anchor in frame, **expand** the box to fit aspect (never shrink, or the goalie gets cut
out of a defensive-zone frame), and move the frame as little as possible between steps,
because a hard cut at every decision wipes the spatial memory the app exists to train.

The zone word (OUR ZONE / NEUTRAL ZONE / THEIR ZONE) IS that anchor, and it is drawn at
every crop, zoomed or not. It used to be dropped whenever the camera zoomed in, which left
tight frames with no words at all — measured: 5 of 44 defensive frames hold neither a net
nor a line. `frameBox` never goes narrower than 74 feet, so the widest visible zone slice
is always at least 37: naming every slice that fits is a guaranteed anchor, not a lucky one.

## 6. Never break audio ids

A line's id is a slug plus a hash of its exact text, case sensitive, so the same text
always yields the same id. The committed mp3s are keyed to those ids. Rewording a line
changes its id and orphans its recording — that line silently drops to robot voice until
re-rendered. Unchanged lines keep their clips.

- No gratuitous copy edits to existing spoken lines.
- When a line changes or is added, regenerate the work order rather than editing it:
  `node validate-situations.mjs --to-render` rewrites `audio/to-render.json` as
  `lines.json` minus the ids already in `audio/manifest.json`. Never append to it by
  hand — it accumulated to 504 lines when only 149 were new, and the cost estimate was
  wrong every pass. When the delta is zero the file is `{}`.
- Always export `audio/lines.json` as the full `id -> text` map.
- Verify with `window.__exportAudioScript()` and diff against lines.json before shipping.

## 7. audio/manifest.json is a bare JSON array — and is never emitted from here

The manifest is `["id", "id", ...]`. An `{"ids":[...]}` wrapper or an empty array
**silently disables every clip while the app looks completely healthy.** This has cost
multiple evenings. The renderer builds it by scanning `audio/*.mp3`, not from whatever a
run touched, so a delta script cannot truncate it.

Never emit: `manifest.json`, `script.json`, `render.py`, `diff_lines.py`, or any `.mp3`.
Overwriting `audio/manifest.json` stops ALL audio while the app still looks fine.

Export only: `index.html`, `situations.js`, `sw.js`, `manifest.webmanifest`,
`icons/*.png`, `situations.SCHEMA.md`, `validate-situations.mjs`, `audio/lines.json`,
`audio/README.md`, and `audio/to-render.json` when lines changed.

`validate-situations.mjs` and `situations.SCHEMA.md` go in EVERY export — a repo left
with a stale validator silently checks new data against old rules.

## 8. Keep the iOS audio pattern

ONE persistent `<audio>` element, unlocked synchronously inside a real user tap, then
swap `.src` per clip. **iOS grants permission per element**, so a `new Audio()` per clip
is permanently silent on iPhone and iPad. Never start the queue from a `setTimeout`
outside the gesture. The failure is silent and looks identical to a missing file, which
is why locked and missing are reported distinctly — keep that distinction, and keep the
per-line fallback to speechSynthesis when a file is missing.

## 9. All speech goes through one function

Every spoken line routes through `say()` — no call site talks to playback directly.
A server-backed voice is coming and needs one place to plug in.

## 10. Score shape: `asked` is a boolean, `read` exists only when it is true

Same shape on the position axis as of .154: `posGraded` is a boolean and `pos` exists only
when it is true. A step where the puck is on his own stick has no authored spot to be off, so
it carries no `pos` at all rather than a 1. Denominators count `posGraded===true`.

The tri-state is gone as a representation, not guarded. Nothing falsy can be eaten by a
`!x`. Migration lives in `playScoreLoad`. `pace` is stored on every record. Denominators
come from the record, never from live state.

**A shape change ships with its migration in the same commit.** This has nearly gone
wrong twice. An assertion added alongside a shape change with no migration accuses real
data first, which is worse than the bug it was watching for.

## 11. Score arrays can be sparse, and `read: 0` is falsy

`read: 0` is a legitimate wrong answer. Every traversal has been audited once; any new
one must handle holes and zeroes. Do not filter on truthiness: `.filter(x => x)` drops
holes, `.filter(r => r.read)` drops wrong answers.

## 12. Tests must not touch real data

Probes set `window.__hiqTestStore` and read/write **`hiq_play_test`**. Never
`hiq_play_v1`. An earlier round of probes overwrote records in the real store and
cleared two keys.

## 13. Verify in the environment that ships

The dev harness runs at 924x540 in an iframe. That is not production: autoplay policy
differs, localStorage can be partitioned, `display-mode: standalone` is false, `100vh`
is the iframe rather than the visual viewport, there are no safe-area insets, and
clipboard behaves as an unfocused document. **Resize the harness to phone portrait**
(`portrait-harness.html` at the project root holds the app in a true 390x844 frame; it sits
outside `app/` so it never ships — note that a screenshot of it comes back empty, the
measurements come from the DOM) rather than deferring to the device — the portrait `--peek` bottom sheet was called
"unreachable" for weeks when the real cause was the harness aspect ratio. Any check that
can only run embedded is a harness result, not a finding about the app.

## 14. No raw numbers in SPOKEN text

Distances in speech are banded in words a ten-year-old uses — on top of him, from the
doorstep, from the hash marks, from the point. "A shot from 0 feet" is what this rule
prevents. It is about the spoken line: every `say:` in the codebase is bandless, while
`checkSpot`, TOO FAR, NO WIDTH and the displacement bound all print feet on SCREEN, where a
number the eye can check against the ice is useful rather than absurd. Screen text is also
free to reword without touching an audio id (rule 6). Do not read this rule as banning
numbers from the screen — it has been misread that way twice.

## 15. Options are at most three, never padded

Right answer, tempting near-miss, one clear blunder. Two real options is a legitimate
question when only two exist. Presentation order is seeded on (play, variant, **attempt**),
not on the play alone — a fixed slot teaches the button rather than the read.

## 16. COPPA

The user is 8–10. No accounts, no names, no birthdates, nothing transmitted. Any
collection of a child's personal information needs counsel before launch. Do not add
anything that stores or sends identity.

## 17. Keep the version stamps

`BUILD='YYYY-MM-DD.N'` in index.html, and bump the sw.js cache name (`hockey-iq-vN`) in
the same export. The deploy tooling reads both. Otherwise the iPad keeps the old bundle.

## Out of scope / parked

The drag is bounded, not dynamic: the player's placement is honoured exactly in every
consequence calculation, the other nine run their authored route, and the app says so
out loud. Opponents reacting is a simulation, not an animation — out of scope.

The near-miss flip mechanism is dead (measured: 225 puck decision points, 753 candidate
options, zero flips at 0.4/0.55/0.8/1.0s). Its replacement — a catalogue of named U10
instincts — is parked pending the owner's markup. Also parked: pass-travel unification,
the three-circle placement affordance, the game-type map.
