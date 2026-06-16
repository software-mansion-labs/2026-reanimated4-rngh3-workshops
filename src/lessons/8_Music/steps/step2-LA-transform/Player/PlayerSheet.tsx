import { type ReactNode } from "react";
import { Pressable, StyleSheet, useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  colors,
  MINI_PLAYER_HEIGHT,
  spacing,
} from "@/lessons/8_Music/shared/data";

import { playerLayout } from "./layout";
import { usePlayer } from "./PlayerProvider";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PlayerSheet({ children }: { children: ReactNode }) {
  const { state, actions } = usePlayer();
  const position = useVariantPosition();
  const variantStyle = styles[state.variant];
  const positionStyle = position[state.variant];

  const animatedSurfaceStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(
      state.variant === "full" ? colors.background : colors.surfaceElevated,
      { duration: 220 },
    ),
    borderRadius: withTiming(state.variant === "full" ? 0 : 8, {
      duration: 220,
    }),
  }));

  if (!state.currentSong) {
    return null;
  }

  return (
    <AnimatedPressable
      layout={playerLayout}
      onPress={state.variant === "mini" ? actions.expand : undefined}
      style={[variantStyle, positionStyle, animatedSurfaceStyle]}
    >
      {children}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  mini: {
    position: "absolute",
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.two,
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
