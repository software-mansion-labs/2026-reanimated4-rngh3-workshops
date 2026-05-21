# AdvancedLayoutAnimations

https://github.com/user-attachments/assets/b83c7b61-361d-48a3-8f3d-4fa7061222c7

|        | Goal                                               | Checkpoint                                         |
| ------ | -------------------------------------------------- | -------------------------------------------------- |
| Start  | Starting point                                     | [`steps/boilerplate.tsx`](./steps/boilerplate.tsx) |
| Step 1 | Animate FAB container layout with LinearTransition | [`steps/step1.tsx`](./steps/step1.tsx)             |
| Step 2 | Animate icon mount/unmount with FadeIn/FadeOut     | [`steps/step2.tsx`](./steps/step2.tsx)             |
| Step 3 | Animate heading and content on open                | [`steps/step3.tsx`](./steps/step3.tsx)             |
| Final  | Handle keyboard with useAnimatedKeyboard           | [`steps/final.tsx`](./steps/final.tsx)             |
| Bonus  | Skip initial enter with LayoutAnimationConfig      | [`steps/bonus.tsx`](./steps/bonus.tsx)             |

In this exercise you'll create a smooth and visually appealing animation for a Floating Action Button (FAB) that expands to reveal additional content when pressed.
The FAB will be animated using `LayoutAnimation` to smoothly transition between its collapsed and expanded states and will also include a keyboard handling feature to adjust its position when the keyboard is open.

The `boilerplate` has the structure of the component for the 2 states, `opened` and `closed` that is changed via a `Pressable`.
For `closed` state we display

- the `plus` icon
- a `View` that has a predefined `closed` size

For `opened` state we display

- the `cross` icon (instead of `plus` icon)
- a `View` that has a predefined `opened` size
- a text header
- a content
- a `TextInput` field.

## Step 1

https://github.com/user-attachments/assets/ca2dfa7e-6e5a-4064-8c5a-f84956716364

In this step, we will animate the FAB button container layout changes using `layout` property, based on `isOpen` (inline styles)

<details>
<summary>
  <b>[1]</b> convert the `fabButton` `View` to an `Animated.View`
</summary>

```jsx
<Animated.View
  style={[
    {
      width: isOpen ? _openedSize : _closedSize,
      height: isOpen ? "auto" : _closedSize,
      minHeight: _closedSize,
    },
    styles.fabButton,
  ]}
>
  // ...
</Animated.View>
```

</details>
<details>
<summary>
  <b>[2]</b> apply the `layout` animation using the `_duration`
</summary>

```jsx
<Animated.View
  style={[
    {
      width: isOpen ? _openedSize : _closedSize,
      height: isOpen ? "auto" : _closedSize,
      minHeight: _closedSize,
    },
    styles.fabButton,
  ]}
  layout={LinearTransition.duration(_duration)}
>
  // ...
</Animated.View>
```

</details>

> Checkpoint: compare your work with [`steps/step1.tsx`](./steps/step1.tsx)

## Step 2

https://github.com/user-attachments/assets/cc00d745-4384-49de-952a-1bc88e291a09

In this step we will animate the icons based using `layout` transitions as well as mounting animations via `entering` and `exiting` properties.

<details>
<summary>
  <b>[1]</b> create `AnimatedEntypo` component to be able to apply layout animations to it.
</summary>

```jsx
const AnimatedEntypo = Animated.createAnimatedComponent(Entypo);
```

</details>

<details>
<summary>
  <b>[2]</b> use the `AnimatedEntypo` instead of `Entypo` component
</summary>

```jsx
{
  isOpen ? (
    <AnimatedEntypo
      key="close"
      name="cross"
      size={_closeIconSize}
      color="#fff"
    />
  ) : (
    <AnimatedEntypo key="open" name="plus" size={_openIconSize} color="#fff" />
  );
}
```

</details>

:::tip
Now, because the icon can be animated, we will leverage `layout animations`, more specifically the `entering` and `exiting` props, where entering stands for `mounting` & exiting stands for `unmounting` the node. We are toggling between these using `isOpen` state.
:::

<details>

<summary>
  <b>[3]</b> Apply a `FadeIn`/`FadeOut` on both icons so they'll fade when being `rendered`.
</summary>

```jsx
{
  isOpen ? (
    <AnimatedEntypo
      key="close"
      name="cross"
      // ...
      entering={FadeIn.duration(_duration)}
      exiting={FadeOut.duration(_duration)}
    />
  ) : (
    <AnimatedEntypo
      key="open"
      name="plus"
      // ...
      entering={FadeIn.duration(_duration)}
      exiting={FadeOut.duration(_duration)}
    />
  );
}
```

</details>

> [4] Since we are changing the layout of the container, `small -> large` based on `isOpen`, the position (x,y) of the icon is changed hence, we need to apply the motion to the `layout` changes of the icons container.

<details>
<summary>
<b>[4.1]</b> create an `AnimatedPressable` using `Animated.createAnimatedComponent`
</summary>

```jsx
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
```

</details>
<details>

<summary>
<b>[4.2]</b> use this component instead of the `Pressable`
</summary>

```jsx
<AnimatedPressable onPress={() => setIsOpen(isOpen => !isOpen)} />
```

</details>
<details>

<summary>
<b>[4.3]</b> apply the layout transition to the `AnimatedPressable` component, using the same `_duration` constant
</summary>

