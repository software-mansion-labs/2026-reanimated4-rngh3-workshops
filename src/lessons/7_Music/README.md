# Music

In this lesson you will build a Spotify-style mini player that expands into a full-screen player with motion. The goal is not a single “correct” implementation, but to compare viable approaches—layout animations, gestures, and hybrids—and notice what gets subtle when they interact (including pitfalls when you pair-program with an AI assistant).

This part is organized similarly to other lessons, with the difference being, that in the `steps` folder each step represents a snapshot of the entire `Player` folder (and sometimes one extra file next to it, e.g. `useVariantFlip.ts` in step 5).

## Paths

The lesson has two main tracks (layout-driven vs gesture-driven). Follow **one** track end to end. Do not run steps 1 → 5 in order.

**Abbreviations:** **LA** means layout animation / `layout` transitions on Reanimated views. **FLIP** means “first, last, invert, play” (measure before layout, translate after, animate offset to zero).

```text
                    boilerplate
                   /           \
                  |             |
           step1-LA          step3-gesture
                |            /            \
      step2-LA-transform    |              |
                      step4-gesture-LA    step5-gesture-flip

```

|        | Goal                                       | Checkpoint                                                |
| ------ | ------------------------------------------ | --------------------------------------------------------- |
| Start  | Mini / full player shell, no motion        | [`steps/boilerplate`](./steps/boilerplate/)               |
| Step 1 | Layout transitions between player variants | [`steps/step1-LA`](./steps/step1-LA/)                     |
| Step 2 | Step 1 + text scaling with transforms      | [`steps/step2-LA-transform`](./steps/step2-LA-transform/) |
| Step 3 | Gesture driven sheet progress              | [`steps/step3-gesture`](./steps/step3-gesture/)           |
| Step 4 | Using fade to hide the variant swap        | [`steps/step4-gesture-LA`](./steps/step4-gesture-LA/)     |
| Step 5 | Using FLIP to hide the variant swap        | [`steps/step5-gesture-flip`](./steps/step5-gesture-flip/) |

## Step 1 - Layout animations

Build on [`steps/boilerplate`](./steps/boilerplate/). We are going to use layout animations to automatically transition the player between the mini and full variants. This is the simplest approach with best performance, but it is not interactive.

### a. Use `layout` to drive the variant change

Add a shared layout animation and wire it on elements that move or resize between mini and full.

<div class="edit-step">

<p class="edit-task"><b>[1]</b> Create and export <code>playerLayout</code>.</p>

<div class="edit-files"><span class="edit-file">layout.ts</span></div>

<details>
<summary>Code</summary>

````mdx-code-block
```ts
// layout.ts
import { LinearTransition } from "react-native-reanimated";

export const playerLayout = LinearTransition.duration(500).springify();
```
````

</details>

</div>

<div class="edit-step">

<p class="edit-task"><b>[2]</b> Wrap the sheet in <code>AnimatedPressable</code> and pass <code>layout=&#123;playerLayout&#125;</code>. Leave <code>backgroundColor</code> and <code>borderRadius</code> in the static <code>StyleSheet</code> for now.</p>

<div class="edit-files"><span class="edit-file">PlayerSheet.tsx</span></div>

<details>
<summary>Code</summary>

````mdx-code-block
```tsx
// PlayerSheet.tsx
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

return (
  <AnimatedPressable
    layout={playerLayout}
    onPress={state.variant === "mini" ? actions.expand : undefined}
    style={[variantStyle, positionStyle]}
  >
```
````

</details>

</div>

<div class="edit-step">

<p class="edit-task"><b>[3]</b> Swap <code>View</code> / <code>Text</code> for <code>Animated.*</code> and add <code>layout=&#123;playerLayout&#125;</code>:</p>

<ul class="task-checklist">
  <li><label><input type="checkbox" /> <strong>PlayerArtwork.tsx</strong> — create <code>AnimatedImage</code> for the cover</label></li>
  <li><label><input type="checkbox" /> <strong>PlayerMeta.tsx</strong> — animate the container</label></li>
  <li><label><input type="checkbox" /> <strong>PlayerTitle.tsx</strong> / <strong>PlayerArtist.tsx</strong> — animate the text nodes</label></li>
