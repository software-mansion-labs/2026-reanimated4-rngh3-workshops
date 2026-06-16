import { StyleSheet, Text } from "react-native";

import { colors } from "@/lessons/8_Music/shared/data";

import { usePlayer } from "./PlayerProvider";

export function PlayerArtist() {
  const { state } = usePlayer();
  const variantStyle = variantStyles[state.variant];

  if (!state.currentSong) {
    return null;
  }

  return (
    <Text style={variantStyle.text} numberOfLines={1}>
      {state.currentSong.artist}
    </Text>
  );
}

const variantStyles = {
  mini: StyleSheet.create({
    text: {
      color: colors.textSecondary,
      fontSize: 12,
    },
  }),
  full: StyleSheet.create({
    text: {
      color: colors.textSecondary,
      fontSize: 16,
    },
  }),
};
