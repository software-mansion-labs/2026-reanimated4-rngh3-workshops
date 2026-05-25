import { StyleSheet } from "react-native";
import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated";

import { usePlayer, useVariant } from "./PlayerProvider";
import { colors } from "@/lessons/7_Music/shared/data";

export function PlayerArtist() {
  const { state, meta } = usePlayer();
  const variant = useVariant();
  const variantStyle = variantStyles[variant];
  const animatedStyle = useAnimatedStyle(() => ({
    fontSize: interpolate(meta.progress!.value, [0, 1], [12, 16]),
  }));

  if (!state.currentSong) {
    return null;
  }

  return (
    <Animated.Text
      style={[variantStyle.text, animatedStyle]}
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
    },
  }),
  full: StyleSheet.create({
    text: {
      color: colors.textSecondary,
    },
  }),
};