</ul>

<div class="edit-files">
  <span class="edit-file">PlayerArtwork.tsx</span>
  <span class="edit-file">PlayerMeta.tsx</span>
  <span class="edit-file">PlayerTitle.tsx</span>
  <span class="edit-file">PlayerArtist.tsx</span>
</div>

<details>
<summary>Code</summary>

````mdx-code-block
```tsx
// PlayerArtwork.tsx
import { playerLayout } from "./layout";

const AnimatedImage = Animated.createAnimatedComponent(Image);

<Animated.View layout={playerLayout} style={variantStyle.container}>
  <Animated.View layout={playerLayout} style={variantStyle.artwork}>
    <AnimatedImage
      source={state.currentSong.artwork}
      layout={playerLayout}
      style={fill}
      contentFit="cover"
    />
  </Animated.View>
</Animated.View>
```
````

````mdx-code-block
```tsx
// PlayerMeta.tsx
<Animated.View layout={playerLayout} style={variantStyle.container}>
  {children}
</Animated.View>
```
````

````mdx-code-block
```tsx
// PlayerTitle.tsx, PlayerArtist.tsx
<Animated.Text layout={playerLayout} style={variantStyle.text} numberOfLines={1}>
```
````

</details>

</div>

<div class="edit-step">

<p class="edit-task"><b>[4]</b> Use <code>Animated.View</code> with <code>layout=&#123;playerLayout&#125;</code> (entering comes in section b). The scrubber is the <code>PlayerScrubber</code> component in the same file as the header—there is no separate <code>PlayerScrubber.tsx</code> file.</p>

<ul class="task-checklist">
  <li><label><input type="checkbox" /> <strong>PlayerHeader.tsx</strong> — header row</label></li>
  <li><label><input type="checkbox" /> <strong>PlayerHeader.tsx</strong> — <code>PlayerScrubber</code> (below the header in this file)</label></li>
</ul>

<div class="edit-files">
  <span class="edit-file">PlayerHeader.tsx</span>
</div>

<details>
<summary>Code</summary>

````mdx-code-block
```tsx
// PlayerHeader.tsx — PlayerHeader, PlayerScrubber
<Animated.View layout={playerLayout} style={styles.header}>
```
````

</details>

</div>

### b. Fade in full-player UI

The header, scrubber, and controls only exist in the full variant. They should fade in when they mount. Controls remount on variant change so their entering animation runs again.

<div class="edit-step">

<p class="edit-task"><b>[1]</b> Add <code>entering=&#123;FadeIn.delay(100).duration(500)&#125;</code> next to <code>layout</code> on the header and scrubber containers (both live in <code>PlayerHeader.tsx</code>):</p>

<ul class="task-checklist">
  <li><label><input type="checkbox" /> <strong>PlayerHeader.tsx</strong> — header <code>Animated.View</code></label></li>
  <li><label><input type="checkbox" /> <strong>PlayerHeader.tsx</strong> — <code>PlayerScrubber</code> wrapper</label></li>
</ul>

<div class="edit-files">
  <span class="edit-file">PlayerHeader.tsx</span>
</div>

<details>
<summary>Code</summary>

````mdx-code-block
```tsx
// PlayerHeader.tsx — PlayerHeader, PlayerScrubber
<Animated.View
  entering={FadeIn.delay(100).duration(500)}
  layout={playerLayout}
  style={styles.header}
>
```
````

</details>

</div>

<div class="edit-step">

<p class="edit-task"><b>[2]</b> Wrap in <code>LayoutAnimationConfig skipEntering</code> to prevent running the animation on the initial mount, set <code>key=&#123;state.variant&#125;</code> to force re-entering when the variant changes, and use <code>entering=&#123;FadeIn.delay(100).duration(500)&#125;</code>.</p>

<div class="edit-files"><span class="edit-file">PlayerControls.tsx</span></div>

<details>
<summary>Code</summary>

````mdx-code-block
```tsx
// PlayerControls.tsx
<LayoutAnimationConfig skipEntering>
  <Animated.View
    key={state.variant}
    entering={FadeIn.delay(100).duration(500)}
    style={variantStyle.container}
  >
    {children}
  </Animated.View>
</LayoutAnimationConfig>
```
````

