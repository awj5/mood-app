import { StyleSheet, View } from "react-native";
import Animated, { SharedValue, useAnimatedReaction, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { CompetencyType } from "app/check-in";

type BackgroundOverlayProps = {
  color: string;
  sliderVal: SharedValue<number>;
  competency: CompetencyType;
};

export default function BackgroundOverlay(props: BackgroundOverlayProps) {
  const opacity = useSharedValue(0);
  const backgroundColor = useSharedValue("white");

  useAnimatedReaction(
    () => props.sliderVal.value,
    (currentValue, previousValue) => {
      if (currentValue !== previousValue) {
        backgroundColor.value =
          currentValue >= 0.5
            ? props.competency.type === "neg"
              ? "black"
              : "white"
            : props.competency.type === "neg"
            ? "white"
            : "black";

        if (currentValue === 0.5) {
          opacity.value = 0;
        } else if (currentValue < 0.5) {
          opacity.value = 0.5 * (1 - currentValue / 0.5); // Opacity increases as currentValue moves from 0.5 to 0, with a max of 0.5
        } else {
          opacity.value = 0.5 * ((currentValue - 0.5) / 0.5); // Opacity increases as currentValue moves from 0.5 to 1, with a max of 0.5
        }
      }
    }
  );

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
    backgroundColor: backgroundColor.value,
  }));

  return (
    <View style={[styles.container, { backgroundColor: props.color }]}>
      <Animated.View style={[styles.overlay, animatedStyles]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    opacity: 0,
  },
});
