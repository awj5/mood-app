import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Device from "expo-device";
import Animated, { Easing, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import Slider from "@react-native-community/slider";
import { MoodType } from "app/check-in";
import { theme } from "utils/helpers";

type StatementProps = {
  mood: MoodType;
  text: string;
  color: string;
  setStatementValue: React.Dispatch<React.SetStateAction<number>>;
  statementValue: number;
};

export default function Statement(props: StatementProps) {
  const opacity = useSharedValue(0);
  const colors = theme();

  useEffect(() => {
    opacity.value = withDelay(1000, withTiming(1, { duration: 500, easing: Easing.in(Easing.cubic) }));
    props.setStatementValue(50); // Reset
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Text
        style={[styles.text, { color: props.mood.color, fontSize: Device.deviceType !== 1 ? 30 : 24 }]}
        allowFontScaling={false}
      >
        {props.text}
      </Text>

      <View>
        <Slider
          minimumValue={0}
          maximumValue={100}
          value={props.statementValue}
          onValueChange={props.setStatementValue}
          minimumTrackTintColor={colors.secondary}
          maximumTrackTintColor={colors.secondary}
          thumbTintColor={props.mood.color}
        />

        <View style={styles.labels}>
          <Text
            style={[styles.label, { color: props.color, fontSize: Device.deviceType !== 1 ? 18 : 14 }]}
            allowFontScaling={false}
          >
            Strongly disagree
          </Text>

          <Text
            style={[styles.label, { color: props.color, fontSize: Device.deviceType !== 1 ? 18 : 14 }]}
            allowFontScaling={false}
          >
            Strongly agree
          </Text>
        </View>
      </View>

      <StatusBar style={props.color === "white" ? "light" : "dark"} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 1,
    maxWidth: 448 + 48,
    paddingHorizontal: 24,
    gap: 48,
  },
  text: {
    fontFamily: "Circular-Book",
    textAlign: "center",
  },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontFamily: "Circular-Book",
  },
});
