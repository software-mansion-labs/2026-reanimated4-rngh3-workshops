import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

import { colors } from "@/lessons/7_Music/shared/data";

import { usePlayer, useVariant } from "./PlayerProvider";

export function PlayerArtwork() {
  const { state } = usePlayer();
  const variant = useVariant();

  if (!state.currentSong) {
    return null;
  }

  const variantStyle = styles[variant];

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

const styles = {
  mini: {
    container: undefined,
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