</details>

</div>

### c. Polish what layout cannot animate

Layout transitions move and resize views—they do not smoothly interpolate paint properties such as <code>backgroundColor</code> or <code>borderRadius</code>. Those still jump unless you animate them separately. This sub-step is optional polish on top of the layout work above, not a second way to drive the variant change.

<div class="edit-step">

<p class="edit-task"><b>[1]</b> Move sheet surface color and corner radius into <code>useAnimatedStyle</code> + <code>withTiming</code>, and remove them from the static mini / full styles.</p>

<div class="edit-files"><span class="edit-file">PlayerSheet.tsx</span></div>

<details>
<summary>Code</summary>

````mdx-code-block
```tsx
// PlayerSheet.tsx
const animatedSurfaceStyle = useAnimatedStyle(() => ({
  backgroundColor: withTiming(
    state.variant === "full" ? colors.background : colors.surfaceElevated,
    { duration: 220 },
  ),
  borderRadius: withTiming(state.variant === "full" ? 0 : 8, {
    duration: 220,
  }),
}));

return (
  <AnimatedPressable
    layout={playerLayout}
    onPress={state.variant === "mini" ? actions.expand : undefined}
    style={[variantStyle, positionStyle, animatedSurfaceStyle]}
  >
```
````

</details>

</div>

## Step 2 - Scaled text layout

Build on [`steps/step1-LA`](./steps/step1-LA/). Only `layout.ts`, `PlayerTitle.tsx`, and `PlayerArtist.tsx` change. Layout transitions are not able to animate font size change. We can overcome this by adding transforms to the text components - use the bigger font size in full and scale down with transforms in mini. Nice benefit is that transform is cheaper to animate, but we loose some control over how the text is positioned.

### a. Add transforms to the text components (static)

Use one base `fontSize` per line and scale down in mini with `transform`.

<div class="edit-step">

<p class="edit-task"><b>[1]</b> Update fontSize to 22 and add <code>transformOrigin: "left bottom"</code> to both variants. Use transform to scale down the text in mini.</p>

<div class="edit-files"><span class="edit-file">PlayerTitle.tsx</span></div>

<details>
<summary>Code</summary>

````mdx-code-block
```tsx
// PlayerTitle.tsx
mini: StyleSheet.create({
  text: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "700",
    transform: [{ scale: 0.64 }],
    transformOrigin: "left bottom",
  },
}),
full: StyleSheet.create({
  text: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "700",
    transformOrigin: "left bottom",
  },
}),
```
````

</details>

</div>

<div class="edit-step">

<p class="edit-task"><b>[2]</b> Update fontSize to 16 and add <code>transformOrigin: "left top"</code> to both variants. Use transform to scale down the text in mini.</p>

<div class="edit-files"><span class="edit-file">PlayerArtist.tsx</span></div>

<details>
<summary>Code</summary>

````mdx-code-block
```tsx
// PlayerArtist.tsx
mini: StyleSheet.create({
  text: {
    color: colors.textSecondary,
    fontSize: 16,
    transform: [{ scale: 0.75 }],
    transformOrigin: "left top",
  },
}),
full: StyleSheet.create({
  text: {
    color: colors.textSecondary,
    fontSize: 16,
    transformOrigin: "left top",
  },
}),
```
````

</details>

</div>

### b. Add a custom layout animation on title and artist

Default `playerLayout` does not animate the scale change. We can overcome this by adding a custom layout animation that animates the scale. Since the transforms are not included in the layout animation snapshot values, we need to create an instance of the layout animation for each intended scale.

<div class="edit-step">

<p class="edit-task"><b>[1]</b> Create custom layout animation function <code>createScaledTextLayout</code> and four exports (one per direction and scale value).</p>

<div class="edit-files"><span class="edit-file">layout.ts</span></div>

<details>
<summary>Code</summary>

