# Music

Spotify-style player sheet with progressive animation steps.

## Learning paths

Work through **one** path depending on the workshop segment. Each path starts from [`steps/boilerplate`](./steps/boilerplate/).

### Path A — Layout animations

`boilerplate` → [`step1-LA`](./steps/step1-LA/) → [`step2-LA-transform`](./steps/step2-LA-transform/)

| Step | Goal |
| ---- | ---- |
| Step 1 | `layout`, `entering` / `exiting` on shared player elements |
| Step 2 | Custom scaled-text layout on top of layout animations |

### Path B — Gestures

`boilerplate` → [`step3-gesture`](./steps/step3-gesture/) → [`step4-gesture`](./steps/step4-gesture/)

| Step | Goal |
| ---- | ---- |
| Step 3 | Pan-driven `progress`, interpolated sheet, deadband variant switching |
| Step 4 | Variant `FadeIn` on artwork / meta / controls (checkpoint before FLIP) |

### Path C — FLIP compensation

[`step3-gesture`](./steps/step3-gesture/) → [`step5-variant-flip`](./steps/step5-variant-flip/)

| Step | Goal |
| ---- | ---- |
| Step 5 | FLIP-style translate compensation when variant layout changes mid-gesture |

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
- Variant switches at deadband thresholds without FLIP

## Step 4 — Entering on variant switch

Same gesture core as step 3, plus `FadeIn` + `key={variant}` on artwork, meta, and controls when the variant flips.

## Step 5 — Variant FLIP

Adds `useVariantFlip` and capture-before-render in `PlayerProvider` for artwork and meta.

## Next step

**Go to: [Scroll Animation](../Bonus_ScrollAnimation/)**
