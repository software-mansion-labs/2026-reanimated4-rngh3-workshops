# Music

In this lesson we are going to create a Spotify-like mini player that expands and collapses with an animation. The main objective of this lesson is to see how many different approaches can be used for the same task, and what the developer needs to be vary of, especially if there is an AI agent in the loop.

This part is organized similarly to other lessons, with the difference being, that in the `steps` folder each step represents a snapshot of the entire `Player` folder.

## Paths

The lesson has three tracks. Follow one track end to end. Do not run steps 1 → 5 in order.

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
| Step 4 | Using fade to hide the variant swap        | [`steps/step4-gesture-LA`](./steps/step4-gesture-LA/)           |
| Step 5 | Using FLIP to hide the variant swap        | [`steps/step5-gesture-flip`](./steps/step5-gesture-flip/) |

## Step 1 - Layout animations

Build on [`steps/boilerplate`](./steps/boilerplate/). Same mini / full composition; variant still flips instantly via `actions.expand` / `actions.collapse`.

### a. Use `layout` to drive the variant change

Add a shared layout transition and wire it on elements that move or resize between mini and full.

<details>
<summary>
  <b>[1]</b> let's add <code>Player/layout.ts</code> and export <code>playerLayout</code>
</summary>

````mdx-code-block
```ts
import { LinearTransition } from "react-native-reanimated";

export const playerLayout = LinearTransition.duration(500).springify();
```
````

</details>
<br />
<details>
<summary>
  <b>[2]</b> wrap the sheet in <code>AnimatedPressable</code> and pass <code>layout=&#123;playerLayout&#125;</code>. Move surface color and radius into <code>useAnimatedStyle</code> + <code>withTiming</code> (remove them from the static <code>StyleSheet</code>)
</summary>

````mdx-code-block
```tsx
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
<br />
<details>
<summary>
  <b>[3]</b> on <code>PlayerArtwork</code>, <code>PlayerMeta</code>, <code>PlayerTitle</code>, and <code>PlayerArtist</code>: swap <code>View</code> / <code>Text</code> for <code>Animated.*</code> and add <code>layout=&#123;playerLayout&#125;</code>. Create <code>AnimatedImage</code> for the artwork <code>Image</code>
</summary>

````mdx-code-block
```tsx
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
```
````

````mdx-code-block
```tsx
<Animated.Text layout={playerLayout} style={variantStyle.text} numberOfLines={1}>
```
````

</details>
<br />
<details>
<summary>
  <b>[4]</b> on <code>PlayerHeader</code> and <code>PlayerScrubber</code>: use <code>Animated.View</code> with <code>layout=&#123;playerLayout&#125;</code> (entering comes in the next sub-step)
</summary>

````mdx-code-block
```tsx
<Animated.View layout={playerLayout} style={styles.header}>
```
````

</details>

### b. Fade in full-player chrome

Full-player chrome should fade in when it mounts. Controls remount on variant change so their entering runs again.

<details>
<summary>
  <b>[1]</b> <code>PlayerHeader</code> and <code>PlayerScrubber</code>: add <code>entering=&#123;FadeIn.delay(100).duration(500)&#125;</code> next to <code>layout</code>
</summary>

````mdx-code-block
```tsx
<Animated.View
  entering={FadeIn.delay(100).duration(500)}
  layout={playerLayout}
  style={styles.header}
>
```
````

</details>
<br />
<details>
<summary>
  <b>[2]</b> <code>PlayerControls</code>: wrap in <code>LayoutAnimationConfig skipEntering</code>, set <code>key=&#123;state.variant&#125;</code>, and use <code>entering=&#123;FadeIn.delay(100).duration(500)&#125;</code> (no <code>layout</code> on controls)
</summary>

````mdx-code-block
```tsx
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

> Checkpoint: compare your work with [`steps/step1-LA`](./steps/step1-LA/)

## Step 2 - Scaled text layout

