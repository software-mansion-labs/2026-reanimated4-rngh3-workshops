import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

import { colors } from "@/lessons/7_Music/shared/data";

import { playerLayout, titleToFullLayout, titleToMiniLayout } from "./layout";
import { usePlayer, useVariant } from "./PlayerProvider";

export function PlayerTitle() {
  const { state } = usePlayer();
  const variant = useVariant();
  const variantStyle = variantStyles[variant];

  if (!state.currentSong) {
    return null;
  }

  return (
    <Animated.Text
      layout={variant === "mini" ? titleToMiniLayout : titleToFullLayout}
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
      fontSize: 22,
      fontWeight: "700",
      transform: [{ scale: 0.64 }],
      transformOrigin: "left bottom",
    },
  }),
  full: StyleSheet.create({
    text: {
      color: colors.text,
      fontSize: 22,
      fontWeight: "700",
      transformOrigin: "left bottom",
    },
  }),
};
