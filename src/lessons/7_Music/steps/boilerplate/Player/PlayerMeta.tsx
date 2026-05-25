import { type ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { useVariant } from "./PlayerProvider";
import { spacing } from "@/lessons/7_Music/shared/data";

export function PlayerMeta({ children }: { children: ReactNode }) {
  const variant = useVariant();
  const variantStyle = variantStyles[variant];

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
