import { StyleSheet } from "react-native";
import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated";

import { usePlayer, useVariant } from "./PlayerProvider";
import { colors } from "@/lessons/7_Music/shared/data";

export function PlayerTitle() {
  const { state, meta } = usePlayer();
  const variant = useVariant();
  const variantStyle = variantStyles[variant];
  const animatedStyle = useAnimatedStyle(() => ({
    fontSize: interpolate(meta.progress!.value, [0, 1], [14, 22]),
  }));

  if (!state.currentSong) {
    return null;
  }

  return (
    <Animated.Text
      style={[variantStyle.text, animatedStyle]}
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
      fontWeight: "600",
    },
  }),
  full: StyleSheet.create({
    text: {
      color: colors.text,
      fontWeight: "700",
    },
  }),
};