```jsx
<AnimatedPressable
  // ...
  layout={LinearTransition.duration(_duration)}
/>
```

</details>

> Checkpoint: compare your work with [`steps/step2.tsx`](./steps/step2.tsx)

## Step 3

https://github.com/user-attachments/assets/b78391ca-e954-4b40-9d94-d2e29b678c51

In this step we'll animate the mounting/unmounting of the content and the title rendered inside the FAB container.

> [1] Animate the FAB heading text render

<details>
<summary>
<b>[1.1]</b> convert the heading `Text` to an `Animated.Text`
</summary>

```jsx
{
  isOpen && (
    <Animated.Text style={styles.heading}>App.js Workshop</Animated.Text>
  );
}
```

</details>
<details>
<summary>
<b>[1.2]</b> Apply a `FadeInDown`/`FadeOutDown` with `_duration` when it's being `rendered`.
</summary>

```jsx
{
  isOpen && (
    <Animated.Text
      style={styles.heading}
      entering={FadeInDown.duration(_duration)}
      exiting={FadeOutDown.duration(_duration)}
    >
      App.js Workshop
    </Animated.Text>
  );
}
```

</details>

> [2] Animate the FAB content

<details>
<summary>
<b>[2.1]</b> convert the content `View` to an `Animated.View`
</summary>

```jsx
{
  isOpen && <Animated.View style={styles.content}>//...</Animated.View>;
}
```

</details>
<details>
<summary>
<b>[2.2]</b> Use the same `FadeInDown`/`FadeOutDown`, used on the heading.
</summary>

```jsx
{
  isOpen && (
    <Animated.View
      entering={FadeInDown.duration(_duration)}
      exiting={FadeOutDown.duration(_duration)}
      style={styles.content}
    >
      // ...
    </Animated.View>
  );
}
```

</details>

> Checkpoint: compare your work with [`steps/step3.tsx`](./steps/step3.tsx)

## Step 4

https://github.com/user-attachments/assets/87df1fbe-0cd8-4508-9b40-9ce8d638612d

In this step we will take care of the keyboard when the `TextInput` is focused, moving the FAB button up when the keyboard is open.
We will use `useAnimatedKeyboard` and `KeyboardState` from `react-native-keyboard-controller`

:::tip
`useAnimatedKeyboard` from `react-native-reanimated` is [deprecated](https://docs.swmansion.com/react-native-reanimated/docs/device/useAnimatedKeyboard). `react-native-keyboard-controller` ships a **drop-in compatibility wrapper** with the same API. `KeyboardProvider` is already wrapping the app in `_layout.tsx`.
:::

<details>
<summary>
  <b>[1]</b> Import <code>useAnimatedKeyboard</code> and <code>KeyboardState</code> from <code>react-native-keyboard-controller</code> and create the <code>keyboardState</code> constant.
</summary>

```jsx
import {
  KeyboardState,
  useAnimatedKeyboard,
} from "react-native-keyboard-controller";

const keyboardState = useAnimatedKeyboard();
```

</details>

<details>
<summary>
  <b>[2]</b> Create <code>keyboardHeightStylez</code> animated styles using <code>useAnimatedStyle()</code>
</summary>

```jsx
const keyboardHeightStylez = useAnimatedStyle(() => {
  return {};
});
```

</details>

<details>
<summary>
  <b>[3]</b> Animate <code>marginBottom</code> using the <code>keyboardState</code> height value, when <code>KeyboardState</code> is <code>OPEN</code>, otherwise <code>0</code>
</summary>

```jsx
const keyboardHeightStylez = useAnimatedStyle(() => {
  return {
    marginBottom:
      keyboardState.state.value === KeyboardState.OPEN
        ? keyboardState.height.value - 80 + _spacing
        : 0,
  };
});
```

</details>

:::tip
You should take into account the `bottom` position of the `fabButton` when calculating the margin.
:::

<details>
<summary>
  <b>[4]</b> Apply <code>keyboardHeightStylez</code> to the <code>fabButton</code> container
</summary>

```jsx
<Animated.View
  style={[
    {
      width: isOpen ? _openedSize : _closedSize,
      height: isOpen ? "auto" : _closedSize,
    },
    styles.fabButton,
    keyboardHeightStylez,
  ]}
  layout={LinearTransition.duration(_duration)}
>
  //...
</Animated.View>
```

</details>

> Checkpoint: compare your work with [`steps/final.tsx`](./steps/final.tsx)

## Bonus

Skip entering using [LayoutAnimationConfig](https://docs.swmansion.com/react-native-reanimated/docs/next/layout-animations/layout-animation-config/) - applied to the AnimatedEntypo.
This is useful if you don't want to animate the initial entering of the icon (FadeIn animation) and want to skip it.
`LayoutAnimationConfig` is a component that lets you skip entering and exiting animations applied only once.

<details>
<summary>
  <b>[1]</b> Wrap the icons ternary with `LayoutAnimationConfig` and pass `skipEntering`
</summary>

```jsx
<LayoutAnimationConfig skipEntering>//...</LayoutAnimationConfig>
```

</details>

> Checkpoint: compare your work with [`steps/bonus.tsx`](./steps/bonus.tsx)

## Next step

**Go to: [Interpolation](../4_Interpolation/)**
