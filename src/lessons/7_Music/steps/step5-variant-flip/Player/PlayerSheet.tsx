import { type ReactNode } from "react";
import { Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
import { useAnimationMeta } from "@/lessons/7_Music/shared/animationMeta";

import { PlayerVariantProvider, usePlayer } from "./PlayerProvider";

export function PlayerSheet({ children }: { children: ReactNode }) {
  const { state, actions } = usePlayer();
  const { progress } = useAnimationMeta();
  const { height: screenHeight } = useWindowDimensions();
  const startProgress = useSharedValue(0);
  const variant = state.variant ?? "mini";
  const variantInsets = useVariantInsets(variant, screenHeight);

  const sheetStyle = useAnimatedStyle(() => {
    const progressValue = progress.value;
    const { miniTop, miniBottom, miniLeft, miniRight } =
      variantInsets.miniFrame;

    return {
      top: interpolate(progressValue, [0, 1], [miniTop, 0]),
      bottom: interpolate(progressValue, [0, 1], [miniBottom, 0]),
      left: interpolate(progressValue, [0, 1], [miniLeft, 0]),
      right: interpolate(progressValue, [0, 1], [miniRight, 0]),
      borderRadius: interpolate(progressValue, [0, 1], [8, 0]),
      backgroundColor: interpolateColor(
        progressValue,
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

  const variantStyle = variantStyles[variant];

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.surface, sheetStyle]}>
        <Pressable
          onPress={variant === "mini" ? actions.expand : undefined}
          style={styles.pressable}
        >
          <View
            style={[styles.innerBase, variantStyle.inner, variantInsets.inner]}
          >
            <PlayerVariantProvider value={variant}>
              {children}
            </PlayerVariantProvider>
          </View>
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  surface: {
    position: "absolute",
    overflow: "hidden",
  },
  pressable: {
    flex: 1,
  },
  innerBase: {
    flex: 1,
  },
});

const variantStyles = {
  mini: StyleSheet.create({
    inner: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.two,
      paddingRight: spacing.three,
      gap: spacing.three,
    },
  }),
  full: StyleSheet.create({
    inner: {
      flexDirection: "column",
      paddingHorizontal: spacing.four,
      gap: spacing.three,
    },
  }),
};

function useVariantInsets(variant: "mini" | "full", screenHeight: number) {
  const insets = useSafeAreaInsets();

  const miniBottom = insets.bottom + spacing.two;
  const miniLeft = spacing.two;
  const miniRight = spacing.two;
  const miniTop = screenHeight - miniBottom - MINI_PLAYER_HEIGHT;

  return {
    inner:
      variant === "full"
        ? {
            paddingTop: insets.top + spacing.two,
            paddingBottom: insets.bottom + spacing.four,
          }
        : undefined,
    miniFrame: { miniTop, miniBottom, miniLeft, miniRight },
  };
}
