import { type ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { spacing } from "@/lessons/7_Music/shared/data";

import { usePlayer } from "./PlayerProvider";

export function PlayerMeta({ children }: { children: ReactNode }) {
  const { state } = usePlayer();
  const variantStyle = variantStyles[state.variant];

  return <View style={variantStyle.container}>{children}</View>;
}

const variantStyles = {
  mini: StyleSheet.create({
    container: {
      flex: 1,
      gap: 2,
    },
  }),
  full: StyleSheet.create({
    container: {
      gap: spacing.one,
      paddingVertical: spacing.two,
    },
  }),
};
