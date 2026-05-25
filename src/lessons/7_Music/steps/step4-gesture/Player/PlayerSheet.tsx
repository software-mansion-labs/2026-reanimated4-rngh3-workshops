import { type ReactNode } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";

import { useAnimationMeta } from "@/lessons/7_Music/shared/animationMeta";
import {
  colors,
  MINI_PLAYER_HEIGHT,
  spacing,
} from "@/lessons/7_Music/shared/data";

import { usePlayer } from "./PlayerProvider";

export function PlayerSheet({ children }: { children: ReactNode }) {
  const { state, actions } = usePlayer();
  const { progress } = useAnimationMeta();
  const { height: screenHeight } = useWindowDimensions();
  const startProgress = useSharedValue(0);
  const position = useVariantPosition();
  const variantStyle = styles[state.variant];
  const positionStyle = position[state.variant];

  const animatedStyle = useAnimatedStyle(() => {
    return {
      top: interpolate(
        progress.value,
        [0, 1],
        [position.mini.top, position.full.top],
      ),
      bottom: interpolate(
        progress.value,
        [0, 1],
        [position.mini.bottom, position.full.bottom],
      ),
      left: interpolate(
        progress.value,
        [0, 1],
        [position.mini.left, position.full.left],
      ),
      right: interpolate(
        progress.value,
        [0, 1],
        [position.mini.right, position.full.right],
      ),
      paddingTop: interpolate(
        progress.value,
        [0, 1],
        [0, position.full.paddingTop],
      ),
      borderRadius: interpolate(progress.value, [0, 1], [8, 0]),
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [colors.surfaceElevated, colors.background],
      ),
    };
  });

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
      // a velocity threshold could also be used here
      const shouldBeExpanded = progress.value > 0.5;
      progress.value = withSpring(shouldBeExpanded ? 1 : 0);
    });

  const tap = Gesture.Tap()
    .enabled(state.variant === "mini")
    .onStart(() => scheduleOnRN(actions.expand));

  const gesture = Gesture.Exclusive(pan, tap);

  if (!state.currentSong) {
    return null;
  }

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[variantStyle, positionStyle, animatedStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  mini: {
    position: "absolute",
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    paddingRight: spacing.three,
    gap: spacing.three,
  },
  full: {
    position: "absolute",
    overflow: "hidden",
    flexDirection: "column",
    paddingHorizontal: spacing.four,
    gap: spacing.three,
  },
});

function useVariantPosition() {
  const safeArea = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();

  const bottom = safeArea.bottom + spacing.two;
  const left = spacing.two;
  const right = spacing.two;

  return {
    mini: {
      top: screenHeight - bottom - MINI_PLAYER_HEIGHT,
      bottom,
      left,
      right,
    },
    full: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      paddingTop: safeArea.top + spacing.two,
      paddingBottom: safeArea.bottom + spacing.four,
    },
  };
}
