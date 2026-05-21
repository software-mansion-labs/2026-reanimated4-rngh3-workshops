# Music

Spotify-style player sheet as the base state for a future workshop lesson.

|        | Goal                                                           | Checkpoint                                                |
| ------ | -------------------------------------------------------------- | --------------------------------------------------------- |
| Start  | Base Music app state                                         | [`steps/boilerplate`](./steps/boilerplate/)               |
| Step 1 | Animate mini/full player with layout animations                | [`steps/step1-LA`](./steps/step1-LA/)                     |
| Step 2 | Add transform-based text animation on top of layout animations | [`steps/step2-LA-transform`](./steps/step2-LA-transform/) |
| Step 3 | Pan gesture drives sheet progress; variant switches discretely | [`steps/step3-gesture`](./steps/step3-gesture/)           |
| Step 4 | Same as step 3 — checkpoint before FLIP                        | [`steps/step4-gesture`](./steps/step4-gesture/)     |
| Step 5 | FLIP-style compensation when variant layout changes            | [`steps/step5-variant-flip`](./steps/step5-variant-flip/) |

## Goal

This lesson starts from a fully built Spotify-like surface that will later become the foundation for animation steps.

- Playlist screen with active song state
- Mini player anchored at the bottom
- Expandable full player sheet
- Shared composition between mini and full variants

## Notes

- The current checkpoint is intentionally the base state only.
- Future steps can build on the same player composition without reshaping the screen structure.

## Step 1 - Layout animations showcase

This step demonstrates a pragmatic first pass: keep the same mini/full variants, and use Reanimated layout animations to smooth the transition between them.

- `layout` animates the repositioning and resizing of shared elements
- `entering` reveals full-player-only content
- `exiting` removes full-player-only content cleanly

The step is intentionally a full copy of the lesson so attendees can lift the whole folder into their own project without chasing cross-file imports.

## Step 2 - Layout animations with text transform

This step keeps the layout-animation approach from Step 1 and adds a custom transform animation for the text.

- the player still changes with layout animations
- title and artist scaling are layered on top as a separate transform animation experiment

## Step 3 - Pan gesture with discrete variant switching

This step replaces layout animations with a continuous `progress` shared value driven by a pan gesture.

- the sheet position, size, and colors interpolate from `progress`
- mini/full variant still switches at deadband thresholds, but without FLIP compensation
- when the variant changes, React re-renders and flex direction updates discretely

## Step 4 - Gesture checkpoint

Same implementation as Step 3. Use this folder as the starting point for the FLIP exercise in Step 5.

## Step 5 - Variant FLIP compensation

This step adds FLIP-style translate compensation on artwork and meta when the variant switches mid-gesture.

- captures element positions before the variant re-render
- animates translate offsets back to zero for a smoother handoff

## Next step

**Go to: [Scroll Animation](../Bonus_ScrollAnimation/)**
