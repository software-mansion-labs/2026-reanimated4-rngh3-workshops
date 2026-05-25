import Icon from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

import {
  stopPress,
  usePlayer,
  useVariant,
} from "./PlayerProvider";
import { colors } from "@/lessons/7_Music/shared/data";

import { playerLayout } from "./layout";

export function PlayerPrevButton() {
  const { actions } = usePlayer();
  const variant = useVariant();

  if (variant === "mini") {
    return null;
  }

  return (
    <Animated.View layout={playerLayout}>
      <Pressable
        hitSlop={12}
        onPress={(event) => stopPress(event, actions.playPrevious)}
        style={styles.sideButton}
      >
        <Icon name="play-skip-back" size={28} color={colors.text} />
      </Pressable>
    </Animated.View>
  );
}

export function PlayerPlayPauseButton() {
  const { state, actions } = usePlayer();
  const variant = useVariant();
  const variantStyle = variantStyles[variant];
  const icon = variantIcon[variant];

  return (
    <Animated.View layout={playerLayout}>
      <Pressable
        hitSlop={12}
        onPress={(event) => stopPress(event, actions.togglePlay)}
        style={variantStyle.button}
      >
        <Icon
          name={state.isPlaying ? "pause" : "play"}
          size={icon.size}
          color={icon.color}
          style={
            variant === "full" && !state.isPlaying ? variantStyle.playIcon : undefined
          }
        />
      </Pressable>
    </Animated.View>
  );
}

export function PlayerNextButton() {
  const { actions } = usePlayer();
  const variant = useVariant();

  if (variant === "mini") {
    return null;
  }

  return (
    <Animated.View layout={playerLayout}>
      <Pressable
        hitSlop={12}
        onPress={(event) => stopPress(event, actions.playNext)}
        style={styles.sideButton}
      >
        <Icon name="play-skip-forward" size={28} color={colors.text} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sideButton: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
});

const variantStyles = {
  mini: StyleSheet.create({
    button: {
      width: 32,
      height: 32,
      alignItems: "center",
      justifyContent: "center",
    },
  }),
  full: StyleSheet.create({
    button: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: colors.text,
      alignItems: "center",
      justifyContent: "center",
    },
    playIcon: {
      marginLeft: 2,
    },
  }),
};

const variantIcon = {
  mini: {
    size: 18,
    color: colors.text,
  },
  full: {
    size: 32,
    color: colors.background,
  },
} as const;
