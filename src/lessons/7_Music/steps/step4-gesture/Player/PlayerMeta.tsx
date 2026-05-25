import { type ReactNode } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  FadeIn,
  LayoutAnimationConfig,
} from "react-native-reanimated";

import { spacing } from "@/lessons/7_Music/shared/data";

import { useVariant } from "./PlayerProvider";

export function PlayerMeta({ children }: { children: ReactNode }) {
  const variant = useVariant();
  const variantStyle = variantStyles[variant];

  return (
    <LayoutAnimationConfig skipEntering>
      <Animated.View
        key={variant}
        entering={FadeIn}
        style={variantStyle.container}
      >
        {children}
      </Animated.View>
    </LayoutAnimationConfig>
  );
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
