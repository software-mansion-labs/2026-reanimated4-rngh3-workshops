import Animated from "react-native-reanimated";

import { colors } from "@/lessons/7_Music/shared/data";

import { artistToFullLayout, artistToMiniLayout } from "./layout";
import { usePlayer, useVariant } from "./PlayerProvider";

export function PlayerArtist() {
  const { state } = usePlayer();
  const variant = useVariant();
  const { text, layout } = variantStyles[variant];

  if (!state.currentSong) {
    return null;
  }

  return (
    <Animated.Text layout={layout} style={text} numberOfLines={1}>
      {state.currentSong.artist}
    </Animated.Text>
  );
}

const variantStyles = {
  mini: {
    layout: artistToMiniLayout,
    text: {
      color: colors.textSecondary,
      fontSize: 16,
      transform: [{ scale: 0.75 }],
      transformOrigin: "left top",
    },
  },
  full: {
    layout: artistToFullLayout,
    text: {
      color: colors.textSecondary,
      fontSize: 16,
      transformOrigin: "left top",
    },
  },
};
