import { type ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { spacing } from "@/lessons/7_Music/shared/data";

import { useVariant } from "./PlayerProvider";

export function PlayerControls({ children }: { children: ReactNode }) {
  const variant = useVariant();
  const variantStyle = variantStyles[variant];

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
