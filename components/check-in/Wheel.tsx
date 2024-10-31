import { useContext, useEffect } from "react";
import { StyleSheet } from "react-native";
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
  const size = Device.deviceType !== 1 ? 448 : 304; // Smaller on phones

  const pan = Gesture.Pan()
    .onBegin((e) => {
      const deltaX = e.absoluteX - dimensions.width / 2;
      const deltaY = e.absoluteY - dimensions.height / 2;
      startAngle.value = Math.atan2(deltaY, deltaX) * (180 / Math.PI); // Convert to degrees
    })
    .onUpdate((e) => {
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
    opacity.value = withTiming(1, { duration: 1000, easing: Easing.in(Easing.cubic) });
  }, []);

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[
          animatedStyles,
          {
            width: size,
            height: size,
          },
        ]}
        hitSlop={8}
      >
        <Image source={require("../../assets/img/check-in-wheel.png")} style={styles.image} />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
  },
});
