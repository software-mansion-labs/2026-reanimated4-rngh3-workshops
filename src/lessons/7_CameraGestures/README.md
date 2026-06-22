# Camera Gestures

https://github.com/user-attachments/assets/96c862ff-85cd-401d-ab73-c8a9f28dfeea

|        | Goal                                                       | Checkpoint                                         |
| ------ | ---------------------------------------------------------- | -------------------------------------------------- |
| Start  | Starting point — static camera UI                          | [`steps/boilerplate.tsx`](./steps/boilerplate.tsx) |
| Step 1 | Pinch to zoom and double-tap to flip the camera            | [`steps/step1.tsx`](./steps/step1.tsx)             |
| Step 2 | Swipe and tap the carousel to pick a filter                | [`steps/step2.tsx`](./steps/step2.tsx)             |
| Final  | Capture button: tap to photo, hold to record, drag to zoom | [`steps/final.tsx`](./steps/final.tsx)             |

In this exercise you'll build a camera screen driven entirely by gestures, the way a real camera app behaves. Along the way you'll learn how to recognize individual gestures and — more importantly — how to **compose** them so that multiple gestures can coexist on the same view without fighting each other.

This lesson uses the hook-based gesture API from `react-native-gesture-handler` (`useTapGesture`, `usePinchGesture`, `usePanGesture`, `useLongPressGesture`) together with the composition hooks `useCompetingGestures`, `useSimultaneousGestures` and `useExclusiveGestures`.

The `boilerplate` already has the full static UI:

- a `ViewFinder` that fills the screen and shows which camera (`back`/`front`) is active
- a `FilterOverlay` tinting the viewfinder with the selected filter color
- a `FilterCarousel` of colored circles at the bottom
- a `CaptureButton` with a circular recording-progress indicator (SVG)
- a `cameraSwitch` `Pressable` in the top-right corner

Everything is wired to React state (`cameraType`, `selectedFilter`) and the capture progress is hard-coded to `0`. Our job is to make it interactive.

## Step 1 - Zoom and switch the camera on the viewfinder

We want two gestures on the viewfinder: **pinch** to zoom the camera and **double-tap** to flip between the front and back camera.

**[1] Pinch to zoom**

<details>
<summary>
  create a <code>zoomLevel</code> shared value (starting at <code>1</code>) and drive the <code>ViewFinder</code> scale from it
</summary>

```tsx
const zoomLevel = useSharedValue(1);

// inside ViewFinder
const animatedStyle = useAnimatedStyle(() => {
  return {
    transform: [{ scale: props.zoom.value }],
  };
});
```

Turn the `ViewFinder` root into an `Animated.View` and apply `animatedStyle`, then pass `zoom={zoomLevel}` down as a prop.

</details>
<br />
<details>
<summary>
  create a <code>usePinchGesture</code> and update <code>zoomLevel</code> from the pinch <code>scaleChange</code>, clamped to <code>[1, 4]</code>
</summary>

```tsx
const pinchZoom = usePinchGesture({
  onUpdate: (event) => {
    zoomLevel.value = Math.min(
      Math.max(1, event.scaleChange * zoomLevel.value),
      4,
    );
  },
});
```

</details>
<br />

> **Tip:** We multiply by `event.scaleChange` (the delta since the last frame) instead of using the absolute `scale`, so the zoom continues from wherever it was when the gesture started.

**[2] Double-tap to switch camera**

<details>
<summary>
  create a <code>useTapGesture</code> that requires two taps and flips <code>cameraType</code>
</summary>

```tsx
const cameraSwitch = useTapGesture({
  runOnJS: true,
  numberOfTaps: 2,
  onActivate: () => {
    setCameraType((prev) => (prev === "back" ? "front" : "back"));
  },
});
```

</details>
<br />

> **Tip:** `onActivate` calls `setCameraType`, a React state setter that must run on the JS thread — hence `runOnJS: true`.

**[3] Compose both gestures and attach them**

<details>
<summary>
  combine the two gestures with <code>useCompetingGestures</code> and wrap the viewfinder in a <code>GestureDetector</code>
