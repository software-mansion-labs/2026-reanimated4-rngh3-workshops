import { StyleSheet, Text } from "react-native";

import { colors } from "@/lessons/7_Music/shared/data";

import { usePlayer, useVariant } from "./PlayerProvider";

export function PlayerTitle() {
  const { state } = usePlayer();
  const variant = useVariant();
  const variantStyle = variantStyles[variant];

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
