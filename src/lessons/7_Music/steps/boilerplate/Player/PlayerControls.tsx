import { type ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { spacing } from "@/lessons/7_Music/shared/data";

import { usePlayer } from "./PlayerProvider";

export function PlayerControls({ children }: { children: ReactNode }) {
  const { state } = usePlayer();
  const variantStyle = variantStyles[state.variant];

  return <View style={variantStyle.container}>{children}</View>;
}

const variantStyles = {
  mini: StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
    },
  }),
  full: StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
      paddingVertical: spacing.two,
    },
  }),
};
