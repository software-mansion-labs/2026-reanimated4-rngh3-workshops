import Animated from "react-native-reanimated";

import { colors } from "@/lessons/7_Music/shared/data";

import { titleToFullLayout, titleToMiniLayout } from "./layout";
import { usePlayer, useVariant } from "./PlayerProvider";

export function PlayerTitle() {
  const { state } = usePlayer();
  const variant = useVariant();
  const { text, layout } = variantStyles[variant];

  if (!state.currentSong) {
    return null;
  }

  return (
    <Animated.Text layout={layout} style={text} numberOfLines={1}>
      {state.currentSong.title}
    </Animated.Text>
  );
}

const variantStyles = {
  mini: {
    layout: titleToMiniLayout,
    text: {
      color: colors.text,
      fontSize: 22,
      fontWeight: "700" as const,
      transform: [{ scale: 0.64 }],
      transformOrigin: "left bottom",
    },
  },
  full: {
    layout: titleToFullLayout,
    text: {
      color: colors.text,
      fontSize: 22,
      fontWeight: "700" as const,
      transformOrigin: "left bottom",
    },
  },
};
