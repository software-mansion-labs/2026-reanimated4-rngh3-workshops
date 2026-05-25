# Music

Spotify-style player sheet with progressive animation steps.

## Step order (tree, not a line)

This lesson has **three parallel tracks**. Steps are numbered for the workshop, but **you do not go 1 → 2 → 3 → 4 → 5 in order**. Follow **one** track for your segment; each step in a track is a small diff on top of the previous step in that track only.

The in-app step switcher lists every checkpoint in a row for convenience — that order is **not** the learning order.

```text
                    boilerplate
                   /           \
                  /             \
           step1-LA          step3-gesture
                |                  |
                |                  |
      step2-LA-transform    step4-gesture
                                   |
                                   |  (Path C only;
                                   |   continues from step 3)
                                   v
                          step5-variant-flip
```

| Track | Path | Steps |
| ----- | ---- | ----- |
| **A — Layout animations** | `boilerplate` → `step1-LA` → `step2-LA-transform` | Layout + entering/exiting, then scaled-text layout |
| **B — Gestures** | `boilerplate` → `step3-gesture` → `step4-gesture` | Pan-driven `progress`, then `FadeIn` on variant swap |
| **C — FLIP compensation** | `step3-gesture` → `step5-variant-flip` | FLIP-style translate when layout changes mid-gesture |

**Path C** branches from **step 3**, not from boilerplate. You need the gesture foundation from track B before FLIP.

### Checkpoints

| Step | Folder | Builds on |
| ---- | ------ | --------- |
| Start | [`steps/boilerplate`](./steps/boilerplate/) | — |
| Step 1 | [`steps/step1-LA`](./steps/step1-LA/) | boilerplate |
| Step 2 | [`steps/step2-LA-transform`](./steps/step2-LA-transform/) | step 1 |
| Step 3 | [`steps/step3-gesture`](./steps/step3-gesture/) | boilerplate |
| Step 4 | [`steps/step4-gesture`](./steps/step4-gesture/) | step 3 |
| Step 5 | [`steps/step5-variant-flip`](./steps/step5-variant-flip/) | step 3 |

Shared code (playlist, data, styles) lives under [`shared/`](./shared/). Only [`steps/<name>/Player/`](./steps/) changes between checkpoints — keep diffs minimal when adding the next step.

## Goal

- Playlist screen with active song state
- Mini player anchored at the bottom
- Expandable full player sheet
- Shared composition between mini and full variants

## Step 1 — Layout animations

Keep the same mini/full variants and use Reanimated layout animations to smooth transitions.

- `layout` on shared elements (sheet, artwork, meta, title, artist — not transport buttons)
- `entering` for full-player-only content
- `layout.ts` exports only `playerLayout`; create animated components locally where needed

## Step 2 — Layout animations with text transform

Adds `createScaledTextLayout` for title and artist scale handoff (500ms, matching `playerLayout`).

## Step 3 — Pan gesture

Replaces layout animations with continuous `progress` driven by a pan gesture.

- Sheet geometry and colors interpolate from `progress`
- Variant switches when `progress` crosses `0.5`

## Step 4 — Entering on variant switch

Same gesture core as step 3, plus `FadeIn` + `key={variant}` on artwork, meta, and controls when the variant flips.

## Step 5 — Variant FLIP

Adds `useVariantFlip` and capture-before-render in `PlayerProvider` for artwork and meta.

## Next step

**Go to: [Scroll Animation](../Bonus_ScrollAnimation/)**
