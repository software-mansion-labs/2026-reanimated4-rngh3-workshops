import { type ReactNode } from "react";
import { Pressable, StyleSheet, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  colors,
  MINI_PLAYER_HEIGHT,
  spacing,
} from "@/lessons/7_Music/shared/data";

import { PlayerVariantProvider, usePlayer } from "./PlayerProvider";

export function PlayerSheet({ children }: { children: ReactNode }) {
  const { state, actions } = usePlayer();
  const variant = state.isExpanded ? "full" : "mini";
  const position = useVariantPosition();

  if (!state.currentSong) {
    return null;
  }

  return (
    <Pressable
      onPress={variant === "mini" ? actions.expand : undefined}
      style={[styles[variant], position[variant]]}
    >
      <PlayerVariantProvider value={variant}>{children}</PlayerVariantProvider>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  mini: {
    position: "absolute",
    overflow: "hidden",
    borderRadius: 8,
    backgroundColor: colors.surfaceElevated,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.two,
    paddingRight: spacing.three,
    gap: spacing.three,
  },
  full: {
    position: "absolute",
    overflow: "hidden",
    borderRadius: 0,
    backgroundColor: colors.background,
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
