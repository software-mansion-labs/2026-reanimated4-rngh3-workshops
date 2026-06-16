import { type ReactNode } from "react";
import { View } from "react-native";

import { spacing } from "@/lessons/8_Music/shared/data";

import { usePlayer } from "./PlayerProvider";

export function PlayerControls({ children }: { children: ReactNode }) {
  const { state } = usePlayer();

  return <View style={styles[state.variant]}>{children}</View>;
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
