import { Image } from "expo-image";
import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

import { colors } from "@/lessons/7_Music/shared/data";

import { playerLayout } from "./layout";
import { usePlayer, useVariant } from "./PlayerProvider";

const AnimatedImage = Animated.createAnimatedComponent(Image);

export function PlayerArtwork() {
  const { state } = usePlayer();
  const variant = useVariant();
  const variantStyle = variantStyles[variant];

  if (!state.currentSong) {
    return null;
  }

  return (
    <Animated.View layout={playerLayout} style={variantStyle.container}>
      <Animated.View layout={playerLayout} style={variantStyle.artwork}>
        <AnimatedImage
          layout={playerLayout}
          source={state.currentSong.artwork}
          style={fill}
          contentFit="cover"
        />
      </Animated.View>
    </Animated.View>
  );
}

const fill = StyleSheet.absoluteFill;

const variantStyles = {
  mini: StyleSheet.create({
    container: {},
    artwork: {
      width: 48,
      height: 48,
      borderRadius: 4,
      backgroundColor: colors.surface,
      overflow: "hidden",
    },
  }),
  full: StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
    },
    artwork: {
      width: "100%",
      aspectRatio: 1,
      maxWidth: 400,
      alignSelf: "center",
      borderRadius: 8,
      backgroundColor: colors.surface,
      overflow: "hidden",
    },
  }),
};
