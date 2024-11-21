import { useContext, useEffect, useRef } from "react";
import { StyleSheet, Pressable } from "react-native";
import { Image } from "expo-image";
import * as Device from "expo-device";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, SharedValue } from "react-native-reanimated";
import { DimensionsContext, DimensionsContextType } from "context/dimensions";

type WheelProps = {
  rotation: SharedValue<number>;
};

export default function Wheel(props: WheelProps) {
  const opacity = useSharedValue(0);
  const previousRotation = useSharedValue(0);
  const startAngle = useSharedValue(0);
  const { dimensions } = useContext<DimensionsContextType>(DimensionsContext);
  const pressRotation = useRef(0);
  const size = Device.deviceType !== 1 ? 448 : 304; // Smaller on phones

  const pressIn = () => {
    pressRotation.current = props.rotation.value;
  };

  const pressOut = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;

    // If angle hasn't changed (not panned)
    if (pressRotation.current === props.rotation.value) {
      const section = size / 5;
      var newAngle: number | undefined;

      switch (true) {
        case locationX < section && locationY < section * 2:
          newAngle = 60; // Chartreuse
          break;
        case locationX < section && locationY < section * 3:
          newAngle = 90; // Green
          break;
        case locationX < section && locationY >= section * 3:
          newAngle = 120; // Spring green
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
          newAngle = 240; // Dark violet
          break;
        case locationX >= section * 4 && locationY >= section * 2:
          newAngle = 270; // Dark magenta
          break;
        case locationX >= section * 4 && locationY >= section:
          newAngle = 300; // Dark rose
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
        const delta = (newAngle - props.rotation.value + 360) % 360;
        const shortestDelta = delta > 180 ? delta - 360 : delta; // Forward or backward
        newAngle = props.rotation.value + shortestDelta;
        previousRotation.value = newAngle;

        // Animate to tapped color
        props.rotation.value = withTiming(
          newAngle,
          { duration: 500, easing: Easing.out(Easing.cubic) },
          (isFinished) => {
            if (isFinished) props.rotation.value = (props.rotation.value + 360) % 360; // Normalize
          }
        );
      }
    }
  };

  const pan = Gesture.Pan()
    .onBegin((e) => {
      if (opacity.value !== 1) {
        return; // Not faded in yet
      }

      const deltaX = e.absoluteX - dimensions.width / 2;
      const deltaY = e.absoluteY - dimensions.height / 2;
      startAngle.value = Math.atan2(deltaY, deltaX) * (180 / Math.PI); // Convert to degrees
    })
    .onUpdate((e) => {
      if (opacity.value !== 1) {
        return; // Not faded in yet
      }

      const deltaX = e.absoluteX - dimensions.width / 2;
      const deltaY = e.absoluteY - dimensions.height / 2;
      const currentAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI); // Convert to degrees
      var newRotation = previousRotation.value + (currentAngle - startAngle.value); // Update the rotation based on the difference between the starting angle and current angle

      // Normalize rotation to be within 0-360 degrees
      if (newRotation < 0) {
        newRotation += 360;
      } else if (newRotation >= 360) {
        newRotation %= 360;
      }

      newRotation = Math.round(newRotation);
      props.rotation.value = newRotation;
    })
    .onEnd(() => {
      if (opacity.value !== 1) {
        return; // Not faded in yet
      }

      previousRotation.value = props.rotation.value;
    });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ rotate: `${props.rotation.value}deg` }],
    opacity: opacity.value,
  }));

  useEffect(() => {
    // Animate in
    const randomAngle = Math.floor(Math.random() * 361);
    previousRotation.value = randomAngle;
    props.rotation.value = withTiming(randomAngle, { duration: 1000, easing: Easing.out(Easing.cubic) });
    pressRotation.current = randomAngle;
    opacity.value = withTiming(1, { duration: 1000, easing: Easing.in(Easing.cubic) });
  }, []);

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[
          animatedStyles,
          styles.wheel,
          {
            width: size + 48, // Padding
            height: size + 48, // Padding
          },
        ]}
      >
        <Pressable onPressIn={pressIn} onPressOut={pressOut} hitSlop={16}>
          <Image source={require("../../assets/img/check-in-wheel.png")} style={styles.image} />
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  wheel: {
    opacity: 0,
    padding: 24,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
