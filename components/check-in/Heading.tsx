import { useContext, useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import * as Device from "expo-device";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { Easing, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { DimensionsContext, DimensionsContextType } from "context/dimensions";
import { theme } from "utils/helpers";

type HeadingProps = {
  text: string;
  color?: string;
  index?: number;
};

export default function Heading(props: HeadingProps) {
  const opacity = useSharedValue(0);
  const insets = useSafeAreaInsets();
  const colors = theme();
  const { dimensions } = useContext<DimensionsContextType>(DimensionsContext);

  useEffect(() => {
    opacity.value = withDelay(
      props.index === undefined ? 1000 : props.index === 1 ? 500 : 0,
      withTiming(1, { duration: 500, easing: Easing.in(Easing.cubic) })
    );
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        dimensions.width > dimensions.height ? styles.landscape : styles.portrait,
        {
          opacity,
          paddingTop: insets.top,
          zIndex: props.index !== undefined ? props.index : 0,
        },
        dimensions.width > dimensions.height
          ? { paddingRight: Device.deviceType !== 1 ? 224 : 152, paddingBottom: insets.bottom }
          : { paddingBottom: Device.deviceType !== 1 ? 224 : 152 },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: props.color !== undefined ? props.color : colors.primary,
            fontSize: Device.deviceType !== 1 ? (dimensions.width > dimensions.height ? 36 : 48) : 30,
            paddingHorizontal: Device.deviceType !== 1 ? 24 : 16,
            maxWidth: Device.deviceType !== 1 ? 512 : 320,
          },
        ]}
        allowFontScaling={false}
      >
        {props.text}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    justifyContent: "center",
  },
  portrait: {
    height: "50%",
    top: 0,
  },
  landscape: {
    height: "100%",
    width: "50%",
    left: 0,
  },
  text: {
    fontFamily: "Circular-Bold",
    textAlign: "center",
  },
});
