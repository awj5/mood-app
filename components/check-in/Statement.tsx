import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Device from "expo-device";
import Animated, { Easing, SharedValue, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { Slider } from "@miblanchard/react-native-slider";
import tagsData from "data/tags.json";
import guidelinesData from "data/guidelines.json";
import { CompetencyType } from "app/check-in";

type StatementProps = {
  moodColor: string;
  color: string;
  sliderVal: SharedValue<number>;
  competency: CompetencyType;
  setCompetency: React.Dispatch<React.SetStateAction<CompetencyType>>;
  selectedTags: number[];
};

export default function Statement(props: StatementProps) {
  const opacity = useSharedValue(0);

  const shuffleArray = (array: number[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      let rand = Math.floor(Math.random() * (i + 1));
      [array[i], array[rand]] = [array[rand], array[i]];
    }

    return array;
  };

  useEffect(() => {
    props.sliderVal.value = 0.5; // Reset
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

    props.setCompetency(guidelinesData[0].competencies.filter((item) => item.id === mostFrequent)[0]);
    opacity.value = withDelay(700, withTiming(1, { duration: 500, easing: Easing.in(Easing.cubic) }));
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Text
        style={[styles.text, { color: props.color, fontSize: Device.deviceType !== 1 ? 30 : 24 }]}
        allowFontScaling={false}
      >
        {props.competency.statement}
      </Text>

      <View style={{ gap: Device.deviceType !== 1 ? 16 : 8 }}>
        <Slider
          minimumValue={0}
          maximumValue={1}
          value={0.5}
          onValueChange={(value) => (props.sliderVal.value = Math.round(Number(value) * 100) / 100)}
          minimumTrackTintColor="black"
          maximumTrackTintColor="transparent"
          thumbTintColor={props.moodColor}
          thumbStyle={{
            width: Device.deviceType !== 1 ? 40 : 32,
            height: Device.deviceType !== 1 ? 40 : 32,
            borderRadius: 999,
            borderWidth: Device.deviceType !== 1 ? 3.5 : 3,
            borderColor: props.color,
          }}
          minimumTrackStyle={{
            width: "100%", // Hack! - Stop squishing of left side
            height: Device.deviceType !== 1 ? 32 : 24,
            borderRadius: 999,
            opacity: 0.25,
          }}
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
    zIndex: 1,
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
    fontFamily: "Circular-Medium",
  },
});