````mdx-code-block
```ts
// layout.ts
const LAYOUT_DURATION_MS = 300;

export const createScaledTextLayout = (
  currentScale: number,
  targetScale: number,
): LayoutAnimationFunction => {
  return (values) => {
    "worklet";

    return {
      initialValues: {
        originX: values.currentOriginX,
        originY: values.currentOriginY,
        width: values.currentWidth,
        height: values.currentHeight,
        transform: [{ scale: currentScale }],
      },
      animations: {
        originX: withSpring(values.targetOriginX, {
          duration: LAYOUT_DURATION_MS,
        }),
        originY: withSpring(values.targetOriginY, {
          duration: LAYOUT_DURATION_MS,
        }),
        width: withSpring(values.targetWidth, { duration: LAYOUT_DURATION_MS }),
        height: withSpring(values.targetHeight, {
          duration: LAYOUT_DURATION_MS,
        }),
        transform: [
          { scale: withSpring(targetScale, { duration: LAYOUT_DURATION_MS }) },
        ],
      },
    };
  };
};

export const titleToMiniLayout = createScaledTextLayout(1, 0.64);
export const titleToFullLayout = createScaledTextLayout(0.64, 1);
export const artistToMiniLayout = createScaledTextLayout(1, 0.75);
export const artistToFullLayout = createScaledTextLayout(0.75, 1);
```
````

</details>

</div>

<div class="edit-step">

<p class="edit-task"><b>[2]</b> Swap <code>playerLayout</code> for the direction-specific layout on each text node:</p>

<ul class="task-checklist">
  <li><label><input type="checkbox" /> <strong>PlayerTitle.tsx</strong> — <code>titleToMiniLayout</code> / <code>titleToFullLayout</code></label></li>
  <li><label><input type="checkbox" /> <strong>PlayerArtist.tsx</strong> — <code>artistToMiniLayout</code> / <code>artistToFullLayout</code></label></li>
</ul>

<div class="edit-files">
  <span class="edit-file">PlayerTitle.tsx</span>
  <span class="edit-file">PlayerArtist.tsx</span>
</div>

<details>
<summary>Code</summary>

````mdx-code-block
```tsx
// PlayerTitle.tsx
layout={state.variant === "mini" ? titleToMiniLayout : titleToFullLayout}
```
````

````mdx-code-block
```tsx
// PlayerArtist.tsx
layout={state.variant === "mini" ? artistToMiniLayout : artistToFullLayout}
```
````

</details>

</div>

## Step 3 - Pan gesture

Start again from [`steps/boilerplate`](./steps/boilerplate/) (not step 1). In this step we want to change the whole animation to be interactive. We will use a pan gesture to drive the `progress` shared value and use it to animate the sheet dimensions. We will update the Artwork component to be laid out in a way that will automatically respond to the parent dimensions change.

### a. Start from boilerplate

Copy the boilerplate Player folder as your working tree. Keep `shared/` as-is.

### b. Swap `Pressable` for `Gesture.Tap`

<div class="edit-step">

<p class="edit-task"><b>[1]</b> Replace the sheet <code>Pressable</code> with <code>GestureDetector</code> + <code>Gesture.Tap</code>. Call <code>actions.expand</code> from the UI thread via <code>scheduleOnRN</code>.</p>

<div class="edit-files"><span class="edit-file">PlayerSheet.tsx</span></div>

<details>
<summary>Code</summary>

````mdx-code-block
```tsx
// PlayerSheet.tsx
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { scheduleOnRN } from "react-native-worklets";

const tap = Gesture.Tap()
  .enabled(state.variant === "mini")
  .onStart(() => scheduleOnRN(actions.expand));

return (
  <GestureDetector gesture={tap}>
    {/* sheet content */}
  </GestureDetector>
);
```
````

</details>

</div>

### c. Add a `progress` shared value and expose it through context

<div class="edit-step">

<p class="edit-task"><b>[1]</b> Create <code>progress</code> and wrap the tree with <code>AnimationMetaContext</code> (see the <code>shared/animationMeta/</code> folder — <code>context.tsx</code> exports the provider and types).</p>

<div class="edit-files"><span class="edit-file">PlayerProvider.tsx</span></div>

<details>
<summary>Code</summary>

````mdx-code-block
```tsx
// PlayerProvider.tsx
const progress = useSharedValue(0);

expand: () => {
  progress.value = withSpring(1, { duration: 500 });
},
collapse: () => {
  progress.value = withSpring(0, { duration: 500 });
},

return (
  <AnimationMetaContext.Provider value={{ progress }}>
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  </AnimationMetaContext.Provider>
);
```
````

