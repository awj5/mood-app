import { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import * as Device from "expo-device";
import { useRouter } from "expo-router";
import { TrendingUp, TrendingDown, MoveRight } from "lucide-react-native";
import { DimensionsContext, DimensionsContextType } from "context/dimensions";
import { CategoryType } from "app/category";
import Header from "./category/Header";
import { pressedDefault, theme } from "utils/helpers";

type CategoryProps = {
  data: CategoryType;
};

export default function Category(props: CategoryProps) {
  const colors = theme();
  const router = useRouter();
  const { dimensions } = useContext<DimensionsContextType>(DimensionsContext);
  const [score, setScore] = useState(0);
  const Icon =
    props.data.trend === "increasing" ? TrendingUp : props.data.trend === "decreasing" ? TrendingDown : MoveRight;
  const spacing = Device.deviceType !== 1 ? 24 : 16;
  const parentWidth = dimensions.width >= 768 ? 768 : dimensions.width; // Detect min width
  const lowScore = props.data.score < 40 ? true : false;

  const click = () => {
    router.push({
      pathname: "category",
      params: {
        id: String(props.data.id),
        checkIns: JSON.stringify(props.data.checkIns),
        title: props.data.title,
        icon: props.data.icon.displayName,
        score: props.data.score,
        trend: props.data.trend,
      },
    });
  };

  useEffect(() => {
    let currentScore = 0;
    const step = Math.max(1, Math.ceil(props.data.score / 50));

    // Animate score
    const interval = setInterval(() => {
      currentScore += step;

      if (currentScore >= props.data.score) {
        setScore(props.data.score);
        clearInterval(interval);
      } else {
        setScore(currentScore);
      }
    }, 10);

    return () => clearInterval(interval);
  }, []);

  return (
    <Pressable
      onPress={click}
      style={({ pressed }) => [
        pressedDefault(pressed),
        {
          width: (parentWidth - spacing * 3) / 2, // 2 columns
          aspectRatio: Device.deviceType !== 1 ? "3/2" : "4/4",
          backgroundColor: colors.primary === "white" ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.4)",
          borderRadius: spacing,
          padding: spacing,
          justifyContent: "space-between",
        },
      ]}
      hitSlop={8}
    >
      <Header title={props.data.title} icon={props.data.icon} />

      <View style={{ gap: lowScore ? (Device.deviceType !== 1 ? 6 : 4) : 0 }}>
        {!lowScore && (
          <Icon
            color={colors.primary}
            size={Device.deviceType !== 1 ? 32 : 24}
            absoluteStrokeWidth
            strokeWidth={Device.deviceType !== 1 ? 2.5 : 2}
          />
        )}

        <Text
          style={{
            fontFamily: "Circular-Bold",
            color: colors.primary,
            fontSize: Device.deviceType !== 1 ? (lowScore ? 28 : 48) : lowScore ? 20 : 36,
            lineHeight: Device.deviceType !== 1 ? (lowScore ? 30 : 50) : lowScore ? 22 : 38,
          }}
          allowFontScaling={false}
        >
          {lowScore ? "Under review" : `${score}%`}
        </Text>

        <Text
          style={[
            styles.text,
            {
              color: colors.primary,
              fontSize: Device.deviceType !== 1 ? 14 : 10,
            },
          ]}
          allowFontScaling={false}
        >
          SENTIMENT INDEX
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "Circular-Book",
    opacity: 0.5,
  },
});
