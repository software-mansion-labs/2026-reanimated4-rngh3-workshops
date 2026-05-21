import Animated from "react-native-reanimated";

import { usePlayer, useVariant } from "./PlayerProvider";
import { colors } from "@/lessons/7_Music/shared/data";

import { playerLayout } from "./layout";

export function PlayerArtist() {
  const { state } = usePlayer();
  const variant = useVariant();

  if (!state.currentSong) {
    return null;
  }

  return (
    <Animated.Text
      layout={playerLayout}
      style={styles[variant]}
      numberOfLines={1}
    >
      {state.currentSong.artist}
    </Animated.Text>
  );
}

const styles = {
  mini: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  full: {
    color: colors.textSecondary,
    fontSize: 16,
  },
} as const;
