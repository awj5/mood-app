import { useContext, useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import * as Device from "expo-device";
import Animated, { Easing, useSharedValue, withTiming } from "react-native-reanimated";
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
import { CheckInMoodType, CheckInType } from "data/database";
import { DimensionsContext, DimensionsContextType } from "context/dimensions";
import { CalendarDatesType } from "context/home-dates";
import { theme } from "utils/helpers";

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
  dates?: CalendarDatesType;
};

export default function Fact(props: FactProps) {
  const colors = theme();
  const opacity = useSharedValue(0);
  const { dimensions } = useContext<DimensionsContextType>(DimensionsContext);
  const [fact, setFact] = useState("");
  const [Icon, setIcon] = useState<React.ElementType>();
  const spacing = Device.deviceType !== 1 ? 24 : 16;
  const invertedColor = colors.primary === "white" ? "black" : "white";

  useEffect(() => {
    let tags: number[] = [];

    if (props.checkIns && props.dates?.rangeStart) {
      /// All check-in tags
      for (let i = 0; i < props.checkIns.length; i++) {
        let mood: CheckInMoodType = JSON.parse(props.checkIns[i].mood);

        for (let i = 0; i < mood.tags.length; i++) {
          let tag = mood.tags[i];
          if (!tags.includes(tag)) tags.push(tag);
        }
      }
    } else if (props.checkIns) {
      // Latest check-in tags
      const mood: CheckInMoodType = JSON.parse(props.checkIns[props.checkIns.length - 1].mood);
      tags = mood.tags;
    }

    const randTag = tags[Math.floor(Math.random() * tags.length)];
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
      style={{
        flex: 1,
        aspectRatio: Device.deviceType !== 1 ? "4/3" : "4/4",
        backgroundColor: colors.primary !== "white" ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.4)",
        borderRadius: spacing,
        opacity,
      }}
    >
      <View style={[styles.wrapper, { padding: spacing }]}>
        <View>
          <Text
            style={{
              fontFamily: "Circular-Bold",
              color: invertedColor,
              fontSize: Device.deviceType !== 1 ? 16 : 12,
            }}
            allowFontScaling={false}
          >
            DID YOU KNOW?
          </Text>

          {Icon && (
            <Icon
              color={invertedColor}
              size={Device.deviceType !== 1 ? 32 : 24}
              absoluteStrokeWidth
              strokeWidth={Device.deviceType !== 1 ? 2.5 : 2}
              style={[styles.icon, { margin: Device.deviceType !== 1 ? -2.5 : -2 }]}
            />
          )}
        </View>

        <Text
          style={{
            fontFamily: "Circular-Black",
            color: invertedColor,
            fontSize:
              Device.deviceType !== 1
                ? 30
                : dimensions.width <= 375 && fact.length > 50
                ? 16
                : dimensions.width <= 375 || fact.length > 50
                ? 18
                : 20, // Smaller for iPhone SE
            lineHeight:
              Device.deviceType !== 1
                ? 32
                : dimensions.width <= 375 && fact.length > 50
                ? 17
                : dimensions.width <= 375 || fact.length > 50
                ? 19
                : 21, // Smaller for iPhone SE
          }}
          allowFontScaling={false}
        >
          {fact}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "space-between",
  },
  icon: {
    position: "absolute",
    right: 0,
  },
});
