import Icon from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { stopPress, usePlayer, useVariant } from "./PlayerProvider";
import { colors, formatDuration, spacing } from "@/lessons/7_Music/shared/data";

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
      style={header.side}
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
    <View style={header.root}>
      <PlayerCollapseButton />
      <View style={header.center}>
        <Text style={header.label}>PLAYING FROM PLAYLIST</Text>
        <Text style={header.title}>Liked Slops</Text>
      </View>
      <View style={header.side} />
    </View>
  );
}

export function PlayerScrubber() {
  const { state } = usePlayer();
  const variant = useVariant();

  if (variant === "mini" || !state.currentSong) {
    return null;
  }

  return (
    <View style={scrubber.root}>
      <View style={scrubber.track}>
        <View style={scrubber.fill} />
      </View>
      <View style={scrubber.labels}>
        <Text style={scrubber.text}>0:00</Text>
        <Text style={scrubber.text}>{formatDuration(state.currentSong.duration)}</Text>
      </View>
    </View>
  );
}

const header = StyleSheet.create({
  root: {
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

const scrubber = StyleSheet.create({
  root: {
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
