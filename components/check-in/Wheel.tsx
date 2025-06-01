import { useContext, useEffect, useRef } from "react";
import { Pressable } from "react-native";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import * as Device from "expo-device";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, SharedValue } from "react-native-reanimated";
import { DimensionsContext, DimensionsContextType } from "context/dimensions";

type WheelProps = {
  rotation: SharedValue<number>;
  longPress: () => void;
  wheelSize: number;
};

export default function Wheel(props: WheelProps) {
  const opacity = useSharedValue(0);
  const previousRotation = useSharedValue(0);
  const startAngle = useSharedValue(0);
  const hasRotated = useSharedValue(false);
  const pressRotationRef = useRef(0);
  const { dimensions } = useContext<DimensionsContextType>(DimensionsContext);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ rotate: `${props.rotation.value}deg` }],
    opacity: opacity.value,
  }));

  const pressIn = () => {
    pressRotationRef.current = props.rotation.value;
  };

  const pressOut = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;

    // If angle hasn't changed (not panned)
    if (pressRotationRef.current === props.rotation.value) {
      const section = props.wheelSize / 5;
      let newAngle: number | undefined;

      switch (true) {
        case locationX < section && locationY < section * 2:
          newAngle = 60; // Lime
          break;
        case locationX < section && locationY < section * 3:
          newAngle = 90; // Green
          break;
        case locationX < section && locationY >= section * 3:
          newAngle = 120; // Mint
          break;
        case locationX < section * 2 && locationY >= section * 4:
          newAngle = 150; // Cyan
          break;
        case locationX < section * 3 && locationY >= section * 4:
          newAngle = 180; // Azure
          break;
        case locationX >= section * 3 && locationY >= section * 4:
          newAngle = 210; // Blue
          break;
        case locationX >= section * 4 && locationY >= section * 3:
          newAngle = 240; // Violet
          break;
        case locationX >= section * 4 && locationY >= section * 2:
          newAngle = 270; // Plum
          break;
        case locationX >= section * 4 && locationY >= section:
          newAngle = 300; // Maroon
          break;
        case locationX >= section * 3 && locationY < section:
          newAngle = 330; // Red
          break;
        case locationX >= section * 2 && locationY < section:
          newAngle = 0; // Orange
          break;
        case locationX >= section && locationY < section:
          newAngle = 30; // Yellow
          break;
        default:
          newAngle = undefined;
      }

      if (newAngle !== undefined) {
        // Calculate the shortest path for rotation
        let delta = newAngle - props.rotation.value;
        if (delta < 0) delta += 360;
        const shortestDelta = delta > 180 ? delta - 360 : delta; // Backward or forward
        newAngle = props.rotation.value + shortestDelta;
        previousRotation.value = newAngle;

        // Animate to tapped color
        props.rotation.value = withTiming(
          newAngle,
          { duration: 500, easing: Easing.out(Easing.cubic) },
          (isFinished) => {
            // Normalize to 0 - 360
            if (isFinished && props.rotation.value < 0) {
              props.rotation.value = props.rotation.value + 360;
            } else if (isFinished && props.rotation.value >= 360) {
              props.rotation.value = props.rotation.value - 360;
            }

            hasRotated.value = true;
          }
        );
      }
    }
  };

  const longPress = () => {
    if (hasRotated.value) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      pressRotationRef.current = 0; // Reset to cancel regular press
      props.longPress();
    }
  };

  const pan = Gesture.Pan()
    .onBegin((e) => {
      if (opacity.value !== 1) return; // Not faded in yet
      const deltaX = e.absoluteX - dimensions.width / 2;
      const deltaY = e.absoluteY - dimensions.height / 2;
      startAngle.value = Math.atan2(deltaY, deltaX) * (180 / Math.PI); // Convert to degrees
    })
    .onUpdate((e) => {
      if (opacity.value !== 1) return; // Not faded in yet
      const deltaX = e.absoluteX - dimensions.width / 2;
      const deltaY = e.absoluteY - dimensions.height / 2;
      const currentAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI); // Convert to degrees
      let newRotation = previousRotation.value + (currentAngle - startAngle.value); // Update the rotation based on the difference between the starting angle and current angle

      // Normalize rotation to be within 0-360 degrees
      if (newRotation < 0) {
        newRotation += 360;
      } else if (newRotation >= 360) {
        newRotation %= 360;
      }

      newRotation = Math.round(newRotation);
      if (Device.deviceType === 1 || Device.deviceType === 2) props.rotation.value = newRotation; // Only on touch devices
    })
    .onEnd(() => {
      if (opacity.value !== 1) return; // Not faded in yet

      if (Device.deviceType === 1 || Device.deviceType === 2) {
        previousRotation.value = props.rotation.value; // Only on touch devices
        hasRotated.value = true;
      }
    });

  useEffect(() => {
    // Animate in
    const randomAngle = Math.floor(Math.random() * 361);
    previousRotation.value = randomAngle;
    props.rotation.value = withTiming(randomAngle, { duration: 1000, easing: Easing.out(Easing.cubic) });
    pressRotationRef.current = randomAngle;
    opacity.value = withTiming(1, { duration: 1000, easing: Easing.in(Easing.cubic) });
  }, []);

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[
          animatedStyles,
          {
            width: props.wheelSize + 48, // Include padding
            height: props.wheelSize + 48, // Include padding
            padding: 24,
          },
        ]}
      >
        <Pressable onPressIn={pressIn} onPressOut={pressOut} onLongPress={longPress} hitSlop={16}>
          <Image source={require("../../assets/img/check-in-wheel.png")} style={{ width: "100%", height: "100%" }} />
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
}