</details>

</div>

<div class="edit-step">

<p class="edit-task"><b>[2]</b> Swap the container <code>View</code> for <code>Animated.View</code> (no <code>progress</code> usage yet).</p>

<div class="edit-files"><span class="edit-file">PlayerMeta.tsx</span></div>

<details>
<summary>Code</summary>

````mdx-code-block
```tsx
// PlayerMeta.tsx
import Animated from "react-native-reanimated";

<Animated.View style={variantStyle.container}>{children}</Animated.View>
```
````

</details>

</div>

<div class="edit-step">

<p class="edit-task"><b>[3]</b> Import <code>useAnimationMeta</code> and read <code>progress</code> (you will use it in later sub-steps):</p>

<ul class="task-checklist">
  <li><label><input type="checkbox" /> <strong>PlayerSheet.tsx</strong></label></li>
  <li><label><input type="checkbox" /> <strong>PlayerArtwork.tsx</strong></label></li>
  <li><label><input type="checkbox" /> <strong>PlayerTitle.tsx</strong></label></li>
  <li><label><input type="checkbox" /> <strong>PlayerArtist.tsx</strong></label></li>
</ul>

<div class="edit-files">
  <span class="edit-file">PlayerSheet.tsx</span>
  <span class="edit-file">PlayerArtwork.tsx</span>
  <span class="edit-file">PlayerTitle.tsx</span>
  <span class="edit-file">PlayerArtist.tsx</span>
</div>

<details>
<summary>Code</summary>

````mdx-code-block
```tsx
// PlayerSheet.tsx, PlayerArtwork.tsx, PlayerTitle.tsx, PlayerArtist.tsx
import { useAnimationMeta } from "@/lessons/7_Music/shared/animationMeta";

const { progress } = useAnimationMeta();
```
````

</details>

</div>

### d. Use `useAnimatedReaction` to update the variant

We want to automatically swap the variant when the `progress` shared value crosses a threshold. We will use `useAnimatedReaction` to listen to the `progress` value and swap the variant when it crosses the threshold value `SWAP`.

<div class="edit-step">

<p class="edit-task"><b>[1]</b> Call the `useAnimatedReaction`  hook on <code>progress</code> and call <code>setVariant</code> from the UI thread via <code>scheduleOnRN</code>.</p>

<div class="edit-files"><span class="edit-file">PlayerProvider.tsx</span></div>

<details>
<summary>Code</summary>

````mdx-code-block
```tsx
// PlayerProvider.tsx
const SWAP = 0.2;

useAnimatedReaction(
  () => progress.value,
  (curr, prev) => {
    if (prev === null) {
      return;
    }

    if (prev < SWAP && curr >= SWAP) {
      scheduleOnRN(setVariant, "full");
    }
    if (prev >= SWAP && curr < SWAP) {
      scheduleOnRN(setVariant, "mini");
    }
  },
);
```
````

</details>

</div>

### e. Add the pan gesture and combine it with tap

<div class="edit-step">

<p class="edit-task"><b>[1]</b> Track <code>startProgress</code> on pan start, map vertical translation to <code>progress</code>, snap on end. Combine with tap via <code>Gesture.Exclusive(pan, tap)</code>.</p>

<div class="edit-files"><span class="edit-file">PlayerSheet.tsx</span></div>

<details>
<summary>Code</summary>

````mdx-code-block
```tsx
// PlayerSheet.tsx
const startProgress = useSharedValue(0);

const pan = Gesture.Pan()
  .onStart(() => {
    startProgress.value = progress.value;
  })
  .onUpdate((event) => {
    const delta = -event.translationY / screenHeight;
    const next = startProgress.value + delta;
    progress.value = clamp(next, 0, 1);
  })
  .onEnd(() => {
    const shouldBeExpanded = progress.value > 0.5;
    progress.value = withSpring(shouldBeExpanded ? 1 : 0);
  });

const gesture = Gesture.Exclusive(pan, tap);
```
````

</details>

</div>

### f. Use `progress` to update the sheet dimensions

<div class="edit-step">