Build on [`steps/step1-LA`](./steps/step1-LA/). Only `layout.ts`, `PlayerTitle.tsx`, and `PlayerArtist.tsx` change.

### a. Add transforms to the text components (static)

Use one base `fontSize` per line and scale down in mini with `transform`. Check both variants on device before animating.

<details>
<summary>
  <b>[1]</b> <code>PlayerTitle</code> — base size 22, mini scale 0.64, <code>transformOrigin: "left bottom"</code>
</summary>

````mdx-code-block
```tsx
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
<br />
<details>
<summary>
  <b>[2]</b> <code>PlayerArtist</code> — base size 16, mini scale 0.75, <code>transformOrigin: "left top"</code>
</summary>

````mdx-code-block
```tsx
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

### b. Add a custom layout animation on title and artist

Default `playerLayout` does not spring the scale handoff. Add `createScaledTextLayout` and pick the layout from the target variant.

<details>
<summary>
  <b>[1]</b> extend <code>layout.ts</code> with <code>createScaledTextLayout</code> and four exports
</summary>

````mdx-code-block
```ts
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
<br />
<details>
<summary>
  <b>[2]</b> swap <code>playerLayout</code> for the direction-specific layout on each text node
</summary>

````mdx-code-block
```tsx
// PlayerTitle.tsx
layout={state.variant === "mini" ? titleToMiniLayout : titleToFullLayout}

// PlayerArtist.tsx
layout={state.variant === "mini" ? artistToMiniLayout : artistToFullLayout}
```
````

</details>

> Checkpoint: compare your work with [`steps/step2-LA-transform`](./steps/step2-LA-transform/)

## Step 3 - Pan gesture

Start again from [`steps/boilerplate`](./steps/boilerplate/) (not step 1). Variant layout (row vs column, which children render) still follows React `variant` state. Continuous motion uses a `progress` shared value from `0` (mini) to `1` (full).

### a. Start from boilerplate

Copy the boilerplate `Player/` folder as your working tree. Keep `shared/` as-is.

### b. Swap `Pressable` for `Gesture.Tap`

<details>
<summary>
  <b>[1]</b> in <code>PlayerSheet.tsx</code>, replace the sheet <code>Pressable</code> with <code>GestureDetector</code> + <code>Gesture.Tap</code>. Call <code>actions.expand</code> from the UI thread via <code>scheduleOnRN</code>
</summary>

````mdx-code-block
```tsx
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

### c. Add a `progress` shared value and expose it through context

<details>
<summary>
  <b>[1]</b> in <code>PlayerProvider.tsx</code>, create <code>progress</code> and wrap the tree with <code>AnimationMetaContext</code> (see <code>shared/animationMeta</code>)
</summary>

````mdx-code-block
```tsx
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
<br />
<details>
<summary>
  <b>[2]</b> read <code>progress</code> in sheet / artwork / meta / title / artist via <code>useAnimationMeta()</code>. On <code>PlayerMeta</code>, swap <code>View</code> for <code>Animated.View</code> (container only — no <code>progress</code> yet)
</summary>

````mdx-code-block
```tsx
import { useAnimationMeta } from "@/lessons/7_Music/shared/animationMeta";

const { progress } = useAnimationMeta();
```
````

</details>

### d. Use `useAnimatedReaction` to update the variant

Flip `variant` while the finger is still dragging so layout-dependent children switch early. `SWAP` is `0.2` in the checkpoint (pan release still snaps at `0.5` in the sheet).

<details>
<summary>
  <b>[1]</b> add <code>variantRef</code>, <code>swapVariant</code>, and the reaction on <code>progress</code>
</summary>

````mdx-code-block
```tsx
const SWAP = 0.2;

const variantRef = useRef<PlayerVariant>("mini");

const swapVariant = (nextVariant: PlayerVariant) => {
  if (variantRef.current === nextVariant) {
    return;
  }

  variantRef.current = nextVariant;
  setVariant(nextVariant);
};

