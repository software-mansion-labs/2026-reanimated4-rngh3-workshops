import { type ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";
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
  const variantInsets = useVariantInsets(variant);

  if (!state.currentSong) {
    return null;
  }

  const variantStyle = variantStyles[variant];

  return (
    <Pressable
      onPress={variant === "mini" ? actions.expand : undefined}
      style={[styles.surface, variantStyle.surface, variantInsets.surface]}
    >
      <View style={[styles.innerBase, variantStyle.inner, variantInsets.inner]}>
        <PlayerVariantProvider value={variant}>
          {children}
        </PlayerVariantProvider>
      </View>
    </Pressable>
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
    surface: {
      borderRadius: 8,
      backgroundColor: colors.surfaceElevated,
      boxShadow: "0px 0px 5px rgba(255, 255, 255, 0.5)",
    },
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
      borderRadius: 0,
      backgroundColor: colors.background,
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
