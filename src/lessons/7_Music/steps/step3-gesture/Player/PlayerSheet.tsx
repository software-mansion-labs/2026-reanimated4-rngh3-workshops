import { type ReactNode } from "react";
import { Pressable, StyleSheet, useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAnimationMeta } from "@/lessons/7_Music/shared/animationMeta";
import {
  colors,
  MINI_PLAYER_HEIGHT,
  spacing,
} from "@/lessons/7_Music/shared/data";

import {
  PAN_ACTIVATION_THRESHOLD,
  SNAP_EXPAND_THRESHOLD,
  VELOCITY_SNAP_THRESHOLD,
} from "./layout";
import { PlayerVariantProvider, usePlayer } from "./PlayerProvider";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PlayerSheet({ children }: { children: ReactNode }) {
  const { state, actions } = usePlayer();
  const { progress } = useAnimationMeta();
  const { height: screenHeight } = useWindowDimensions();
  const startProgress = useSharedValue(0);
  const variant = state.variant ?? "mini";
  const position = useVariantPosition();

  const sheetStyle = useAnimatedStyle(() => {
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
      borderRadius: interpolate(progress.value, [0, 1], [8, 0]),
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [colors.surfaceElevated, colors.background],
      ),
    };
  });

  const pan = Gesture.Pan()
    .activeOffsetY([-PAN_ACTIVATION_THRESHOLD, PAN_ACTIVATION_THRESHOLD])
    .onStart(() => {
      startProgress.value = progress.value;
    })
    .onUpdate((event) => {
      const delta = -event.translationY / screenHeight;
      const next = startProgress.value + delta;
      progress.value = next < 0 ? 0 : next > 1 ? 1 : next;
    })
    .onEnd((event) => {
      const flickUp = event.velocityY < -VELOCITY_SNAP_THRESHOLD;
      const flickDown = event.velocityY > VELOCITY_SNAP_THRESHOLD;
      const shouldExpand =
        flickUp || (!flickDown && progress.value > SNAP_EXPAND_THRESHOLD);

      progress.value = withSpring(shouldExpand ? 1 : 0);
    });

  if (!state.currentSong) {
    return null;
  }

  return (
    <GestureDetector gesture={pan}>
      <AnimatedPressable
        onPress={variant === "mini" ? actions.expand : undefined}
        style={[styles[variant], position[variant], sheetStyle]}
      >
        <PlayerVariantProvider value={variant}>
          {children}
        </PlayerVariantProvider>
      </AnimatedPressable>
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
