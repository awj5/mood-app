import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { Image } from "expo-image";
import * as Device from "expo-device";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  FadeIn,
  cancelAnimation,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { theme } from "utils/helpers";

type IconProps = {
  generating: boolean;
};

export default function Icon(props: IconProps) {
  const colors = theme();
  const rotation = useSharedValue(0);
  const size = Device.deviceType !== 1 ? 52 : 40;

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value * 360}deg` }],
  }));

  useEffect(() => {
    if (props.generating) {
      rotation.value = withRepeat(withTiming(1, { duration: 700, easing: Easing.linear }), -1, false); // Start
    } else {
      cancelAnimation(rotation); // Stop
    }
  }, [props.generating]);

  return (
    <Animated.View
      style={{ width: size, height: size }}
      entering={FadeIn.duration(300).easing(Easing.in(Easing.cubic))}
    >
      <Animated.View style={animatedStyles}>
        <Image source={require("../../../assets/img/wheel.png")} style={styles.image} />
      </Animated.View>

      {Device.deviceType !== 1 ? (
        <Svg width="52" height="52" viewBox="0 0 52 52" fill={colors.primary} style={styles.eyes}>
          <Path d="M37.375 22.75C37.375 24.5449 36.2837 26 34.9375 26C33.5913 26 32.5 24.5449 32.5 22.75C32.5 20.9551 33.5913 19.5 34.9375 19.5C36.2837 19.5 37.375 20.9551 37.375 22.75Z" />
          <Path d="M19.5 22.75C19.5 24.5449 18.4087 26 17.0625 26C15.7163 26 14.625 24.5449 14.625 22.75C14.625 20.9551 15.7163 19.5 17.0625 19.5C18.4087 19.5 19.5 20.9551 19.5 22.75Z" />
        </Svg>
      ) : (
        <Svg width="40" height="40" viewBox="0 0 40 40" fill={colors.primary} style={styles.eyes}>
          <Path d="M28.75 17.5C28.75 18.8807 27.9105 20 26.875 20C25.8395 20 25 18.8807 25 17.5C25 16.1193 25.8395 15 26.875 15C27.9105 15 28.75 16.1193 28.75 17.5Z" />
          <Path d="M15 17.5C15 18.8807 14.1605 20 13.125 20C12.0895 20 11.25 18.8807 11.25 17.5C11.25 16.1193 12.0895 15 13.125 15C14.1605 15 15 16.1193 15 17.5Z" />
        </Svg>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
  },
  eyes: {
    position: "absolute",
  },
});
