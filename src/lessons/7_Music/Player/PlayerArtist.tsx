import { Text } from "react-native";

import { colors } from "@/lessons/7_Music/shared/data";

import { usePlayer, useVariant } from "./PlayerProvider";

export function PlayerArtist() {
  const { state } = usePlayer();
  const variant = useVariant();

  if (!state.currentSong) {
    return null;
  }

  return (
    <Text style={styles[variant]} numberOfLines={1}>
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
