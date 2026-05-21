import { colors } from "@/lib/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import {
  LayoutChangeEvent,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOutDown,
  FadeOutUp,
  LinearTransition,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";

export type StepMeta = {
  label: string;
  component: React.ComponentType;
};

type StepSwitcherProps = {
  steps: StepMeta[];
  initialIndex?: number;
  bottomOffset?: number;
};

const PILL_H = 32;
const PILL_MARGIN = 8;
const VELOCITY_THRESHOLD = 500;

const MONO = Platform.OS === "ios" ? "Menlo" : "monospace";
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const layoutAnimation = LinearTransition.springify();

type PillSide = "left" | "right" | "center";
type ListPosition = "top" | "bottom";

function useDragSwitcher(bottomOffset: number) {
  const pillSpacing = PILL_MARGIN;
  const insets = useSafeAreaInsets();
  const x = useSharedValue(0);
  const y = useSharedValue(-bottomOffset);
  const pillWidth = useSharedValue(0);
  const { width, height } = useWindowDimensions();
  const [pillSide, setPillSide] = useState<PillSide>("center");
  const [listPosition, setListPosition] = useState<ListPosition>("top");

  useAnimatedReaction(
    // is the pill in the upper half of the screen?
    () => height - insets.bottom - bottomOffset + y.value <= height / 2,
    (inUpperHalf, prev) => {
      if (inUpperHalf !== prev) {
        scheduleOnRN(setListPosition, inUpperHalf ? "bottom" : "top");
      }
    },
  );

  const onPillLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const w = e.nativeEvent.layout.width;
      if (pillWidth.value === 0) {
        // center horizontally? TODO: position via props?
        x.value = width / 2 - w / 2;
      } else if (x.value + pillWidth.value / 2 >= width / 2) {
        // Pill is on the right side - re-anchor right edge with the new width
        // so it never clips outside the viewport when the label grows.
        x.value = withSpring(width - w - pillSpacing, {
          damping: 50,
          stiffness: 500,
        });
      }
      pillWidth.value = w;
    },
    [width],
  );

  const pan = Gesture.Pan()
    .onChange((e) => {
      x.value += e.changeX;
      y.value += e.changeY;
    })
    .onEnd((e) => {
      if (pillWidth.value === 0) return;

      // Pill visual center X = translateX + half-width (pill starts at left: 0).
      // A strong velocity overrides the position-based decision.
      const pillCenterX = x.value + pillWidth.value / 2;
      const snapToRight =
        e.velocityX > VELOCITY_THRESHOLD
          ? true
          : e.velocityX < -VELOCITY_THRESHOLD
            ? false
            : pillCenterX >= width / 2;

      // We use layout animations, so changing the state it's enough
      scheduleOnRN(setPillSide, snapToRight ? "right" : "left");

      const leftSnap = pillSpacing;
      const rightSnap = width - pillWidth.value - pillSpacing;

      x.value = withSpring(snapToRight ? rightSnap : leftSnap, {
        velocity: e.velocityX,
        damping: 50,
        stiffness: 500,
      });

      // withDecay lets the pill coast to a stop from the real release velocity.
      // Clamp prevents it flying off-screen vertically. Use decay dear developer.
      const maxUpward = -(
        height -
        insets.top -
        insets.bottom -
        bottomOffset -
        PILL_H -
        pillSpacing * 2
      );
      y.value = withDecay({
        velocity: e.velocityY,
        deceleration: 0.97,
        clamp: [maxUpward, 0],
      });
    });

  const stylez = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }],
  }));

  return { stylez, pan, pillSide, listPosition, onPillLayout };
}

