# Voice pack for Hockey IQ Rink

The app speaks 579 fixed lines (situation intros, step cues, job descriptions, quiz
questions/options/why-text, feedback phrases) plus a handful of lines built from a
live number (a measured distance in feet, a live quiz score) that can't be
pre-recorded and will always use on-device speech synthesis. This pack covers the 558
fixed ones.

## What to do

1. Render every entry in `lines.json` through your TTS provider. One call per line,
   in the file's own text - no edits, no combining lines.
2. Save each result as `audio/<id>.mp3` - the id is the JSON key, exactly as written
   (e.g. `defense-bs5kb2.mp3`). It must be `.mp3`: the player builds the path as
   `audio/<id>.mp3` and does not probe other extensions. Mono voice-quality MP3
   around 48-64kbps is plenty and keeps the download small.
3. List every id you rendered in `manifest.json` as a BARE JSON array of id strings -
   no path, no extension, no wrapper object:

   ["defense-bs5kb2", "they-have-the-puck-wzptg2"]

   An object like {"ids":[...]} will parse but register zero coverage, and every line
   will quietly fall back to speech.

4. Drop the mp3 files into this `audio/` folder, replace `manifest.json`, and ship.

The app checks `manifest.json` once on load. Any id listed there plays the real
file; anything not listed (or the fetch fails) falls back to on-device speech
automatically - so you can ship this in batches. Partial coverage is safe.

## Voice direction

Calm, steady coach. Not hyped, not flat - the register of someone walking a kid
through a play at practice speed, not narrating a highlight reel. Mid-to-low
pace, real pauses at periods. A couple of lines are written in ALL CAPS on
screen for emphasis (the phase words) - the text you're given is already
sentence-cased for speech, so no need to shout those either.

## Format notes for whoever wires it up

- `lines.json`: flat object, `{ "<id>": "<text to speak>" }`. 579 entries.
- The app already contains the player and the manifest check - nothing else to
  build. It plays `audio/<id>.mp3` when the id is listed in the manifest, and
  falls back to speechSynthesis, per line, if the id is missing or the file
  errors (so a typo'd filename degrades to speech instead of silence).
- Playback uses ONE persistent `<audio>` element, unlocked inside the Listen tap.
  iOS grants playback permission per element, so constructing a new `Audio()` per
  clip is always locked - do not "optimise" it back into per-clip elements.
- When a line falls back, it logs why, and the reason is specific:
  `[hiq audio] LOCKED` = the element was never unlocked in a real tap (permissions,
  not your files); `[hiq audio] MISSING` = the file 404'd or isn't a valid mp3.
  Running totals are on `AUDIO.fails` ({locked, missing, other}) and the last one
  on `AUDIO.lastFail`, both readable from the console on a device.
- Re-run this export any time the copy in the app changes - regenerating
  `lines.json` is: open the app, then in the console call
  `window.__exportAudioScript()`. It always reflects whatever is in
  index.html, so ids stay in sync with the live copy automatically (same text
  always produces the same id).