<p class="edit-task"><b>[1]</b> Replace static insets and surface styles on the sheet with <code>useAnimatedStyle</code> driven by <code>progress</code>. Drop <code>backgroundColor</code>, <code>borderRadius</code>, and mini <code>paddingHorizontal</code> from the static styles.</p>

<div class="edit-files"><span class="edit-file">PlayerSheet.tsx</span></div>

<details>
<summary>Code</summary>

````mdx-code-block
```tsx
// PlayerSheet.tsx
const animatedStyle = useAnimatedStyle(() => ({
  top: interpolate(progress.value, [0, 1], [position.mini.top, position.full.top]),
  bottom: interpolate(
    progress.value,
    [0, 1],
    [position.mini.bottom, position.full.bottom],
  ),
  left: interpolate(progress.value, [0, 1], [position.mini.left, position.full.left]),
  right: interpolate(
    progress.value,
    [0, 1],
    [position.mini.right, position.full.right],
  ),
  paddingTop: interpolate(progress.value, [0, 1], [0, position.full.paddingTop]),
  borderRadius: interpolate(progress.value, [0, 1], [8, 0]),
  backgroundColor: interpolateColor(
    progress.value,
    [0, 1],
    [colors.surfaceElevated, colors.background],
  ),
}));

return (
  <GestureDetector gesture={gesture}>
    <Animated.View style={[variantStyle, positionStyle, animatedStyle]}>
      {children}
    </Animated.View>
  </GestureDetector>
);
```
````

</details>

</div>

### g. Update artwork styles to respond to sheet size changes

<div class="edit-step">

<p class="edit-task"><b>[1]</b> Shared <code>styles.artwork</code> with <code>aspectRatio: 1</code>; mini / full only set container padding or flex. Animate corner radius from <code>progress</code>.</p>

<div class="edit-files"><span class="edit-file">PlayerArtwork.tsx</span></div>

<details>
<summary>Code</summary>

````mdx-code-block
```tsx
// PlayerArtwork.tsx
const animatedStyle = useAnimatedStyle<ViewStyle>(() => ({
  borderRadius: interpolate(progress.value, [0, 1], [4, 8]),
}));

<Animated.View style={variantStyle.container}>
  <Animated.View style={[styles.artwork, animatedStyle]}>
    <Image source={state.currentSong.artwork} style={fill} contentFit="cover" />
  </Animated.View>
</Animated.View>
```
````

</details>

</div>

<div class="edit-step">

<p class="edit-task"><b>[2]</b> Interpolate <code>fontSize</code> from <code>progress</code>:</p>

<ul class="task-checklist">
  <li><label><input type="checkbox" /> <strong>PlayerTitle.tsx</strong> — <code>[14, 22]</code></label></li>
  <li><label><input type="checkbox" /> <strong>PlayerArtist.tsx</strong> — <code>[12, 16]</code></label></li>
</ul>

<div class="edit-files">
  <span class="edit-file">PlayerTitle.tsx</span>
  <span class="edit-file">PlayerArtist.tsx</span>
</div>

<details>
<summary>Code</summary>

````mdx-code-block
```tsx
// PlayerTitle.tsx
const animatedStyle = useAnimatedStyle(() => ({
  fontSize: interpolate(progress.value, [0, 1], [14, 22]),
}));

<Animated.Text style={[variantStyle.text, animatedStyle]} numberOfLines={1}>
  …
</Animated.Text>
```
````

````mdx-code-block
```tsx
// PlayerArtist.tsx
const animatedStyle = useAnimatedStyle(() => ({
  fontSize: interpolate(progress.value, [0, 1], [12, 16]),
}));

<Animated.Text style={[variantStyle.text, animatedStyle]} numberOfLines={1}>
  …
</Animated.Text>
```
````

</details>

</div>

<div class="edit-step">

<p class="edit-task"><b>[3]</b> Add <code>entering=&#123;FadeIn&#125;</code> on the header and scrubber in <code>PlayerHeader.tsx</code> (full variant only):</p>

<ul class="task-checklist">
  <li><label><input type="checkbox" /> <strong>PlayerHeader.tsx</strong> — header</label></li>
  <li><label><input type="checkbox" /> <strong>PlayerHeader.tsx</strong> — <code>PlayerScrubber</code></label></li>
