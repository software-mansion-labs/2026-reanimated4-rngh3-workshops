import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

import { usePlayer, useVariant } from "./PlayerProvider";
import { colors } from "@/lessons/7_Music/shared/data";

import { artistToFullLayout, artistToMiniLayout, playerLayout } from "./layout";

export function PlayerArtist() {
  const { state } = usePlayer();
  const variant = useVariant();
  const variantStyle = variantStyles[variant];

  if (!state.currentSong) {
    return null;
  }

  return (
    <Animated.Text
      layout={variant === "mini" ? artistToMiniLayout : artistToFullLayout}
      style={variantStyle.text}
      numberOfLines={1}
    >
      {state.currentSong.artist}
    </Animated.Text>
  );
}

const variantStyles = {
  mini: StyleSheet.create({
    text: {
      color: colors.textSecondary,
      fontSize: 16,
      transform: [{ scale: 0.75 }],
      transformOrigin: "left top",
    },
  }),
  full: StyleSheet.create({
    text: {
      color: colors.textSecondary,
      fontSize: 16,
      transformOrigin: "left top",
    },
  }),
};
