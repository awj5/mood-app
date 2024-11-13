import { useContext, useEffect, useState } from "react";
import { StyleSheet, Pressable, Text } from "react-native";
import * as Device from "expo-device";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  Easing,
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { DimensionsContext, DimensionsContextType } from "context/dimensions";
import { pressedDefault } from "utils/helpers";

type DoneProps = {
  color: string;
  sliderVal: SharedValue<number>;
  submitCheckIn: () => void;
};

export default function Done(props: DoneProps) {
  const opacity = useSharedValue(0);
  const insets = useSafeAreaInsets();
  const { dimensions } = useContext<DimensionsContextType>(DimensionsContext);
  const [disabled, setDisabled] = useState(true);

  const press = () => {
    props.submitCheckIn();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  useAnimatedReaction(
    () => props.sliderVal.value,
    () => {
      if (opacity.value === 0.25) {
        opacity.value = withTiming(1, { duration: 300, easing: Easing.in(Easing.cubic) });
        runOnJS(setDisabled)(false);
      }
    }
  );

  useEffect(() => {
    opacity.value = withDelay(1000, withTiming(0.25, { duration: 300, easing: Easing.in(Easing.cubic) }));
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        dimensions.width > dimensions.height ? styles.landscape : styles.portrait,
        {
          opacity,
          paddingBottom: insets.bottom,
        },
        dimensions.width > dimensions.height
          ? { paddingLeft: Device.deviceType !== 1 ? 224 : 152, paddingTop: insets.top }
          : { paddingTop: Device.deviceType !== 1 ? 224 : 152 },
      ]}
    >
      <Pressable
        onPress={press}
        style={({ pressed }) => [
          pressedDefault(pressed),
          {
            borderRadius: 999,
            borderColor: props.color,
            paddingHorizontal: Device.deviceType !== 1 ? 24 : 18,
            paddingVertical: Device.deviceType !== 1 ? 8 : 6,
            borderWidth: Device.deviceType !== 1 ? 3.5 : 3,
          },
        ]}
        hitSlop={8}
        disabled={disabled}
      >
        <Text
          style={{
            fontFamily: "Circular-Book",
            color: props.color,
            fontSize: Device.deviceType !== 1 ? 36 : 30,
            lineHeight: Device.deviceType !== 1 ? 44 : 38,
          }}
          allowFontScaling={false}
        >
          Done
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    justifyContent: "center",
    zIndex: 1,
  },
  portrait: {
    bottom: 0,
    height: "50%",
  },
  landscape: {
    height: "100%",
    width: "50%",
    right: 0,
    alignItems: "center",
  },
});
