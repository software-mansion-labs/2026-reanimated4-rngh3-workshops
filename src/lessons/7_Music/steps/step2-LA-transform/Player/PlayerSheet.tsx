import { type ReactNode } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  colors,
  MINI_PLAYER_HEIGHT,
  spacing,
} from "@/lessons/7_Music/shared/data";

import { playerLayout } from "./layout";
import { PlayerVariantProvider, usePlayer } from "./PlayerProvider";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PlayerSheet({ children }: { children: ReactNode }) {
  const { state, actions } = usePlayer();
  const variant = state.isExpanded ? "full" : "mini";
  const variantInsets = useVariantInsets(variant);

  const animatedSurfaceStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(
      state.isExpanded ? colors.background : colors.surfaceElevated,
      { duration: 220 },
    ),
    borderRadius: withTiming(state.isExpanded ? 0 : 8, { duration: 220 }),
  }));

  if (!state.currentSong) {
    return null;
  }

  const variantStyle = variantStyles[variant];

  return (
    <AnimatedPressable
      layout={playerLayout}
      onPress={variant === "mini" ? actions.expand : undefined}
      style={[
        styles.surface,
        variantStyle.surface,
        variantInsets.surface,
        animatedSurfaceStyle,
      ]}
    >
      <Animated.View
        layout={playerLayout}
        style={[styles.innerBase, variantStyle.inner, variantInsets.inner]}
      >
        <PlayerVariantProvider value={variant}>
          {children}
        </PlayerVariantProvider>
      </Animated.View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  surface: {
    position: "absolute",
    overflow: "hidden",
  },
  innerBase: {
    flex: 1,
  },
});

const variantStyles = {
  mini: StyleSheet.create({
    surface: {},
    inner: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.two,
      paddingRight: spacing.three,
      gap: spacing.three,
    },
  }),
  full: StyleSheet.create({
    surface: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    inner: {
      flexDirection: "column",
      paddingHorizontal: spacing.four,
      gap: spacing.three,
    },
  }),
};

function useVariantInsets(variant: "mini" | "full") {
  const insets = useSafeAreaInsets();

  if (variant === "mini") {
    return {
      surface: {
        bottom: insets.bottom + spacing.two,
        left: spacing.two,
        right: spacing.two,
        height: MINI_PLAYER_HEIGHT,
      },
      inner: undefined,
    };
  }

  return {
    surface: undefined,
    inner: {
      paddingTop: insets.top + spacing.two,
      paddingBottom: insets.bottom + spacing.four,
    },
  };
}
