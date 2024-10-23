import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Device from "expo-device";
import Animated, { Easing, SharedValue, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { Slider } from "@miblanchard/react-native-slider";
import tagsData from "data/tags.json";
import guidelinesData from "data/guidelines.json";
import { theme } from "utils/helpers";

type StatementProps = {
  text: string;
  color: string;
  statementVal: SharedValue<number>;
  setStatement: React.Dispatch<React.SetStateAction<string>>;
  selectedTags: number[];
};

export default function Statement(props: StatementProps) {
  const opacity = useSharedValue(0);
  const colors = theme();

  const shuffleArray = (array: number[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      let rand = Math.floor(Math.random() * (i + 1));
      [array[i], array[rand]] = [array[rand], array[i]];
    }

    return array;
  };

  useEffect(() => {
    props.statementVal.value = 0.5; // Reset
    const competencies: number[] = [];

    // Loop selected tags and get competencies
    for (let i = 0; i < props.selectedTags.length; i++) {
      let tag = tagsData.filter((item) => item.id === props.selectedTags[i])[0];

      // Loop competencies
      for (let i = 0; i < tag.competencies.length; i++) {
        competencies.push(tag.competencies[i]);
      }
    }

    const shuffled = shuffleArray(competencies);

    // Get most common competency in selected tags
    const mostFrequent = Array.from(new Set(shuffled)).reduce((prev, curr) =>
      shuffled.filter((item) => item === curr).length > shuffled.filter((item) => item === prev).length ? curr : prev
    );

    props.setStatement(guidelinesData[0].competencies.filter((item) => item.id === mostFrequent)[0].statement);
    opacity.value = withDelay(300, withTiming(1, { duration: 500, easing: Easing.in(Easing.cubic) }));
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Text
        style={[styles.text, { color: props.color, fontSize: Device.deviceType !== 1 ? 30 : 24 }]}
        allowFontScaling={false}
      >
        {props.text}
      </Text>

      <View>
        <Slider
          minimumValue={0}
          maximumValue={1}
          value={0.5}
          onValueChange={(value) => (props.statementVal.value = Number(value))}
          minimumTrackTintColor={colors.secondary}
          maximumTrackTintColor={colors.secondary}
          thumbTintColor={colors.secondary}
          thumbStyle={{
            width: Device.deviceType !== 1 ? 28 : 24,
            height: Device.deviceType !== 1 ? 28 : 24,
            borderRadius: 999,
          }}
          trackStyle={{ height: 3 }}
        />

        <View style={styles.labels}>
          <Text
            style={[styles.label, { color: props.color, fontSize: Device.deviceType !== 1 ? 18 : 14 }]}
            allowFontScaling={false}
          >
            Strongly{"\n"}disagree
          </Text>

          <Text
            style={[
              styles.label,
              { color: props.color, fontSize: Device.deviceType !== 1 ? 18 : 14, textAlign: "right" },
            ]}
            allowFontScaling={false}
          >
            Strongly{"\n"}agree
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 2,
    maxWidth: 448 + 48,
    width: "100%",
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
