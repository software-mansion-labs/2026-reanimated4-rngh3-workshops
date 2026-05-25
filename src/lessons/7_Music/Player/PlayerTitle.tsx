import { Text } from "react-native";

import { colors } from "@/lessons/7_Music/shared/data";

import { usePlayer, useVariant } from "./PlayerProvider";

export function PlayerTitle() {
  const { state } = usePlayer();
  const variant = useVariant();

  if (!state.currentSong) {
    return null;
  }

  return (
    <Text style={styles[variant]} numberOfLines={1}>
      {state.currentSong.title}
    </Text>
  );
}

const styles = {
  mini: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600" as const,
  },
  full: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "700" as const,
  },
} as const;
