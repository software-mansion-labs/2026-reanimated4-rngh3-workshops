import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

import { colors } from "@/lessons/8_Music/shared/data";

import { playerLayout } from "./layout";
import { usePlayer } from "./PlayerProvider";

export function PlayerTitle() {
  const { state } = usePlayer();
  const variantStyle = variantStyles[state.variant];

  if (!state.currentSong) {
    return null;
  }

  return (
    <Animated.Text
      layout={playerLayout}
      style={variantStyle.text}
      numberOfLines={1}
    >
      {state.currentSong.title}
    </Animated.Text>
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