</ul>

<div class="edit-files">
  <span class="edit-file">PlayerHeader.tsx</span>
</div>

<details>
<summary>Code</summary>

````mdx-code-block
```tsx
// PlayerHeader.tsx — PlayerHeader, PlayerScrubber
<Animated.View entering={FadeIn} style={styles.header}>
```
````

</details>

</div>

<div class="edit-step">

<p class="edit-task"><b>[4]</b> Wrap in <code>LayoutAnimationConfig skipEntering</code>, set <code>key=&#123;state.variant&#125;</code>, and add <code>entering=&#123;FadeIn&#125;</code>.</p>

<div class="edit-files"><span class="edit-file">PlayerControls.tsx</span></div>

<details>
<summary>Code</summary>

````mdx-code-block
```tsx
// PlayerControls.tsx
<LayoutAnimationConfig skipEntering>
  <Animated.View key={state.variant} entering={FadeIn} style={variantStyle.container}>
```
````

</details>

</div>

> Checkpoint: compare your work with [`steps/step3-gesture`](./steps/step3-gesture/)

## Step 4 - Entering on variant swap

Build on [`steps/step3-gesture`](./steps/step3-gesture/). Only `PlayerArtwork.tsx` and `PlayerMeta.tsx` change. Controls already fade on variant change in step 3.

When `variant` flips at `SWAP`, remount artwork and meta so `FadeIn` runs on the new layout.

### a. Remount meta with `FadeIn`

<div class="edit-step">

<p class="edit-task"><b>[1]</b> Wrap in <code>LayoutAnimationConfig skipEntering</code>, set <code>key=&#123;state.variant&#125;</code>, and add <code>entering=&#123;FadeIn&#125;</code> on the outer <code>Animated.View</code>.</p>

<div class="edit-files"><span class="edit-file">PlayerMeta.tsx</span></div>

<details>
<summary>Code</summary>

````mdx-code-block
```tsx
// PlayerMeta.tsx
return (
  <LayoutAnimationConfig skipEntering>
    <Animated.View
      key={state.variant}
      entering={FadeIn}
      style={variantStyle.container}
    >
      {children}
    </Animated.View>
  </LayoutAnimationConfig>
);
```
````

</details>

</div>

### b. Remount artwork with `FadeIn`

<div class="edit-step">

<p class="edit-task"><b>[1]</b> Same remount pattern on the artwork container; use <code>AnimatedImage</code> for the cover.</p>

<div class="edit-files"><span class="edit-file">PlayerArtwork.tsx</span></div>

<details>
<summary>Code</summary>

````mdx-code-block
```tsx
// PlayerArtwork.tsx
const AnimatedImage = Animated.createAnimatedComponent(Image);

return (
  <LayoutAnimationConfig skipEntering>
    <Animated.View
      key={state.variant}
      entering={FadeIn}
      style={variantStyle.container}
    >
      <Animated.View style={[styles.artwork, animatedStyle]}>
        <AnimatedImage
          source={state.currentSong.artwork}
          style={fill}
          contentFit="cover"
        />
      </Animated.View>
    </Animated.View>
  </LayoutAnimationConfig>
);
```
````

</details>

</div>

> Checkpoint: compare your work with [`steps/step4-gesture-LA`](./steps/step4-gesture-LA/)

## Step 5 - Variant FLIP

Build on [`steps/step3-gesture`](./steps/step3-gesture/) (not step 4). Replace the fade-in remount on artwork and meta with a FLIP-style translate. You will add **`useVariantFlip.ts`** next to the Player folder (same layout as the checkpoint: a **sibling** of that folder, imported as `../useVariantFlip` from files inside Player), extend **`PlayerProvider.tsx`** with a capture queue before `setVariant`, then wire the hook in **`PlayerArtwork.tsx`** and **`PlayerMeta.tsx`**. `PlayerControls` and header entering from step 3 stay as-is.

### a. Add `useVariantFlip`

<div class="edit-step">

