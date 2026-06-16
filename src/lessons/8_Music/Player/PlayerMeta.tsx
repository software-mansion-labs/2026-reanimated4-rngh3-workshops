import { type ReactNode } from "react";
import { View } from "react-native";

import { spacing } from "@/lessons/8_Music/shared/data";

import { usePlayer } from "./PlayerProvider";

export function PlayerMeta({ children }: { children: ReactNode }) {
  const { state } = usePlayer();

  return <View style={styles[state.variant]}>{children}</View>;
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
