# CSS Animations Advanced

https://github.com/user-attachments/assets/c6cd3ecc-4d0d-4f38-8a1f-49cd50e3a269

|        | Goal                                      | Checkpoint                                         |
| ------ | ----------------------------------------- | -------------------------------------------------- |
| Start  | Starting point                            | [`steps/boilerplate.tsx`](./steps/boilerplate.tsx) |
| Step 1 | Define shake keyframes and apply to icon  | [`steps/step1.tsx`](./steps/step1.tsx)             |
| Step 2 | Toggle edit mode with long press and tap  | [`steps/step2.tsx`](./steps/step2.tsx)             |
| Final  | Scale icon on long press via shared value | [`steps/final.tsx`](./steps/final.tsx)             |

## Step 1 - Add a shake animation using CSS Animations

https://github.com/user-attachments/assets/eb5efd34-bdd3-4341-9863-704913f3cef5

<details>
<summary>
  <b>[1]</b> Wrap the <code>AppIcon</code> component with an <code>Animated.View</code>
</summary>

<br/>

Make sure the <code>Animated</code> is imported from <code>react-native-reanimated</code>.

```jsx
import Animated from "react-native-reanimated";

<Animated.View>
  <AppIcon app={apps[0]} />
</Animated.View>;
```

</details>
<br />

<details>
<summary>
  <b>[2]</b> Define the shake animation using keyframes by rotating the view back and forth clockwise and counter-clockwise by +/- 2 degrees every 15% of the animation. Set the animation duration to 700 ms and make it repeat indefinitely.
</summary>

<br/>

If you want, you can define the animation object outside of the component.

```jsx
const shake: CSSAnimationKeyframes = {
  from: {
    transform: [{ rotateZ: "2deg" }],
  },
  "15%": {
    transform: [{ rotateZ: "-2deg" }],
  },
  "30%": {
    transform: [{ rotateZ: "2deg" }],
  },
  "45%": {
    transform: [{ rotateZ: "-2deg" }],
  },
  "60%": {
    transform: [{ rotateZ: "2deg" }],
  },
  "75%": {
    transform: [{ rotateZ: "-2deg" }],
  },
  to: {
    transform: [{ rotateZ: "2deg" }],
  },
};

<Animated.View
  style={{
    animationName: shake,
    animationDuration: 700,
    animationIterationCount: "infinite",
  }}
>
  <AppIcon app={apps[0]} />
</Animated.View>;
```

</details>
<br />

> Checkpoint: compare your work with [`steps/step1.tsx`](./steps/step1.tsx)

## Step 2 - Add a long press to switch to the edit mode (turn on the shake animation), tap to cancel

https://github.com/user-attachments/assets/3e78a5eb-899f-4b67-abbb-f681f37818a7

<details>
<summary>
  <b>[1]</b> Define a <code>isEditMode</code> state variable. Make it <code>false</code> by default. Detach the animation object using this variable. 
</summary>

<br/>

```jsx
const [isEditMode, setEditMode] = useState(false);

<Animated.View
  style={[
    isEditMode && {
      animationName: shake,
      animationDuration: 700,
      animationIterationCount: "infinite",
    },
  ]}
>
```

</details>
<br />

<details>
<summary>
  <b>[2]</b> Define a <code>LongPress</code> gesture that enables the edit mode and a <code>Tap</code> gesture that disables it. Use  <code>onStart</code> callback for both of the gestures.
</summary>

<br/>

```jsx
const [isEditMode, setEditMode] = useState(false);

const longPress = Gesture.LongPress().onStart(() => {
  scheduleOnRN(setEditMode, true);
});

const tap = Gesture.Tap().onStart(() => {
  scheduleOnRN(setEditMode, false);
});
```

</details>
<br />

<details>
<summary>
  <b>[3]</b> Make the gestures mutually exclusive. Pass the composed gesture to a <code>GestureDetector</code> wrapping our <code>Animated.View</code>.
</summary>

<br/>

```jsx
const composed = Gesture.Exclusive(longPress, tap);

<GestureDetector gesture={composed}>
  <Animated.View>{/* */}</Animated.View>
</GestureDetector>;
```

</details>
<br />

> Checkpoint: compare your work with [`steps/step2.tsx`](./steps/step2.tsx)

## Step 3 - Scale the app icon to indicate the edit mode change

https://github.com/user-attachments/assets/c6cd3ecc-4d0d-4f38-8a1f-49cd50e3a269

<details>
<summary>
  <b>[1]</b> Define a <code>scale</code> shared value defaulted to <code>1</code>. Attach it to the <code>Animated.View</code> using <code>useAnimatedStyle</code>.
</summary>

<br/>

```jsx
import { useSharedValue } from "react-native-reanimated";

const scale = useSharedValue(1);

const scaleStyle = useAnimatedStyle(() => {
  return {
    transform: [{ scale: scale.value }],
  };
});

<Animated.View
  style={[
    isEditMode &&
      {
        /* ... */
      },
    scaleStyle,
  ]}
>
  {/* */}
</Animated.View>;
```

</details>
<br />

<details>
<summary>
  <b>[2]</b> Smoothly grow the app icon by 10% using the <code>LongPress</code> gesture. Make sure to scale the app icon back to it's original size when user aborts the gesture.
</summary>

<br/>

```jsx
const longPress = Gesture.LongPress()
  .onBegin(() => {
    scale.value = withTiming(1.1, { duration: 500 });
  })
  .onStart(() => {
    scale.value = withTiming(1, { duration: 150 }, (finished) => {
      if (finished) {
        scheduleOnRN(setEditMode, true);
      }
    });
  })
  .onFinalize(() => {
    scale.value = withTiming(1, { duration: 150 });
  });
```

</details>
<br />

> Checkpoint: compare your work with [`steps/final.tsx`](./steps/final.tsx)

## Next step

**Go to: [Reorder Icons](../ReorderIcons/)**