<p class="edit-task"><b>[1]</b> Implement <code>useVariantFlip</code>: register a <strong>pre-layout capture</strong> callback, measure the target before <code>variant</code> changes, then after layout compute <strong>translate = before − after</strong> and animate the offset back to zero with <code>withTiming</code>. Typing this from scratch is easy to get wrong—use <a href="./steps/step5-gesture-flip/useVariantFlip.ts"><code>steps/step5-gesture-flip/useVariantFlip.ts</code></a> as the source of truth (same path next to your Player folder), then skim the comments in the checkpoint if you want the narrative.</p>

<div class="edit-files"><span class="edit-file">useVariantFlip.ts (sibling of Player folder, not inside it)</span></div>

<details>
<summary>Shape of the API (reference)</summary>

````mdx-code-block
```ts
// useVariantFlip.ts
```
````

</details>

</div>

### b. Capture layout before `setVariant`

<div class="edit-step">

<p class="edit-task"><b>[1]</b> Collect capture callbacks and await them inside <code>swapVariant</code> before <code>setVariant</code>.</p>

<div class="edit-files"><span class="edit-file">PlayerProvider.tsx</span></div>

<details>
<summary>Code</summary>

````mdx-code-block
```tsx
// PlayerProvider.tsx
const captureFlipTargets = () =>
  Promise.all(
    Array.from(flipCaptureCallbacksRef.current, (callback) => callback()),
  ).then(() => undefined);

const swapVariant = (nextVariant: PlayerVariant) => {
  transitionQueueRef.current = transitionQueueRef.current.then(async () => {
    await captureFlipTargets();
    setVariant(nextVariant);
  });
};

<AnimationMetaContext.Provider
  value={{ progress, registerFlipCapture, captureFlipTargets }}
>
```
````

</details>

</div>

### c. Wire flip on artwork and meta

<div class="edit-step">

<p class="edit-task"><b>[1]</b> Drop <code>key</code> / <code>FadeIn</code> wrappers; attach <code>ref=&#123;targetRef&#125;</code> and <code>flipStyle</code>:</p>

<ul class="task-checklist">
  <li><label><input type="checkbox" /> <strong>PlayerArtwork.tsx</strong> — outer <code>View</code> for variant layout, inner <code>Animated.View</code> carries flip</label></li>
  <li><label><input type="checkbox" /> <strong>PlayerMeta.tsx</strong> — single <code>Animated.View</code> with ref and flip style</label></li>
</ul>

<div class="edit-files">
  <span class="edit-file">PlayerArtwork.tsx</span>
  <span class="edit-file">PlayerMeta.tsx</span>
</div>

<details>
<summary>Code</summary>

````mdx-code-block
```tsx
// PlayerArtwork.tsx, PlayerMeta.tsx
const { targetRef, flipStyle } = useVariantFlip(state.variant);

<View style={variantStyle.container}>
  <Animated.View
    ref={targetRef}
    style={[styles.artwork, animatedStyle, flipStyle]}
  >
    <Image … />
  </Animated.View>
</View>

<Animated.View ref={targetRef} style={[variantStyle.container, flipStyle]}>
  {children}
</Animated.View>
```
````

</details>

</div>

> Checkpoint: compare your work with [`steps/step5-gesture-flip`](./steps/step5-gesture-flip/)

## Troubleshooting

- **Layout transitions do nothing** — Confirm you swapped `View` / `Text` / `Image` for `Animated.*`, passed `layout={…}` on the moving nodes, and import `Animated` from `react-native-reanimated` where needed.
- **Gesture / pan does not respond** — Ensure the sheet is wrapped in `GestureDetector`, gestures are combined correctly (`Gesture.Exclusive(…)`), and side effects that update React state use `scheduleOnRN` from `react-native-worklets` (not plain calls from the gesture worklet).
- **`progress` stuck or UI out of sync** — Compare `PlayerProvider.tsx` and `PlayerSheet.tsx` to [`steps/step3-gesture`](./steps/step3-gesture/); check `useAnimatedReaction` thresholds (`SWAP`) vs the snap threshold (`0.5`) in the pan `onEnd` handler.
- **Still lost** — Diff your Player tree (and `useVariantFlip.ts` in step 5) against the checkpoint linked at the end of the step you are on.

## Next step

**Go to: [Scroll Animation](../Bonus_ScrollAnimation/)**
