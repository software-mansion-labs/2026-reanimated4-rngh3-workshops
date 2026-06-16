import { Container } from "@/components/Container";
import { colorShades, layout } from "@/lib/theme";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

const FILTER_SIZE = 72;
const FILTER_GAP = 32;
const CAPTURE_BUTTON_SIZE = 80;
const RECORD_INDICATOR_STROKE = 10;
const FILTERS = ["red", "green", "navy", "yellow", "blue"];

interface FilterCarouselProps {
  filters: string[];
  selected: number;
  filterSize: number;
  filterGap: number;
  setSelected: (index: number) => void;
}

export function FilterCarousel(props: FilterCarouselProps) {
  const style = {
    gap: props.filterGap,
    transform: [
      {
        translateX:
          -props.filterSize / 2 -
          (props.filterSize + props.filterGap) * props.selected,
      },
    ],
  };

  return (
    <View style={[styles.carouselBase, style]}>
      {props.filters.map((filter, index) => (
        <Pressable
          onPress={() => props.setSelected(index)}
          key={filter}
          style={{
            backgroundColor: filter,
            width: props.filterSize,
            height: props.filterSize,
            borderRadius: props.filterSize / 2,
          }}
        />
      ))}
    </View>
  );
}

interface FilterOverlayProps {
  selectedFilter: number;
}

function FilterOverlay(props: FilterOverlayProps) {
  const filter = FILTERS[props.selectedFilter];
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: filter, opacity: 0.5 },
      ]}
    />
  );
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
  selectedFilter: number;
}

function ViewFinder(props: ViewFinderProps) {
  return (
    <View
      style={[
        styles.viewFinder,
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
    </View>
  );
}

export function CameraGestures() {
  const [cameraType, setCameraType] = useState<"front" | "back">("back");
  const [selectedFilter, setSelectedFilter] = useState(2);

  return (
    <Container centered={false}>
      <View style={[styles.viewFinderWrapper]}>
        <ViewFinder cameraType={cameraType} selectedFilter={selectedFilter} />
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

      <View style={styles.bottomBar}>
        <FilterCarousel
          filters={FILTERS}
          selected={selectedFilter}
          setSelected={setSelectedFilter}
          filterSize={FILTER_SIZE}
          filterGap={FILTER_GAP}
        />
        <CaptureButton progress={0} />
      </View>
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
