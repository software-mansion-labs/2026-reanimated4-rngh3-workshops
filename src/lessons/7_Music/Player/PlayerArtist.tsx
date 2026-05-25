import { Text } from "react-native";

import { colors } from "@/lessons/7_Music/shared/data";

import { usePlayer } from "./PlayerProvider";

export function PlayerArtist() {
  const { state } = usePlayer();

  if (!state.currentSong) {
    return null;
  }

  return (
    <Text style={styles[state.variant]} numberOfLines={1}>
      {state.currentSong.artist}
    </Text>
  );
}

const styles = {
  mini: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  full: {
    color: colors.textSecondary,
    fontSize: 16,
  },
} as const;
