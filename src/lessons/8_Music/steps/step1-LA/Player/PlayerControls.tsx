import { type ReactNode } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  FadeIn,
  LayoutAnimationConfig,
} from "react-native-reanimated";

import { spacing } from "@/lessons/8_Music/shared/data";

import { usePlayer } from "./PlayerProvider";

export function PlayerControls({ children }: { children: ReactNode }) {
  const { state } = usePlayer();
  const variantStyle = variantStyles[state.variant];

  return (
    <LayoutAnimationConfig skipEntering>
      <Animated.View
        key={state.variant}
        entering={FadeIn.delay(100).duration(500)}
        style={variantStyle.container}
      >
        {children}
      </Animated.View>
    </LayoutAnimationConfig>
  );
}

const variantStyles = {
  mini: StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
    },
  }),
  full: StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
      paddingVertical: spacing.two,
    },
  }),
};
