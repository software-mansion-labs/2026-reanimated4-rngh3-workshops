import { Container } from "@/components/Container";
import { colorShades, layout } from "@/lib/theme";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  GestureDetector,
  useCompetingGestures,
  usePanGesture,
  usePinchGesture,
  useTapGesture,
} from "react-native-gesture-handler";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const FILTER_SIZE = 72;
const FILTER_GAP = 32;
const CAPTURE_BUTTON_SIZE = 80;
const RECORD_INDICATOR_STROKE = 10;
const FILTERS = ["red", "green", "navy", "yellow", "blue"];

interface FilterProps {
  filter: string;
  index: number;
  filterSize: number;
  selected: SharedValue<number>;
}

function Filter(props: FilterProps) {
  const tapGesture = useTapGesture({
    onActivate: () => {
      props.selected.value = withSpring(props.index);
    },
  });

  return (
    <GestureDetector gesture={tapGesture}>
      <View
        style={{
          backgroundColor: props.filter,
          width: props.filterSize,
          height: props.filterSize,
          borderRadius: props.filterSize / 2,
        }}
      />
    </GestureDetector>
  );
}

interface FilterCarouselProps {
  filters: string[];
  selected: SharedValue<number>;
  filterSize: number;
  filterGap: number;
}

export function FilterCarousel(props: FilterCarouselProps) {
  const style = useAnimatedStyle(() => {
    return {
      gap: props.filterGap,
      transform: [
        {
          translateX:
            -props.filterSize / 2 -
            (props.filterSize + props.filterGap) * props.selected.value,
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.carouselBase, style]}>
      {props.filters.map((filter, index) => (
        <Filter
          key={filter}
          filter={filter}
          index={index}
          filterSize={props.filterSize}
          selected={props.selected}
        />
      ))}
    </Animated.View>
  );
}

interface FilterOverlayProps {
  selectedFilter: SharedValue<number>;
}

function FilterOverlay(props: FilterOverlayProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const progress = props.selectedFilter.value % 1;
    return {
      backgroundColor: FILTERS[Math.round(props.selectedFilter.value)],
      opacity: interpolate(progress, [0, 0.5, 1], [0.5, 0, 0.5], "clamp"),
    };
  });

  return <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]} />;
}

interface CaptureButtonProps {
  progress: number;
}

function CaptureButton(props: CaptureButtonProps) {
  const radius = CAPTURE_BUTTON_SIZE / 2;
  const svgRadius = CAPTURE_BUTTON_SIZE / 2 - RECORD_INDICATOR_STROKE * 0.5;
  const circumference = svgRadius * 2 * Math.PI;

  const strokeDashOffset = svgRadius * 2 * Math.PI * (1 - props.progress);

  return (
    <View style={styles.shutterContainer}>
      <View style={styles.shutterButtonBackground} />
      <Svg style={styles.shutterButtonRecordingIndicator}>
        <Circle
          cx={radius}
          cy={radius}
          r={svgRadius}
          stroke={"red"}
          strokeLinecap="round"
          fill={"transparent"}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeWidth={RECORD_INDICATOR_STROKE}
          strokeDashoffset={strokeDashOffset}
        />
      </Svg>
    </View>
  );
}

interface ViewFinderProps {
  cameraType: "front" | "back";
  selectedFilter: SharedValue<number>;
  zoom: SharedValue<number>;
}

function ViewFinder(props: ViewFinderProps) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: props.zoom.value,
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.viewFinder,
        animatedStyle,
        {
          backgroundColor:
            props.cameraType === "back"
              ? colorShades.purple.base
              : colorShades.green.base,
        },
      ]}
    >
      <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
        {props.cameraType === "back" ? "Back Camera" : "Front Camera"}
      </Text>

      <FilterOverlay selectedFilter={props.selectedFilter} />
    </Animated.View>
  );
}

export function CameraGesturesLesson() {
  const [cameraType, setCameraType] = useState<"front" | "back">("back");

  const selectedFilter = useSharedValue(2);
  const zoomLevel = useSharedValue(1);

  const pinchZoom = usePinchGesture({
    onUpdate: (event) => {
      zoomLevel.value = Math.min(
        Math.max(1, event.scaleChange * zoomLevel.value),
        4,
      );
    },
  });

  const cameraSwitch = useTapGesture({
    runOnJS: true,
    numberOfTaps: 2,
    onActivate: () => {
      setCameraType((prev) => (prev === "back" ? "front" : "back"));
    },
  });

  const viewFinderGesture = useCompetingGestures(pinchZoom, cameraSwitch);

  const filterCarouselGesture = usePanGesture({
    onUpdate: (event) => {
      selectedFilter.value -= event.changeX / (FILTER_SIZE + FILTER_GAP);
    },
    onDeactivate: () => {
      const clampedValue = Math.min(
        Math.max(0, Math.round(selectedFilter.value)),
        FILTERS.length - 1,
      );
      selectedFilter.value = withSpring(clampedValue);
    },
  });

  return (
    <Container centered={false}>
      <GestureDetector gesture={viewFinderGesture}>
        <View style={[styles.viewFinderWrapper]}>
          <ViewFinder
            cameraType={cameraType}
            selectedFilter={selectedFilter}
            zoom={zoomLevel}
          />
          <Pressable
            style={({ pressed }) => [
              styles.cameraSwitch,
              pressed && { opacity: 0.5 },
            ]}
            onPress={() =>
              setCameraType((prev) => (prev === "back" ? "front" : "back"))
            }
          >
            <Text style={styles.cameraSwitchText}>⇄</Text>
          </Pressable>
        </View>
      </GestureDetector>

      <GestureDetector gesture={filterCarouselGesture}>
        <View style={styles.bottomBar}>
          <FilterCarousel
            filters={FILTERS}
            selected={selectedFilter}
            filterSize={FILTER_SIZE}
            filterGap={FILTER_GAP}
          />
          <CaptureButton progress={0} />
        </View>
      </GestureDetector>
    </Container>
  );
}

const styles = StyleSheet.create({
  viewFinderWrapper: {
    flex: 1,
  },
  viewFinder: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraSwitch: {
    position: "absolute",
    top: layout.spacing,
    right: layout.spacing,
    padding: layout.spacing,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomBar: {
    position: "absolute",
    bottom: 32,
    left: 0,
    right: 0,
  },
  cameraSwitchText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  carouselBase: {
    flexDirection: "row",
    left: "50%",
  },
  shutterContainer: {
    position: "absolute",
    top: 0,
    left: "50%",
    width: CAPTURE_BUTTON_SIZE,
    height: CAPTURE_BUTTON_SIZE,
    transform: [{ translateX: -CAPTURE_BUTTON_SIZE / 2 }],
  },
  shutterButtonBackground: {
    width: CAPTURE_BUTTON_SIZE,
    height: CAPTURE_BUTTON_SIZE,
    borderRadius: CAPTURE_BUTTON_SIZE / 2,
    borderWidth: RECORD_INDICATOR_STROKE,
    borderColor: "white",
    position: "absolute",
  },
  shutterButtonRecordingIndicator: {
    width: CAPTURE_BUTTON_SIZE,
    height: CAPTURE_BUTTON_SIZE,
    position: "absolute",
    left: "50%",
    transform: [
      { translateX: -CAPTURE_BUTTON_SIZE / 2 },
      { rotateZ: "-90deg" },
    ],
  },
});
