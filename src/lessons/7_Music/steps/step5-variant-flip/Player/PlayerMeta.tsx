import { type ReactNode } from "react";
import Animated from "react-native-reanimated";

import { useVariant } from "./PlayerProvider";
import { useVariantFlip } from "../useVariantFlip";
import { spacing } from "@/lessons/7_Music/shared/data";

export function PlayerMeta({ children }: { children: ReactNode }) {
  const variant = useVariant();
  const { targetRef, flipStyle } = useVariantFlip(variant);

  return (
    <Animated.View
      ref={targetRef}
      collapsable={false}
      style={[styles[variant], flipStyle]}
    >
      {children}
    </Animated.View>
  );
}

const styles = {
  mini: {
    flex: 1,
    gap: 2,
  },
  full: {
    gap: spacing.one,
    paddingVertical: spacing.two,
  },
} as const;
