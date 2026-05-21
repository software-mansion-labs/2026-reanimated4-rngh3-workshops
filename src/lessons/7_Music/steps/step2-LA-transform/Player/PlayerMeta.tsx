import { type ReactNode } from "react";
import Animated from "react-native-reanimated";

import { useVariant } from "./PlayerProvider";
import { spacing } from "@/lessons/7_Music/shared/data";

import { playerLayout } from "./layout";

export function PlayerMeta({ children }: { children: ReactNode }) {
  const variant = useVariant();

  return (
    <Animated.View layout={playerLayout} style={styles[variant]}>
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
