import { type ReactNode } from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PlayerVariantProvider, usePlayer } from "./PlayerProvider";
import { colors, MINI_PLAYER_HEIGHT, spacing } from "@/lessons/7_Music/shared/data";

export function PlayerSheet({ children }: { children: ReactNode }) {
  const { state, actions } = usePlayer();
  const insets = useSafeAreaInsets();

  if (!state.currentSong) {
    return null;
  }

  const variant = state.isExpanded ? "full" : "mini";
  const variantStyle = styles[variant];

  return (
    <Pressable
      onPress={variant === "mini" ? actions.expand : undefined}
      style={[
        surface,
        variantStyle.surface,
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
      <View
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
      </View>
    </Pressable>
  );
}

const surface = {
  position: "absolute" as const,
  overflow: "hidden" as const,
};

const styles = {
  mini: {
    surface: {
      borderRadius: 8,
      backgroundColor: colors.surfaceElevated,
      boxShadow: "0px 0px 5px rgba(255, 255, 255, 0.5)",
    },
    inner: {
      flex: 1,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      paddingHorizontal: spacing.two,
      paddingRight: spacing.three,
      gap: spacing.three,
    },
  },
  full: {
    surface: {
      borderRadius: 0,
      backgroundColor: colors.background,
    },
    inner: {
      flex: 1,
      flexDirection: "column" as const,
      paddingHorizontal: spacing.four,
      gap: spacing.three,
    },
  },
} as const;
