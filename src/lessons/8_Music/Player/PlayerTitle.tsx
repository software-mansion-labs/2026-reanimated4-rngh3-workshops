import { Text } from "react-native";

import { colors } from "@/lessons/8_Music/shared/data";

import { usePlayer } from "./PlayerProvider";

export function PlayerTitle() {
  const { state } = usePlayer();

  if (!state.currentSong) {
    return null;
  }

  return (
    <Text style={styles[state.variant]} numberOfLines={1}>
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
