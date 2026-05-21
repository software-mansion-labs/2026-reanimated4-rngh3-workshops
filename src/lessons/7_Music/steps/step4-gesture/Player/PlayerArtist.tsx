import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated";

import { usePlayer, useVariant } from "./PlayerProvider";
import { colors } from "@/lessons/7_Music/shared/data";

export function PlayerArtist() {
  const { state, meta } = usePlayer();
  const variant = useVariant();
  const animatedStyle = useAnimatedStyle(() => ({
    fontSize: interpolate(meta.progress!.value, [0, 1], [12, 16]),
  }));

  if (!state.currentSong) {
    return null;
  }

  return (
    <Animated.Text
      style={[styles[variant], animatedStyle]}
      numberOfLines={1}
    >
      {state.currentSong.artist}
    </Animated.Text>
  );
}

const styles = {
  mini: {
    color: colors.textSecondary,
  },
  full: {
    color: colors.textSecondary,
  },
} as const;
