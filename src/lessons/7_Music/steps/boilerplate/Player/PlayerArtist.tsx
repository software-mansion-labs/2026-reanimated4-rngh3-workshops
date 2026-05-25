import { StyleSheet, Text } from "react-native";

import { usePlayer, useVariant } from "./PlayerProvider";
import { colors } from "@/lessons/7_Music/shared/data";

export function PlayerArtist() {
  const { state } = usePlayer();
  const variant = useVariant();
  const variantStyle = variantStyles[variant];

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