</summary>

```tsx
const viewFinderGesture = useCompetingGestures(pinchZoom, cameraSwitch);

<GestureDetector gesture={viewFinderGesture}>
  <View style={styles.viewFinderWrapper}>
    <ViewFinder
      cameraType={cameraType}
      selectedFilter={selectedFilter}
      zoom={zoomLevel}
    />
    {/* cameraSwitch Pressable */}
  </View>
</GestureDetector>;
```

</details>
<br />

> **Tip:** `useCompetingGestures` lets the recognizers race — whichever activates first wins, so a pinch and a double-tap never trigger at the same time.

> Checkpoint: compare your work with [`steps/step1.tsx`](./steps/step1.tsx)

## Step 2 - Pick a filter by swiping and tapping

Now we make the bottom carousel interactive: **pan** horizontally to scroll through filters with a snap, and **tap** a circle to jump straight to it. The viewfinder overlay should cross-fade between colors as you scroll.

**[1] Promote `selectedFilter` to a shared value**

<details>
<summary>
  replace the <code>selectedFilter</code> React state with a shared value so it can be animated on the UI thread
</summary>

```tsx
const selectedFilter = useSharedValue(2);
```

Update `FilterCarousel`, `FilterOverlay` and `ViewFinder` to take `selected`/`selectedFilter` as `SharedValue<number>`.

</details>
<br />
<details>
<summary>
  animate the carousel position with <code>useAnimatedStyle</code> based on <code>selected.value</code>
</summary>

```tsx
const style = useAnimatedStyle(() => {
  return {
    gap: props.filterGap,
    transform: [
      {
        translateX:
          -props.filterSize / 2 -
          (props.filterSize + props.filterGap) * props.selected.value,
      },
    ],
  };
});
```

</details>
<br />

**[2] Pan across the carousel**

<details>
<summary>
  create a <code>usePanGesture</code> that moves <code>selectedFilter</code> as you drag, and snaps to the nearest filter when released
</summary>

```tsx
const filterCarouselGesture = usePanGesture({
  onUpdate: (event) => {
    selectedFilter.value -= event.changeX / (FILTER_SIZE + FILTER_GAP);
  },
  onDeactivate: () => {
    const clampedValue = Math.min(
      Math.max(0, Math.round(selectedFilter.value)),
      FILTERS.length - 1,
    );
    selectedFilter.value = withSpring(clampedValue);
  },
});
```

Wrap the `bottomBar` `View` in a `GestureDetector` using this gesture.

</details>
<br />

> **Tip:** Dividing `changeX` by `FILTER_SIZE + FILTER_GAP` converts pixels of drag into fractional filter indices, so `selectedFilter` can hold values like `2.4` mid-swipe. On release we `Math.round` and `withSpring` to the nearest valid index.

**[3] Tap a filter to select it**

<details>
<summary>
  extract a <code>Filter</code> component with its own <code>useTapGesture</code>
</summary>

```tsx
function Filter(props: FilterProps) {
  const tapGesture = useTapGesture({
    onActivate: () => {
      props.selected.value = withSpring(props.index);
    },
  });

  return (
    <GestureDetector gesture={tapGesture}>
      <View
        style={
          {
            /* circle styles */
          }
        }
      />
    </GestureDetector>
  );
}
```

</details>
<br />

**[4] Cross-fade the overlay**

<details>
<summary>
  animate the <code>FilterOverlay</code> so it fades out and back in while transitioning between colors
</summary>

```tsx
const animatedStyle = useAnimatedStyle(() => {
  const progress = props.selectedFilter.value % 1;
  return {
    backgroundColor: FILTERS[Math.round(props.selectedFilter.value)],
    opacity: interpolate(progress, [0, 0.5, 1], [0.5, 0, 0.5], "clamp"),
  };
});
```

</details>
<br />

> **Tip:** The opacity dips to `0` at the half-way point (`progress === 0.5`) so the color can swap invisibly, then fades back to `0.5` — a clean cross-fade without ever showing the wrong color at full strength.

> Checkpoint: compare your work with [`steps/step2.tsx`](./steps/step2.tsx)