export function StepSwitcher({
  steps,
  initialIndex = 0,
  bottomOffset = 16,
}: StepSwitcherProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [expanded, setExpanded] = useState(false);
  const insets = useSafeAreaInsets();
  const { stylez, pan, pillSide, listPosition, onPillLayout } =
    useDragSwitcher(bottomOffset);

  const ActiveComponent = steps[activeIndex].component;

  const select = useCallback((i: number) => {
    setActiveIndex(i);
    setExpanded(false);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ActiveComponent />

      {/* we don't care about pointer events, because ActiveComponent it's what matters */}
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <View
          style={[styles.anchor, { bottom: insets.bottom + bottomOffset }]}
          pointerEvents="box-none"
        >
          <GestureDetector gesture={pan}>
            <Animated.View
              style={[styles.pill, stylez]}
              layout={layoutAnimation}
              onLayout={onPillLayout}
            >
              {/* Expanded step list */}
              {expanded && (
                <Animated.View
                  style={[
                    styles.list,
                    pillSide === "left"
                      ? styles.listAlignLeft
                      : styles.listAlignRight,
                    listPosition === "top"
                      ? styles.listAbove
                      : styles.listBelow,
                  ]}
                  pointerEvents="auto"
                  entering={
                    listPosition === "top"
                      ? FadeInUp.springify()
                      : FadeInDown.springify()
                  }
                  exiting={
                    listPosition === "top"
                      ? FadeOutUp.springify()
                      : FadeOutDown.springify()
                  }
                >
                  {steps.map((step, i) => (
                    <AnimatedPressable
                      key={step.label}
                      style={[
                        styles.listItem,
                        i === activeIndex && styles.listItemActive,
                      ]}
                      onPress={() => select(i)}
                    >
                      <Text
                        style={[
                          styles.listItemText,
                          i === activeIndex && styles.listItemTextActive,
                        ]}
                      >
                        {step.label}
                      </Text>
                    </AnimatedPressable>
                  ))}
                </Animated.View>
              )}

              <AnimatedPressable
                layout={layoutAnimation}
                style={[styles.pillButton, { backgroundColor: colors.blue }]}
                onPress={() => router.back()}
                hitSlop={8}
              >
                <Ionicons color={"#fff"} name="arrow-back" size={16} />
              </AnimatedPressable>

              <Animated.View
                style={styles.pillContent}
                layout={layoutAnimation}
              >
                <AnimatedPressable
                  layout={layoutAnimation}
                  style={styles.nav}
                  onPress={() => select(Math.max(0, activeIndex - 1))}
                  hitSlop={8}
                >
                  <Ionicons
                    name="chevron-back"
                    style={[styles.arrow, activeIndex === 0 && styles.arrowDim]}
                  />
                </AnimatedPressable>

                <AnimatedPressable
                  layout={layoutAnimation}
                  style={styles.pillCenter}
                  onPress={() => setExpanded((v) => !v)}
                >
                  <Text style={styles.pillLabel} numberOfLines={1}>
                    {steps[activeIndex].label}
                  </Text>
                  <Text style={styles.pillCount}>
                    {activeIndex + 1}/{steps.length}
                  </Text>
                </AnimatedPressable>

                <AnimatedPressable
                  layout={layoutAnimation}
                  style={styles.nav}
                  onPress={() =>
                    select(Math.min(steps.length - 1, activeIndex + 1))
                  }
                  hitSlop={8}
                >
                  <Ionicons
                    name="chevron-forward"
                    style={[
                      styles.arrow,
                      activeIndex === steps.length - 1 && styles.arrowDim,
                    ]}
                  />
                </AnimatedPressable>
              </Animated.View>
            </Animated.View>
          </GestureDetector>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  anchor: {
    position: "absolute",
    left: 0,
    right: 0,
  },
  list: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.75)",
    borderRadius: 12,
    overflow: "hidden",
    padding: 4,
    gap: 2,
    minWidth: 200,
  },
  listAbove: {
    bottom: PILL_H + 6,
  },
  listBelow: {
    top: PILL_H + 6,
  },
  listAlignLeft: {
    left: 0,
  },
  listAlignRight: {
    right: 0,
  },
  listItem: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  listItemActive: {
    backgroundColor: colors.accent,
  },
  listItemText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    fontFamily: MONO,
  },
  listItemTextActive: {
    color: "#fff",
    fontWeight: "700",
  },
  pillContent: {
    height: PILL_H,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.75)",
    borderRadius: PILL_H / 2,
    paddingHorizontal: 4,
    gap: 8,
  },
  pill: {
    flexDirection: "row",
    gap: 8,
    zIndex: 999,
    position: "absolute",
    left: 0,
  },
  pillButton: {
    backgroundColor: "rgba(0,0,0,0.75)",
    height: PILL_H,
    aspectRatio: 1,
    borderRadius: PILL_H / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  nav: {
    height: PILL_H,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  pillCenter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  pillLabel: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    fontFamily: MONO,
    flexShrink: 1,
  },
  pillCount: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 8,
    fontFamily: MONO,
  },
  arrow: {
    color: "#fff",
    fontSize: 10,
  },
  arrowDim: {
    color: "rgba(255,255,255,0.2)",
  },
});
