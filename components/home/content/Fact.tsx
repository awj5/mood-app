import { useContext, useEffect, useState } from "react";
import { Text, View, useColorScheme } from "react-native";
import * as Device from "expo-device";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import {
  Footprints,
  Utensils,
  Droplet,
  Bed,
  HeartHandshake,
  MessageSquare,
  NotebookPen,
  Cloudy,
  Brain,
  Milestone,
  LucideIcon,
} from "lucide-react-native";
import FactsData from "data/facts.json";
import { DimensionsContext, DimensionsContextType } from "context/dimensions";
import { CalendarDatesType, CheckInType, CheckInMoodType } from "types";
import { getTheme } from "utils/helpers";

const iconMap: Record<string, LucideIcon> = {
  Footprints,
  Utensils,
  Droplet,
  Bed,
  HeartHandshake,
  MessageSquare,
  NotebookPen,
  Cloudy,
  Brain,
  Milestone,
};

type FactProps = {
  checkIns: CheckInType[];
  dates: CalendarDatesType;
};

export default function Fact(props: FactProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const opacity = useSharedValue(0);
  const { dimensions } = useContext<DimensionsContextType>(DimensionsContext);
  const [fact, setFact] = useState("");
  const [Icon, setIcon] = useState<React.ElementType>();

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    const tags = !props.dates.rangeStart ? JSON.parse(props.checkIns[props.checkIns.length - 1].mood).tags : [];

    if (props.dates.rangeStart) {
      /// All check-in tags
      for (const checkIn of props.checkIns) {
        const mood: CheckInMoodType = JSON.parse(checkIn.mood);

        for (const tag of mood.tags) {
          if (!tags.includes(tag)) tags.push(tag); // Add tag if not included already
        }
      }
    }

    const randTag = tags[Math.floor(Math.random() * tags.length)]; // Get random tag
    const facts = FactsData.filter((item) => item.tag === randTag); // Facts with random tag

    if (facts.length) {
      const random = facts[Math.floor(Math.random() * facts.length)]; // Random fact
      setFact(random.fact);
      setIcon(iconMap[random.icon]);
    }

    opacity.value = withTiming(1, { duration: 300, easing: Easing.in(Easing.cubic) });
  }, []);

  return (
    <Animated.View
      style={[
        animatedStyles,
        {
          flex: 1,
          aspectRatio: Device.deviceType === 1 ? "4/4" : "4/3",
          backgroundColor: theme.color.invertedOpaqueBg,
          borderRadius: theme.spacing.base,
        },
      ]}
    >
      <View style={{ padding: theme.spacing.base, flex: 1, justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text
            style={{
              fontFamily: "Circular-Bold",
              color: theme.color.inverted,
              fontSize: theme.fontSize.xSmall,
            }}
            allowFontScaling={false}
          >
            DID YOU KNOW?
          </Text>

          {Icon && (
            <Icon
              color={theme.color.inverted}
              size={theme.icon.large.size}
              absoluteStrokeWidth
              strokeWidth={theme.icon.large.stroke}
            />
          )}
        </View>

        <Text
          style={{
            fontFamily: "Circular-Black",
            width: "100.1%", // Hack! - Prevents extra linebreak on iOS if text line is exact width of view
            color: theme.color.inverted,
            fontSize: dimensions.width <= 375 ? theme.fontSize.body : theme.fontSize.large, // Smaller for iPhone SE
            lineHeight: dimensions.width <= 375 ? theme.fontSize.body : theme.fontSize.large, // Smaller for iPhone SE
          }}
          allowFontScaling={false}
        >
          {fact}
        </Text>
      </View>
    </Animated.View>
  );
}
