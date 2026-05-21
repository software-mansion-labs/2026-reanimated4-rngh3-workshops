import Icon from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import {
  stopPress,
  usePlayer,
  useVariant,
} from "./PlayerProvider";
import { colors, formatDuration, spacing } from "@/lessons/7_Music/shared/data";

import { playerLayout } from "./layout";

function PlayerCollapseButton() {
  const { actions } = usePlayer();
  const variant = useVariant();

  if (variant === "mini") {
    return null;
  }

  return (
    <Pressable
      hitSlop={12}
      onPress={(event) => stopPress(event, actions.collapse)}
      style={headerStyles.side}
    >
      <Icon name="chevron-down" size={28} color={colors.text} />
    </Pressable>
  );
}

export function PlayerHeader() {
  const variant = useVariant();

  if (variant === "mini") {
    return null;
  }

  return (
    <Animated.View
      entering={FadeIn.delay(100).duration(500)}
      layout={playerLayout}
      style={headerStyles.header}
    >
      <PlayerCollapseButton />
      <View style={headerStyles.center}>
        <Text style={headerStyles.label}>PLAYING FROM PLAYLIST</Text>
        <Text style={headerStyles.title}>Liked Slops</Text>
      </View>
      <View style={headerStyles.side} />
    </Animated.View>
  );
}

export function PlayerScrubber() {
  const { state } = usePlayer();
  const variant = useVariant();

  if (variant === "mini" || !state.currentSong) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeIn.delay(100).duration(500)}
      layout={playerLayout}
      style={scrubberStyles.scrubber}
    >
      <View style={scrubberStyles.track}>
        <View style={scrubberStyles.fill} />
      </View>
      <View style={scrubberStyles.labels}>
        <Text style={scrubberStyles.text}>0:00</Text>
        <Text style={scrubberStyles.text}>
          {formatDuration(state.currentSong.duration)}
        </Text>
      </View>
    </Animated.View>
  );
}

const headerStyles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  side: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    flex: 1,
    alignItems: "center",
  },
  label: {
    color: colors.textSecondary,
    fontSize: 10,
    letterSpacing: 1,
  },
  title: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
});

const scrubberStyles = StyleSheet.create({
  scrubber: {
    gap: spacing.one,
  },
  track: {
    height: 3,
    backgroundColor: colors.divider,
    borderRadius: 2,
    overflow: "hidden",
  },
  fill: {
    width: "30%",
    height: "100%",
    backgroundColor: colors.text,
  },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    color: colors.textSecondary,
    fontSize: 11,
    fontVariant: ["tabular-nums"],
  },
});
