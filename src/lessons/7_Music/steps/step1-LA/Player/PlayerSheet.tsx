import { type ReactNode } from "react";
import { StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  PlayerVariantProvider,
  usePlayer,
} from "./PlayerProvider";
import { colors, MINI_PLAYER_HEIGHT, spacing } from "@/lessons/7_Music/shared/data";

import { AnimatedPressable, playerLayout } from "./layout";

export function PlayerSheet({ children }: { children: ReactNode }) {
  const { state, actions } = usePlayer();
  const insets = useSafeAreaInsets();

  if (!state.currentSong) {
    return null;
  }

  const variant = state.isExpanded ? "full" : "mini";
  const variantStyle = variantStyles[variant];
  const animatedSurfaceStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(
      state.isExpanded ? colors.background : colors.surfaceElevated,
      { duration: 220 },
    ),
    borderRadius: withTiming(state.isExpanded ? 0 : 8, { duration: 220 }),
  }));

  return (
    <AnimatedPressable
      layout={playerLayout}
      onPress={variant === "mini" ? actions.expand : undefined}
      style={[
        styles.surface,
        animatedSurfaceStyle,
        variant === "mini"
          ? {
              bottom: insets.bottom + spacing.two,
              left: spacing.two,
              right: spacing.two,
              height: MINI_PLAYER_HEIGHT,
            }
          : {
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            },
      ]}
    >
      <Animated.View
        layout={playerLayout}
        style={
          variant === "mini"
            ? variantStyle.inner
            : [
                variantStyle.inner,
                {
                  paddingTop: insets.top + spacing.two,
                  paddingBottom: insets.bottom + spacing.four,
                },
              ]
        }
      >
        <PlayerVariantProvider value={variant}>{children}</PlayerVariantProvider>
      </Animated.View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  surface: {
    position: "absolute",
    overflow: "hidden",
  },
});

const variantStyles = {
  mini: StyleSheet.create({
    inner: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.two,
      paddingRight: spacing.three,
      gap: spacing.three,
    },
  }),
  full: StyleSheet.create({
    inner: {
      flex: 1,
      flexDirection: "column",
      paddingHorizontal: spacing.four,
      gap: spacing.three,
    },
  }),
};
