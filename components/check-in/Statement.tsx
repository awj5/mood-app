import { useEffect, useState } from "react";
import { Platform, Text, useColorScheme, View } from "react-native";
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import Slider from "@react-native-community/slider";
import tagsData from "data/tags.json";
import competenciesData from "data/competencies.json";
import Category from "./statement/Category";
import { CompetencyType, MoodType } from "app/check-in";
import { getStoredVal, shuffleArray, getMostCommon, getTheme } from "utils/helpers";

type StatementProps = {
  mood: MoodType;
  foreground: string;
  sliderVal: SharedValue<number>;
  competency: CompetencyType;
  setCompetency: React.Dispatch<React.SetStateAction<CompetencyType>>;
  selectedTags: number[];
  categories: number[];
  focusedCategory: number;
  setFocusedCategory: React.Dispatch<React.SetStateAction<number>>;
};

export default function Statement(props: StatementProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const opacity = useSharedValue(0);
  const [company, setCompany] = useState("");
  const [category, setCategory] = useState(0);
  const margin = Platform.OS === "ios" ? 8 : 0; // Used to remove extra horizontal space on iOS

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

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const setStatement = async () => {
    let competencies: number[] = [];

    const companyCompetencies: number[] = props.categories.length
      ? competenciesData[0].competencies
          .filter((item) => props.categories.some((cat) => Math.trunc(item.id) === cat))
          .map((item) => item.id)
      : [];

    const tagTypes = [];
    let companyRandom = false;

    if (props.focusedCategory) {
      const focused = await getStoredVal("focused-statement");

      if (focused && Math.floor(Number(focused)) === props.focusedCategory) {
        // Continue category
        const next = Number((Number(focused) + 0.01).toFixed(2));
        const exists = competenciesData[0].competencies.filter((item) => item.id === next);

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

    // Loop selected tags and get competencies
    for (const tag of props.selectedTags) {
      const tagData = tagsData.filter((item) => item.id === tag)[0];
      tagTypes.push(tagData.type);

      // Loop competencies
      for (const competency of tagData.competencies) {
        if (
          !props.categories.length ||
          (!props.focusedCategory && companyCompetencies.includes(competency)) ||
          (companyRandom && companyCompetencies.includes(competency))
        ) {
          competencies.push(competency);
        }
      }
    }

    if (!competencies.length && companyCompetencies.length) competencies = companyCompetencies; // All available statements for company
    const primaryTagType = getMostCommon(tagTypes); // Determine if pos or neg statement should be shown
    const shuffled = shuffleArray(competencies);
    const mostFrequent = getMostCommon(shuffled); // Get most common competency in selected tags
    const competency = competenciesData[0].competencies.filter((item) => item.id === mostFrequent)[0];
    setCategory(Math.trunc(competency.id));

    props.setCompetency({
      id: competency.id,
      statement: primaryTagType === "neg" ? competency.negStatement : competency.posStatement,
      type: primaryTagType,
    });
  };

  useEffect(() => {
    (async () => {
      const name = await getStoredVal("company-name");
      if (name) setCompany(name);
    })();

    setStatement();
    opacity.value = withDelay(200, withTiming(1, { duration: 500, easing: Easing.in(Easing.cubic) }));
  }, []);

  return (
    <Animated.View
      style={[
        animatedStyles,
        {
          gap: theme.spacing.base * 2,
          position: "absolute",
          zIndex: 1,
          maxWidth: 448 + 48,
          width: "100%",
          paddingHorizontal: theme.spacing.base * 2,
        },
      ]}
    >
      <View style={{ gap: theme.spacing.base / 2, alignItems: "center" }}>
        {category ? <Category id={category} foreground={props.foreground} color={props.mood.color} /> : null}

        <Text
          style={{
            color: props.foreground,
            fontSize: theme.fontSize.xLarge,
            fontFamily: "Circular-Book",
            textAlign: "center",
          }}
          allowFontScaling={false}
        >
          At {company ? company : "my company"}, {props.competency.statement}.
        </Text>
      </View>

      <View style={{ gap: theme.spacing.base / 2 }}>
        <View style={{ justifyContent: "center" }}>
          <View style={{ width: "100%", position: "absolute", height: 34 }}>
            <View
              style={{ marginHorizontal: margin, backgroundColor: "black", opacity: 0.25, flex: 1, borderRadius: 999 }}
            />
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

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: margin }}>
          <Text
            style={{
              fontFamily: "Circular-Medium",
              color: props.foreground,
              fontSize: theme.fontSize.body,
            }}
            allowFontScaling={false}
          >
            Strongly{"\n"}disagree
          </Text>

          <Text
            style={{
              fontFamily: "Circular-Medium",
              color: props.foreground,
              fontSize: theme.fontSize.body,
              textAlign: "right",
            }}
            allowFontScaling={false}
          >
            Strongly{"\n"}agree
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}
