import { type ReactNode } from "react";
import Animated, {
  FadeIn,
  LayoutAnimationConfig,
} from "react-native-reanimated";

import { spacing } from "@/lessons/7_Music/shared/data";
import { useVariant } from "./PlayerProvider";

export function PlayerControls({ children }: { children: ReactNode }) {
  const variant = useVariant();

  return (
    <LayoutAnimationConfig skipEntering>
      <Animated.View key={variant} entering={FadeIn} style={styles[variant]}>
        {children}
      </Animated.View>
    </LayoutAnimationConfig>
  );
}

const styles = {
  mini: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
  },
  full: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-evenly" as const,
    paddingVertical: spacing.two,
  },
} as const;
