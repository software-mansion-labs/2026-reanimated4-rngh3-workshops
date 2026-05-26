import { useEffect, useLayoutEffect, useRef } from "react";
import type { View, ViewStyle } from "react-native";
import {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useAnimationMeta } from "@/lessons/7_Music/shared/animationMeta";

import { type PlayerVariant } from "./Player/PlayerProvider";

const RESET_DURATION_MS = 150;

type Position = {
  x: number;
  y: number;
};

export function useVariantFlip(variant: PlayerVariant) {
  const { registerFlipCapture } = useAnimationMeta();
  const targetRef = useRef<View | null>(null);
  const flipX = useSharedValue(0);
  const flipY = useSharedValue(0);
  const prevVariantRef = useRef<PlayerVariant | undefined>(undefined);
  const firstPositionRef = useRef<Position | null>(null);

  useEffect(() => {
    return registerFlipCapture(() => {
      const node = targetRef.current;

      if (!node) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve) => {
        node.measure((x, y, width, height, pageX, pageY) => {
          firstPositionRef.current = { x: pageX, y: pageY };
          resolve();
        });
      });
    });
  }, [registerFlipCapture]);

  useLayoutEffect(() => {
    const prevVariant = prevVariantRef.current;

    if (prevVariant === undefined) {
      prevVariantRef.current = variant;
      flipX.value = 0;
      flipY.value = 0;
      return;
    }

    if (prevVariant === variant) {
      return;
    }

    const first = firstPositionRef.current;
    const node = targetRef.current;

    if (!node || first === null) {
      prevVariantRef.current = variant;
      flipX.value = 0;
      flipY.value = 0;
      firstPositionRef.current = null;
      return;
    }

    cancelAnimation(flipX);
    cancelAnimation(flipY);

    node.measure((x, y, width, height, pageX, pageY) => {
      flipX.value = first.x - pageX;
      flipY.value = first.y - pageY;

      flipX.value = withTiming(0, { duration: RESET_DURATION_MS });
      flipY.value = withTiming(0, { duration: RESET_DURATION_MS }); // }, RESET_DELAY_MS);
    });

    firstPositionRef.current = null;
    prevVariantRef.current = variant;
  }, [flipX, flipY, variant]);

  const flipStyle = useAnimatedStyle<ViewStyle>(() => ({
    transform: [{ translateX: flipX.value }, { translateY: flipY.value }],
  }));

  return {
    targetRef,
    flipStyle,
  };
}
