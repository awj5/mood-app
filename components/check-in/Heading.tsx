import { useContext, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Device from "expo-device";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { Easing, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { DimensionsContext, DimensionsContextType } from "context/dimensions";
import { theme } from "utils/helpers";

type HeadingProps = {
  text: string;
  description?: string;
  delay?: number;
  color?: string;
};

export default function Heading(props: HeadingProps) {
  const opacity = useSharedValue(0);
  const insets = useSafeAreaInsets();
  const colors = theme();
  const { dimensions } = useContext<DimensionsContextType>(DimensionsContext);

  useEffect(() => {
    opacity.value = withDelay(
      props.delay ? props.delay : 0,
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
          zIndex: props.color !== undefined ? 1 : 0,
        },
        dimensions.width > dimensions.height
          ? { paddingRight: Device.deviceType !== 1 ? 224 : 152, paddingBottom: insets.bottom }
          : { paddingBottom: Device.deviceType !== 1 ? 224 : 152 },
      ]}
    >
      <View
        style={{
          alignItems: "center",
          paddingHorizontal: Device.deviceType !== 1 ? 24 : 16,
          gap: Device.deviceType !== 1 ? 12 : 8,
          maxWidth: Device.deviceType !== 1 ? 512 : 320,
        }}
      >
        <Text
          style={[
            styles.text,
            {
              color: props.color !== undefined ? props.color : colors.primary,
              fontSize: Device.deviceType !== 1 ? (dimensions.width > dimensions.height ? 36 : 48) : 30,
            },
          ]}
          allowFontScaling={false}
        >
          {props.text}
        </Text>

        {props.description && (
          <Text
            style={[
              styles.description,
              {
                color: props.color !== undefined ? props.color : colors.primary,
                fontSize: Device.deviceType !== 1 ? 24 : 18,
              },
            ]}
            allowFontScaling={false}
          >
            {props.description}
          </Text>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    justifyContent: "center",
    opacity: 0,
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
    fontFamily: "Circular-Black",
    textAlign: "center",
  },
  description: {
    fontFamily: "Circular-Book",
    textAlign: "center",
  },
});