## Step 3 - The capture button (final)

The last piece is the capture button, which packs three gestures onto a single element:

- **tap** → take a photo
- **long press** → record a video while the progress ring fills, stopping on release or when the timer completes
- **vertical pan** → zoom the camera, while leaving the horizontal carousel pan free to do its job

This is the real test of gesture composition.

**[1] Animate the progress ring**

<details>
<summary>
  turn <code>captureProgress</code> into a shared value and drive the SVG stroke with <code>useAnimatedProps</code>
</summary>

```tsx
const captureProgress = useSharedValue(0);

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// inside CaptureButton
const animatedProps = useAnimatedProps(() => {
  const strokeDashOffset = svgRadius * 2 * Math.PI * (1 - props.progress.value);
  return { strokeDashoffset: strokeDashOffset };
});
```

</details>
<br />

<details>
<summary>
  add worklet helpers for the capture actions
</summary>

```tsx
function stopRecording(duration: number) {
  "worklet";
  console.log("Stopped recording after", duration, "ms");
  captureProgress.value = 0;
}

function takePhoto() {
  "worklet";
  console.log("Photo taken");
}
```

</details>
<br />

**[2] Vertical pan to zoom — without stealing the carousel's horizontal pan**

<details>
<summary>
  create a <code>panZoomGesture</code> that updates the zoom from <code>changeY</code> and waits for the carousel pan to fail
</summary>

```tsx
const panZoomGesture = usePanGesture({
  requireToFail: filterCarouselGesture,
  onUpdate: (event) => {
    zoomLevel.value = Math.min(
      Math.max(1, (1 - event.changeY / 200) * zoomLevel.value),
      4,
    );
  },
});
```

</details>
<br />

> **Tip:** `requireToFail: filterCarouselGesture` makes the zoom pan defer to the horizontal carousel pan. A horizontal swipe scrolls filters; a vertical drag on the button zooms — and they never both fire.

**[3] Long press to record**

<details>
<summary>
  create a <code>useLongPressGesture</code> that animates <code>captureProgress</code> to <code>1</code> over <code>VIDEO_DURATION</code>
</summary>

```tsx
const recordVideoGesture = useLongPressGesture({
  maxDistance: 1000000,
  shouldCancelWhenOutside: false,
  onActivate: () => {
    captureProgress.value = withTiming(
      1,
      { duration: VIDEO_DURATION, easing: Easing.linear },
      () => {
        if (captureProgress.value === 1) {
          stopRecording(VIDEO_DURATION);
        }
      },
    );
  },
  onDeactivate: (event) => {
    stopRecording(event.duration);
  },
});
```

</details>
<br />

> **Tip:** `maxDistance` is set very high and `shouldCancelWhenOutside` to `false` so the recording keeps going even if your finger drifts off the button (e.g. while pan-zooming at the same time).

**[4] Tap to take a photo**

<details>
<summary>
  create a <code>takePhotoGesture</code> with <code>useTapGesture</code>
</summary>

```tsx
const takePhotoGesture = useTapGesture({
  onActivate: () => {
    takePhoto();
  },
});
```

</details>
<br />

**[5] Compose them all**

<details>
<summary>
  combine pan-zoom + record (simultaneous) and put them in an exclusive relationship with the photo tap
</summary>

```tsx
const captureGesture = useExclusiveGestures(
  useSimultaneousGestures(panZoomGesture, recordVideoGesture),
  takePhotoGesture,
);

<GestureDetector gesture={captureGesture}>
  <CaptureButton progress={captureProgress} />
</GestureDetector>;
```

</details>
<br />

> **Tip:** The composition reads as: _"record and zoom at the same time, OR — failing that — take a photo."_ `useSimultaneousGestures` lets the long press and pan-zoom run together (hold and drag to zoom while recording), while `useExclusiveGestures` gives the long press priority over the tap so a quick press is a photo and a held press starts a recording.

> Checkpoint: compare your work with [`steps/final.tsx`](./steps/final.tsx)

## Next step

**Go to: [Music](../8_Music/)**
