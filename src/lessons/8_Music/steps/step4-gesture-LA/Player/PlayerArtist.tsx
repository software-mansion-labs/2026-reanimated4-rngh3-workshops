import { StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

import { useAnimationMeta } from "@/lessons/8_Music/shared/animationMeta";
import { colors } from "@/lessons/8_Music/shared/data";

import { usePlayer } from "./PlayerProvider";

export function PlayerArtist() {
  const { state } = usePlayer();
  const { progress } = useAnimationMeta();
  const variantStyle = variantStyles[state.variant];
  const animatedStyle = useAnimatedStyle(() => ({
    fontSize: interpolate(progress.value, [0, 1], [12, 16]),
  }));

  if (!state.currentSong) {
    return null;
  }

  return (
    <Animated.Text style={[variantStyle.text, animatedStyle]} numberOfLines={1}>
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
