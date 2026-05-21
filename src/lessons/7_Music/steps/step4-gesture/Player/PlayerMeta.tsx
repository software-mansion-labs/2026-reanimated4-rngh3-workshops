import { type ReactNode } from "react";
import Animated, { FadeIn, LayoutAnimationConfig } from "react-native-reanimated";

import { useVariant } from "./PlayerProvider";
import { spacing } from "@/lessons/7_Music/shared/data";

export function PlayerMeta({ children }: { children: ReactNode }) {
  const variant = useVariant();

  return (
    <LayoutAnimationConfig skipEntering>
      <Animated.View entering={FadeIn} key={variant} style={styles[variant]}>
        {children}
      </Animated.View>
    </LayoutAnimationConfig>
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