useAnimatedReaction(
  () => progress.value,
  (curr, prev) => {
    if (prev === null) {
      return;
    }

    if (prev < SWAP && curr >= SWAP) {
      scheduleOnRN(swapVariant, "full");
    }
    if (prev >= SWAP && curr < SWAP) {
      scheduleOnRN(swapVariant, "mini");
    }
  },
);
```
````

</details>

### e. Add the pan gesture and combine it with tap

<details>
<summary>
  <b>[1]</b> track <code>startProgress</code> on pan start, map vertical translation to <code>progress</code>, snap on end. Combine with tap via <code>Gesture.Exclusive(pan, tap)</code>
</summary>

````mdx-code-block
```tsx
const startProgress = useSharedValue(0);

const pan = Gesture.Pan()
  .onStart(() => {
    startProgress.value = progress.value;
  })
  .onUpdate((event) => {
    const delta = -event.translationY / screenHeight;
    const next = startProgress.value + delta;
    progress.value = next < 0 ? 0 : next > 1 ? 1 : next;
  })
  .onEnd(() => {
    const shouldBeExpanded = progress.value > 0.5;
    progress.value = withSpring(shouldBeExpanded ? 1 : 0);
  });

const gesture = Gesture.Exclusive(pan, tap);
```
````

</details>

### f. Use `progress` to update the sheet dimensions

<details>
<summary>
  <b>[1]</b> replace static insets / chrome on the sheet with <code>useAnimatedStyle</code> driven by <code>progress</code>. Drop <code>backgroundColor</code>, <code>borderRadius</code>, and mini <code>paddingHorizontal</code> from the static styles
</summary>

````mdx-code-block
```tsx
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

### g. Update artwork styles to respond to sheet size changes

<details>
<summary>
  <b>[1]</b> shared <code>styles.artwork</code> with <code>aspectRatio: 1</code>; mini / full only set container padding or flex. Animate corner radius from <code>progress</code>
</summary>

````mdx-code-block
```tsx
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
<br />
<details>
<summary>
  <b>[2]</b> in the checkpoint, <code>PlayerTitle</code> and <code>PlayerArtist</code> also interpolate <code>fontSize</code> from <code>progress</code>
</summary>

````mdx-code-block
```tsx
// PlayerTitle.tsx
const animatedStyle = useAnimatedStyle(() => ({
  fontSize: interpolate(progress.value, [0, 1], [14, 22]),
}));

// PlayerArtist.tsx
const animatedStyle = useAnimatedStyle(() => ({
  fontSize: interpolate(progress.value, [0, 1], [12, 16]),
}));
```
````

</details>
<br />
<details>
<summary>
  <b>[3]</b> keep entering on full-only UI: <code>PlayerHeader</code>, <code>PlayerScrubber</code>, and <code>PlayerControls</code> use <code>entering=&#123;FadeIn&#125;</code> (and <code>key=&#123;state.variant&#125;</code> on controls) like the gesture-track baseline
</summary>

````mdx-code-block
```tsx
<Animated.View entering={FadeIn} style={styles.header}>
```
````

````mdx-code-block
```tsx
<LayoutAnimationConfig skipEntering>
  <Animated.View key={state.variant} entering={FadeIn} style={variantStyle.container}>
```
````

</details>

> Checkpoint: compare your work with [`steps/step3-gesture`](./steps/step3-gesture/)

## Step 4 - Entering on variant swap

Build on [`steps/step3-gesture`](./steps/step3-gesture/). Only `PlayerArtwork.tsx` and `PlayerMeta.tsx` change. Controls already fade on variant change in step 3.

When `variant` flips at `SWAP`, remount artwork and meta so `FadeIn` runs on the new layout.

### a. Remount meta with `FadeIn`

<details>
<summary>
  <b>[1]</b> wrap <code>PlayerMeta</code> in <code>LayoutAnimationConfig skipEntering</code>, set <code>key=&#123;state.variant&#125;</code>, and add <code>entering=&#123;FadeIn&#125;</code> on the outer <code>Animated.View</code>
</summary>

````mdx-code-block
```tsx
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

