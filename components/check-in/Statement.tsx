import { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import * as Device from "expo-device";
import Animated, { Easing, SharedValue, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import Slider from "@react-native-community/slider";
import {
  LucideIcon,
  Compass,
  Waves,
  Users,
  Puzzle,
  LifeBuoy,
  HeartHandshake,
  Scale,
  Blend,
  ListChecks,
  Cog,
  Award,
  Gavel,
  HeartPulse,
  Lightbulb,
} from "lucide-react-native";
import tagsData from "data/tags.json";
import guidelinesData from "data/guidelines.json";
import { CompetencyType, MoodType } from "app/check-in";
import { getStoredVal, shuffleArray, getMostCommon } from "utils/helpers";

type CategoryType = {
  title: string;
  icon: LucideIcon;
};

type StatementProps = {
  mood: MoodType;
  color: string;
  sliderVal: SharedValue<number>;
  competency: CompetencyType;
  setCompetency: React.Dispatch<React.SetStateAction<CompetencyType>>;
  selectedTags: number[];
  categories: number[];
  focusedCategory: number;
  setFocusedCategory: React.Dispatch<React.SetStateAction<number>>;
};

export default function Statement(props: StatementProps) {
  const opacity = useSharedValue(0);
  const [company, setCompany] = useState("");
  const [category, setCategory] = useState<CategoryType>();
  const Icon = category?.icon;
  const margin = Platform.OS === "ios" ? 8 : 0;
  const fontSize = Device.deviceType !== 1 ? 18 : 14;
  const spacing = Device.deviceType !== 1 ? 24 : 16;

  const icons = {
    Compass,
    Waves,
    Users,
    Puzzle,
    LifeBuoy,
    HeartHandshake,
    Scale,
    Blend,
    ListChecks,
    Cog,
    Award,
    Gavel,
    HeartPulse,
    Lightbulb,
  };

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

  const getCompany = async () => {
    const name = await getStoredVal("company-name");
    if (name) setCompany(name);
  };

  const setStatement = async () => {
    let competencies: number[] = [];
    let companyCompetencies: number[] = [];
    const tagTypes = [];
    let companyRandom = false;

    if (props.categories.length) {
      companyCompetencies = guidelinesData[0].competencies
        .filter((item) => props.categories.some((cat) => Math.trunc(item.id) === cat))
        .map((item) => item.id);

      if (props.focusedCategory) {
        const focused = await getStoredVal("focused-statement");

        if (focused && Math.floor(Number(focused)) === props.focusedCategory) {
          const next = Number((Number(focused) + 0.01).toFixed(2));
          const exists = guidelinesData[0].competencies.filter((item) => item.id === next);

          if (exists.length) {
            // Next statement in category
            competencies.push(next);
          } else {
            // Not more statements in category
            props.setFocusedCategory(0); // Prevent statement from being stored
            companyRandom = true;
          }
        } else {
          // Start category
          competencies.push(props.focusedCategory + 0.01);
        }
      }
    }

    // Loop selected tags and get competencies
    for (let i = 0; i < props.selectedTags.length; i++) {
      let tag = tagsData.filter((item) => item.id === props.selectedTags[i])[0];
      tagTypes.push(tag.type);

      // Loop competencies
      for (let i = 0; i < tag.competencies.length; i++) {
        const tagCompetency = tag.competencies[i];

        if (
          !props.categories.length ||
          (!props.focusedCategory && companyCompetencies.includes(tagCompetency)) ||
          (companyRandom && companyCompetencies.includes(tagCompetency))
        ) {
          competencies.push(tagCompetency);
        }
      }
    }

    if (!competencies.length && companyCompetencies.length) competencies = companyCompetencies; // All available statements for company
    const primaryTagType = getMostCommon(tagTypes); // Determine if pos or neg statement should be shown
    const shuffled = shuffleArray(competencies);
    const mostFrequent = getMostCommon(shuffled); // Get most common competency in selected tags
    const competency = guidelinesData[0].competencies.filter((item) => item.id === mostFrequent)[0];
    const category = guidelinesData[0].categories.filter((item) => item.id === Math.trunc(competency.id))[0];
    setCategory({ title: category.title.toUpperCase(), icon: icons[category.icon as keyof typeof icons] });

    props.setCompetency({
      id: competency.id,
      statement: primaryTagType === "neg" ? competency.negStatement : competency.posStatement,
      type: primaryTagType,
    });
  };

  useEffect(() => {
    getCompany();
    setStatement();
    opacity.value = withDelay(200, withTiming(1, { duration: 500, easing: Easing.in(Easing.cubic) }));
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity, gap: spacing * 2 }]}>
      <View style={{ gap: spacing / 2, alignItems: "center" }}>
        <View
          style={[
            styles.heading,
            {
              gap: Device.deviceType !== 1 ? 10 : 6,
              backgroundColor: props.color,
              paddingHorizontal: Device.deviceType !== 1 ? 16 : 12,
              height: Device.deviceType !== 1 ? 36 : 28,
            },
          ]}
        >
          {Icon && (
            <Icon
              color={props.mood.color}
              size={Device.deviceType !== 1 ? 20 : 16}
              absoluteStrokeWidth
              strokeWidth={Device.deviceType !== 1 ? 1.5 : 1}
            />
          )}

          <Text
            style={{
              fontFamily: "Circular-Bold",
              color: props.mood.color,
              fontSize: Device.deviceType !== 1 ? 16 : 12,
            }}
            allowFontScaling={false}
          >
            {category?.title}
          </Text>
        </View>

        <Text
          style={[styles.text, { color: props.color, fontSize: Device.deviceType !== 1 ? 30 : 24 }]}
          allowFontScaling={false}
        >
          At {company ? company : "my company"}, {props.competency.statement}.
        </Text>
      </View>

      <View style={{ gap: spacing / 2 }}>
        <View style={{ justifyContent: "center" }}>
          <View style={styles.sliderTrackWrapper}>
            <View style={[styles.sliderTrack, { marginHorizontal: margin }]}></View>
          </View>

          <Slider
            minimumValue={0}
            maximumValue={1}
            value={0.5}
            onValueChange={(value) => (props.sliderVal.value = Math.round(Number(value) * 100) / 100)}
            minimumTrackTintColor="transparent"
            maximumTrackTintColor="transparent"
            thumbImage={thumbs[props.mood.id as keyof typeof thumbs]}
            style={{ height: 40 }}
          />
        </View>

        <View style={styles.labels}>
          <Text
            style={[
              styles.label,
              {
                color: props.color,
                fontSize: fontSize,
                marginLeft: margin,
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
                fontSize: fontSize,
                textAlign: "right",
                marginRight: margin,
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
    opacity: 0,
  },
  heading: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
  },
  text: {
    fontFamily: "Circular-Book",
    textAlign: "center",
  },
  sliderTrackWrapper: {
    width: "100%",
    position: "absolute",
    height: 34,
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
