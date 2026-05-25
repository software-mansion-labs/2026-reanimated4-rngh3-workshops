import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

import { colors } from "@/lessons/7_Music/shared/data";

import { usePlayer, useVariant } from "./PlayerProvider";

export function PlayerArtwork() {
  const { state } = usePlayer();
  const variant = useVariant();
  const variantStyle = variantStyles[variant];

  if (!state.currentSong) {
    return null;
  }

  return (
    <View style={variantStyle.container}>
      <View style={variantStyle.artwork}>
        <Image
          source={state.currentSong.artwork}
          style={fill}
          contentFit="cover"
        />
      </View>
    </View>
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
