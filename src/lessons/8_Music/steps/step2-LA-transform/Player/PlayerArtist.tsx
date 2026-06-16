import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

import { colors } from "@/lessons/8_Music/shared/data";

import { artistToFullLayout, artistToMiniLayout } from "./layout";
import { usePlayer } from "./PlayerProvider";

export function PlayerArtist() {
  const { state } = usePlayer();
  const variantStyle = variantStyles[state.variant];

  if (!state.currentSong) {
    return null;
  }

  return (
    <Animated.Text
      layout={
        state.variant === "mini" ? artistToMiniLayout : artistToFullLayout
      }
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
