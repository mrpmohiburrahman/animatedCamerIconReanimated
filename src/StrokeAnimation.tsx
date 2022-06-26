// @ts-nocheck
/* eslint-disable max-len */
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Svg, { Circle, Path } from "react-native-svg";

import CameraIcon from "./CameraIcon";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const StrokeAnimation = () => {
  const progress = useSharedValue(0);

  const [lengthForTop, setLengthForTop] = useState(0);
  const [lengthForBottom, setLengthForBottom] = useState(0);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const refTop = useRef<Path>(null);
  const refBottom = useRef<Path>(null);

  const animatedPropsForBottom = useAnimatedProps(() => ({
    strokeDashoffset:
      lengthForBottom -
      lengthForBottom * Easing.bezierFn(0.37, 0, 0.63, 1)(progress.value),
  }));
  const animatedPropsForTop = useAnimatedProps(() => ({
    strokeDashoffset:
      lengthForTop -
      lengthForTop * Easing.bezierFn(0.37, 0, 0.63, 1)(progress.value),
  }));
  const animatedPropsForCircle = useAnimatedProps(() => ({
    opacity: withSpring(isCameraOn ? 1 : 1, {
      overshootClamping: true,
    }),
  }));
  const toggleCamera = () => setIsCameraOn(!isCameraOn);
  const scaleCamera = useSharedValue(1);
  const animatedStyles = useAnimatedStyle(() => {
    return { transform: [{ scale: scaleCamera.value }] };
  });
  useEffect(() => {
    progress.value = withSpring(isCameraOn ? 0 : 1, {
      overshootClamping: true,
    });
  }, [progress, isCameraOn]);
  return (
    <View style={styles.layer}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          toggleCamera();
          scaleCamera.value = withSpring(isCameraOn ? 1 : 1.5, {
            overshootClamping: true,
          });
        }}>
        <View
          style={{
            justifyContent: "center",
          }}>
          <Animated.View
            style={[
              {
                transform: [{ scale: 1 }],
              },
              animatedStyles,
            ]}>
            <CameraIcon />
          </Animated.View>
          <View
            style={{
              borderColor: "cyan",
              position: "absolute",
            }}>
            <Svg
              width={130}
              height={130}
              viewBox={[-16, -16, 544, 544].join(" ")}>
              <AnimatedPath
                stroke="#C2071E"
                strokeWidth="32"
                d="M346,405L0,0"
                strokeDasharray={lengthForTop} // change here
                animatedProps={animatedPropsForTop}
                ref={refTop}
                onLayout={() =>
                  setLengthForTop(refTop.current!.getTotalLength())
                }
              />
              <AnimatedCircle
                animatedProps={animatedPropsForCircle}
                cx="352"
                cy="412"
                r="16"
                fill="#C2071E"
              />
              <AnimatedPath
                stroke="#C2071E"
                strokeWidth="32"
                d="M360,422L442,512"
                strokeDasharray={lengthForBottom} // change here
                strokeDashoffset={animatedPropsForBottom} // change here
                animatedProps={animatedPropsForBottom}
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
