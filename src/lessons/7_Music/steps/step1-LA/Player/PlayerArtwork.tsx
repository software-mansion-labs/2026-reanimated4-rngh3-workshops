import { Image } from "expo-image";
import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

import { colors } from "@/lessons/7_Music/shared/data";
import { usePlayer, useVariant } from "./PlayerProvider";

import { playerLayout } from "./layout";

const AnimatedImage = Animated.createAnimatedComponent(Image);

export function PlayerArtwork() {
  const { state } = usePlayer();
  const variant = useVariant();

  if (!state.currentSong) {
    return null;
  }

  const variantStyle = styles[variant];

  return (
    <Animated.View layout={playerLayout} style={variantStyle.container}>
      <Animated.View layout={playerLayout} style={variantStyle.artwork}>
        <AnimatedImage
          source={state.currentSong.artwork}
          layout={playerLayout}
          style={fill}
          contentFit="cover"
        />
      </Animated.View>
    </Animated.View>
  );
}

const fill = StyleSheet.absoluteFill;

const styles = {
  mini: {
    container: {},
    artwork: {
      width: 48,
      height: 48,
      borderRadius: 4,
      backgroundColor: colors.surface,
      overflow: "hidden" as const,
    },
  },
  full: {
    container: {
      flex: 1,
      justifyContent: "center" as const,
    },
    artwork: {
      width: "100%" as const,
      aspectRatio: 1,
      maxWidth: 400,
      alignSelf: "center" as const,
      borderRadius: 8,
      backgroundColor: colors.surface,
      overflow: "hidden" as const,
    },
  },
} as const;
