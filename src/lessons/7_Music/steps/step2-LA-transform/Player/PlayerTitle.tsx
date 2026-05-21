import Animated from "react-native-reanimated";

import { usePlayer, useVariant } from "./PlayerProvider";
import { colors } from "@/lessons/7_Music/shared/data";

import { playerLayout, titleToFullLayout, titleToMiniLayout } from "./layout";

export function PlayerTitle() {
  const { state } = usePlayer();
  const variant = useVariant();

  if (!state.currentSong) {
    return null;
  }

  return (
    <Animated.Text
      layout={variant === "mini" ? titleToMiniLayout : titleToFullLayout}
      style={styles[variant]}
      numberOfLines={1}
    >
      {state.currentSong.title}
    </Animated.Text>
  );
}

const styles = {
  mini: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "700" as const,
    transform: [{ scale: 0.64 }],
    transformOrigin: "left bottom",
  },
  full: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "700" as const,
    transformOrigin: "left bottom",
  },
} as const;
