// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Svg, { Circle, Path } from "react-native-svg";

import CameraIcon from "./CameraIcon";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const StrokeAnimation = () => {
  const progress = useSharedValue(0);
  const scaleCamera = useSharedValue(0);

  const [lengthForTop, setLengthForTop] = useState(0);
  const [lengthForBottom, setLengthForBottom] = useState(0);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const refTop = useRef<Path>(null);
  const refBottom = useRef<Path>(null);

  const animatedProps = {
    forTop: useAnimatedProps(() => ({
      strokeDashoffset: lengthForTop - lengthForTop * progress.value,
    })),
    forBottom: useAnimatedProps(() => ({
      strokeDashoffset: lengthForBottom - lengthForBottom * progress.value,
    })),
  };

  const animatedStyles = {
    camera: useAnimatedStyle(() => {
      return { transform: [{ scale: scaleCamera.value }] };
    }),
  };
  useEffect(() => {
    progress.value = withSpring(isCameraOn ? 0 : 1, {
      overshootClamping: true,
    });
    scaleCamera.value = withSpring(isCameraOn ? 1.5 : 1, {
      overshootClamping: true,
    });
  }, [progress, isCameraOn, scaleCamera]);

  const toggleCamera = () => setIsCameraOn(!isCameraOn);

  return (
    <View style={styles.layer}>
      <TouchableOpacity activeOpacity={1} onPress={toggleCamera}>
        <View style={{ justifyContent: "center" }}>
          {/* Camer Icon */}
          <Animated.View style={animatedStyles.camera}>
            <CameraIcon />
          </Animated.View>
          {/* red line */}
          <View style={{ position: "absolute" }}>
            <Svg
              width={130}
              height={130}
              viewBox={[-16, -16, 544, 544].join(" ")}>
              <AnimatedPath
                stroke="#C2071E"
                strokeWidth="32"
                d="M346,405L0,0"
                strokeDasharray={lengthForTop}
                animatedProps={animatedProps.forTop}
                ref={refTop}
                onLayout={() =>
                  setLengthForTop(refTop.current!.getTotalLength())
                }
              />
              <Circle cx="352" cy="412" r="16" fill="#C2071E" />
              <AnimatedPath
                stroke="#C2071E"
                strokeWidth="32"
                d="M360,422L442,512"
                strokeDasharray={lengthForBottom} // change here
                animatedProps={animatedProps.forBottom}
                ref={refBottom}
                onLayout={() =>
                  setLengthForBottom(refBottom.current!.getTotalLength())
                }
              />
            </Svg>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default StrokeAnimation;

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
