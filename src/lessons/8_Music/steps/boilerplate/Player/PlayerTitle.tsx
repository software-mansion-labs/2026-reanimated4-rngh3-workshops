import { StyleSheet, Text } from "react-native";

import { colors } from "@/lessons/8_Music/shared/data";

import { usePlayer } from "./PlayerProvider";

export function PlayerTitle() {
  const { state } = usePlayer();
  const variantStyle = variantStyles[state.variant];

  if (!state.currentSong) {
    return null;
  }

  return (
    <Text style={variantStyle.text} numberOfLines={1}>
      {state.currentSong.title}
    </Text>
  );
}

const variantStyles = {
  mini: StyleSheet.create({
    text: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "600",
    },
  }),
  full: StyleSheet.create({
    text: {
      color: colors.text,
      fontSize: 22,
      fontWeight: "700",
    },
  }),
};
