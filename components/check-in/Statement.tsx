import { useEffect } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import * as Device from "expo-device";
import Animated, { Easing, SharedValue, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import Slider from "@react-native-community/slider";
import tagsData from "data/tags.json";
import guidelinesData from "data/guidelines.json";
import { CompetencyType } from "app/check-in";

type StatementProps = {
  moodID: number;
  color: string;
  sliderVal: SharedValue<number>;
  competency: CompetencyType;
  setCompetency: React.Dispatch<React.SetStateAction<CompetencyType>>;
  selectedTags: number[];
};

export default function Statement(props: StatementProps) {
  const opacity = useSharedValue(0);

  const thumbs = {
    1: require("../../assets/img/slider-thumb/yellow.png"),
    2: require("../../assets/img/slider-thumb/chartreuse.png"),
    3: require("../../assets/img/slider-thumb/green.png"),
    4: require("../../assets/img/slider-thumb/spring-green.png"),
    5: require("../../assets/img/slider-thumb/cyan.png"),
    6: require("../../assets/img/slider-thumb/azure.png"),
    7: require("../../assets/img/slider-thumb/blue.png"),
    8: require("../../assets/img/slider-thumb/dark-violet.png"),
    9: require("../../assets/img/slider-thumb/dark-magenta.png"),
    10: require("../../assets/img/slider-thumb/dark-rose.png"),
    11: require("../../assets/img/slider-thumb/red.png"),
    12: require("../../assets/img/slider-thumb/orange.png"),
  };

  const thumbsTablet = {
    1: require("../../assets/img/slider-thumb/tablet/yellow.png"),
    2: require("../../assets/img/slider-thumb/tablet/chartreuse.png"),
    3: require("../../assets/img/slider-thumb/tablet/green.png"),
    4: require("../../assets/img/slider-thumb/tablet/spring-green.png"),
    5: require("../../assets/img/slider-thumb/tablet/cyan.png"),
    6: require("../../assets/img/slider-thumb/tablet/azure.png"),
    7: require("../../assets/img/slider-thumb/tablet/blue.png"),
    8: require("../../assets/img/slider-thumb/tablet/dark-violet.png"),
    9: require("../../assets/img/slider-thumb/tablet/dark-magenta.png"),
    10: require("../../assets/img/slider-thumb/tablet/dark-rose.png"),
    11: require("../../assets/img/slider-thumb/tablet/red.png"),
    12: require("../../assets/img/slider-thumb/tablet/orange.png"),
  };

  const shuffleArray = (array: number[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      let rand = Math.floor(Math.random() * (i + 1));
      [array[i], array[rand]] = [array[rand], array[i]];
    }

    return array;
  };

  useEffect(() => {
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
        <View style={{ justifyContent: "center" }}>
          <View style={[styles.sliderTrackWrapper, { height: Device.deviceType !== 1 ? 32 : 24 }]}>
            <View style={[styles.sliderTrack, { marginHorizontal: Platform.OS === "ios" ? 8 : 0 }]}></View>
          </View>

          <Slider
            minimumValue={0}
            maximumValue={1}
            value={0.5}
            onValueChange={(value) => (props.sliderVal.value = Math.round(Number(value) * 100) / 100)}
            minimumTrackTintColor="transparent"
            maximumTrackTintColor="transparent"
            thumbImage={
              Device.deviceType !== 1
                ? thumbsTablet[props.moodID as keyof typeof thumbsTablet]
                : thumbs[props.moodID as keyof typeof thumbs]
            }
            style={{ height: 44 }}
          />
        </View>

        <View style={styles.labels}>
          <Text
            style={[
              styles.label,
              {
                color: props.color,
                fontSize: Device.deviceType !== 1 ? 18 : 14,
                marginLeft: Platform.OS === "ios" ? 8 : 0,
              },
            ]}
            allowFontScaling={false}
          >
            Strongly{"\n"}disagree
          </Text>

          <Text
            style={[
              styles.label,
              {
                color: props.color,
                fontSize: Device.deviceType !== 1 ? 18 : 14,
                textAlign: "right",
                marginRight: Platform.OS === "ios" ? 8 : 0,
              },
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
  sliderTrackWrapper: {
    width: "100%",
    position: "absolute",
  },
  sliderTrack: {
    backgroundColor: "black",
    opacity: 0.25,
    flex: 1,
    borderRadius: 999,
  },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontFamily: "Circular-Medium",
  },
});
