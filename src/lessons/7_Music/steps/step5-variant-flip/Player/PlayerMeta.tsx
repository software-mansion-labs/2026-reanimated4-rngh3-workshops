import { type ReactNode } from "react";
import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

import { useVariant } from "./PlayerProvider";
import { useVariantFlip } from "../useVariantFlip";
import { spacing } from "@/lessons/7_Music/shared/data";

export function PlayerMeta({ children }: { children: ReactNode }) {
  const variant = useVariant();
  const variantStyle = variantStyles[variant];
  const { targetRef, flipStyle } = useVariantFlip(variant);

  return (
    <Animated.View
      ref={targetRef}
      collapsable={false}
      style={[variantStyle.container, flipStyle]}
    >
      {children}
    </Animated.View>
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
