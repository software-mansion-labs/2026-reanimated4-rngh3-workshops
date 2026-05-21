import { type ReactNode } from "react";
import { View } from "react-native";

import { useVariant } from "./PlayerProvider";
import { spacing } from "@/lessons/7_Music/shared/data";

export function PlayerControls({ children }: { children: ReactNode }) {
  const variant = useVariant();

  return <View style={styles[variant]}>{children}</View>;
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
