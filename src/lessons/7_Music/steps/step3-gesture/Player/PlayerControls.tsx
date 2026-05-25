import { type ReactNode } from "react";
import { StyleSheet } from "react-native";
import Animated, { FadeIn, LayoutAnimationConfig } from "react-native-reanimated";

import { spacing } from "@/lessons/7_Music/shared/data";
import { useVariant } from "./PlayerProvider";

export function PlayerControls({ children }: { children: ReactNode }) {
  const variant = useVariant();
  const variantStyle = variantStyles[variant];

  return (
    <LayoutAnimationConfig skipEntering>
      <Animated.View key={variant} entering={FadeIn} style={variantStyle.container}>
        {children}
      </Animated.View>
    </LayoutAnimationConfig>
  );
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
