import Icon from "@expo/vector-icons/Ionicons";
import { Pressable } from "react-native";
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
        style={sideButton}
      >
        <Icon name="play-skip-back" size={28} color={colors.text} />
      </Pressable>
    </Animated.View>
  );
}

export function PlayerPlayPauseButton() {
  const { state, actions } = usePlayer();
  const variant = useVariant();
  const variantStyle = styles[variant];

  return (
    <Animated.View layout={playerLayout}>
      <Pressable
        hitSlop={12}
        onPress={(event) => stopPress(event, actions.togglePlay)}
        style={variantStyle.button}
      >
        <Icon
          name={state.isPlaying ? "pause" : "play"}
          size={variantStyle.iconSize}
          color={variantStyle.iconColor}
          style={
            variant === "full" && !state.isPlaying ? variantStyle.playIconStyle : undefined
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
        style={sideButton}
      >
        <Icon name="play-skip-forward" size={28} color={colors.text} />
      </Pressable>
    </Animated.View>
  );
}

const sideButton = {
  width: 56,
  height: 56,
  alignItems: "center" as const,
  justifyContent: "center" as const,
};

const styles = {
  mini: {
    button: {
      width: 32,
      height: 32,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },
    iconSize: 18,
    iconColor: colors.text,
    playIconStyle: undefined,
  },
  full: {
    button: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: colors.text,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },
    iconSize: 32,
    iconColor: colors.background,
    playIconStyle: { marginLeft: 2 },
  },
} as const;
