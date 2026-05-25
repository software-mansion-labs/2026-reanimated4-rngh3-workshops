import { type ReactNode } from "react";
import { View } from "react-native";

import { spacing } from "@/lessons/7_Music/shared/data";

import { useVariant } from "./PlayerProvider";

export function PlayerMeta({ children }: { children: ReactNode }) {
  const variant = useVariant();

  return <View style={styles[variant]}>{children}</View>;
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
