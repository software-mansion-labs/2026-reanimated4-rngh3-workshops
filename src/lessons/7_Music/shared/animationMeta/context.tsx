import { createContext, useContext } from "react";
import type { SharedValue } from "react-native-reanimated";

export type FlipCaptureCallback = () => Promise<void>;

export type AnimationMeta = {
  progress: SharedValue<number>;
  registerFlipCapture?: (callback: FlipCaptureCallback) => () => void;
  captureFlipTargets?: () => Promise<void>;
};

export const AnimationMetaContext = createContext<AnimationMeta | null>(null);

export function useAnimationMeta(): AnimationMeta {
  const meta = useContext(AnimationMetaContext);

  if (!meta) {
    throw new Error(
      "useAnimationMeta must be used within Player.Provider (step 3 onward).",
    );
  }

  return meta;
}
