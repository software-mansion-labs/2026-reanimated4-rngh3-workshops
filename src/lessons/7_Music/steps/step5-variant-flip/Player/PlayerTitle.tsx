import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated";

import { usePlayer, useVariant } from "./PlayerProvider";
import { colors } from "@/lessons/7_Music/shared/data";

export function PlayerTitle() {
  const { state, meta } = usePlayer();
  const variant = useVariant();
  const animatedStyle = useAnimatedStyle(() => ({
    fontSize: interpolate(meta.progress!.value, [0, 1], [14, 22]),
  }));

  if (!state.currentSong) {
    return null;
  }

  return (
    <Animated.Text
      style={[styles[variant], animatedStyle]}
      numberOfLines={1}
    >
      {state.currentSong.title}
    </Animated.Text>
  );
}

const styles = {
  mini: {
    color: colors.text,
    fontWeight: "600" as const,
  },
  full: {
    color: colors.text,
    fontWeight: "700" as const,
  },
} as const;