### b. Remount artwork with `FadeIn`

<details>
<summary>
  <b>[1]</b> same pattern on the artwork container; use <code>AnimatedImage</code> for the cover
</summary>

````mdx-code-block
```tsx
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

> Checkpoint: compare your work with [`steps/step4-gesture-LA`](./steps/step4-gesture-LA/)

## Step 5 - Variant FLIP

Build on [`steps/step3-gesture`](./steps/step3-gesture/) (not step 4). Replace the fade-in remount on artwork and meta with a FLIP-style translate. `PlayerControls` / header entering from step 3 stays as-is.

### a. Add `useVariantFlip`

<details>
<summary>
  <b>[1]</b> add <code>steps/step5-gesture-flip/useVariantFlip.ts</code> — register a capture callback, measure before the variant changes, then apply translate offset after layout and animate back to zero
</summary>

````mdx-code-block
```ts
export function useVariantFlip(variant: PlayerVariant) {
  const { registerFlipCapture } = useAnimationMeta();
  const targetRef = useRef<View | null>(null);
  const flipX = useSharedValue(0);
  const flipY = useSharedValue(0);

  useEffect(() => {
    return registerFlipCapture(() => {
      const node = targetRef.current;
      if (!node) return Promise.resolve();

      return new Promise<void>((resolve) => {
        node.measure((x, y, width, height, pageX, pageY) => {
          firstPositionRef.current = { x: pageX, y: pageY };
          resolve();
        });
      });
    });
  }, [registerFlipCapture]);

  useLayoutEffect(() => {
    // on variant change: flipX/Y = first - last, then withTiming(0)
  }, [variant]);

  const flipStyle = useAnimatedStyle<ViewStyle>(() => ({
    transform: [{ translateX: flipX.value }, { translateY: flipY.value }],
  }));

  return { targetRef, flipStyle };
}
```
````

</details>

### b. Capture layout before `setVariant`

<details>
<summary>
  <b>[1]</b> in <code>PlayerProvider.tsx</code>, collect capture callbacks and await them inside <code>swapVariant</code> before <code>setVariant</code>
</summary>

````mdx-code-block
```tsx
const captureFlipTargets = () =>
  Promise.all(
    Array.from(flipCaptureCallbacksRef.current, (callback) => callback()),
  ).then(() => undefined);

const swapVariant = (nextVariant: PlayerVariant) => {
  transitionQueueRef.current = transitionQueueRef.current.then(async () => {
    if (variantRef.current === nextVariant) {
      return;
    }

    await captureFlipTargets();

    variantRef.current = nextVariant;
    setVariant(nextVariant);
  });
};

<AnimationMetaContext.Provider
  value={{ progress, registerFlipCapture, captureFlipTargets }}
>
```
````

</details>

### c. Wire flip on artwork and meta

<details>
<summary>
  <b>[1]</b> in <code>PlayerArtwork.tsx</code> and <code>PlayerMeta.tsx</code>, drop <code>key</code> / <code>FadeIn</code> wrappers; attach <code>ref=&#123;targetRef&#125;</code> and <code>flipStyle</code>
</summary>

````mdx-code-block
```tsx
const { targetRef, flipStyle } = useVariantFlip(state.variant);

// PlayerArtwork — outer View for variant layout, inner Animated.View carries flip
<View style={variantStyle.container}>
  <Animated.View
    ref={targetRef}
    style={[styles.artwork, animatedStyle, flipStyle]}
  >
    <Image … />
  </Animated.View>
</View>

// PlayerMeta
<Animated.View ref={targetRef} style={[variantStyle.container, flipStyle]}>
  {children}
</Animated.View>
```
````

</details>

> Checkpoint: compare your work with [`steps/step5-gesture-flip`](./steps/step5-gesture-flip/)

## Next step

**Go to: [Scroll Animation](../Bonus_ScrollAnimation/)**
