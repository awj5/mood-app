import { useContext, useEffect, useState } from "react";
import { View, Text, Pressable, useColorScheme } from "react-native";
import * as Device from "expo-device";
import { useRouter } from "expo-router";
import { TrendingUp, TrendingDown, MoveRight } from "lucide-react-native";
import { DimensionsContext, DimensionsContextType } from "context/dimensions";
import { CategoryType } from "app/category";
import Header from "./category/Header";
import { getSentimentRange, getTheme, pressedDefault } from "utils/helpers";

type CategoryProps = {
  data: CategoryType;
  role: string;
};

export default function Category(props: CategoryProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const { dimensions } = useContext<DimensionsContextType>(DimensionsContext);
  const [score, setScore] = useState(0);
  const Icon =
    props.data.trend === "increasing" ? TrendingUp : props.data.trend === "decreasing" ? TrendingDown : MoveRight;
  const parentWidth = dimensions.width >= 768 ? 768 : dimensions.width; // Detect min width

  const press = () => {
    router.push({
      pathname: "category",
      params: {
        id: String(props.data.id),
        checkIns: JSON.stringify(props.data.checkIns),
        title: props.data.title,
        icon: props.data.icon.displayName,
        score: props.data.score,
        trend: props.data.trend,
        role: props.role,
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
      onPress={press}
      style={({ pressed }) => [
        pressedDefault(pressed),
        {
          width: (parentWidth - theme.spacing.base * 3) / 2, // 2 columns
          aspectRatio: Device.deviceType === 1 ? "4/4" : "3/2",
          backgroundColor: theme.color.opaqueBg,
          borderRadius: theme.spacing.base,
          padding: theme.spacing.base,
          justifyContent: "space-between",
          borderWidth: 1,
          borderColor: theme.color.opaqueStroke,
        },
      ]}
      hitSlop={8}
    >
      <Header title={props.data.title} icon={props.data.icon} />

      <View style={{ gap: theme.spacing.base / 4 }}>
        <Icon
          color={theme.color.primary}
          size={theme.icon.large.size}
          absoluteStrokeWidth
          strokeWidth={theme.icon.large.stroke}
        />

        <View style={{ gap: props.role === "user" ? theme.spacing.base / 4 : 0 }}>
          <Text
            style={{
              fontFamily: "Circular-Bold",
              color: theme.color.primary,
              fontSize: props.role === "user" ? theme.fontSize.xLarge : theme.fontSize.xxxLarge,
              lineHeight: props.role === "user" ? theme.fontSize.xLarge : theme.fontSize.xxxLarge,
            }}
            allowFontScaling={false}
          >
            {props.role === "user" ? getSentimentRange(score) : `${score}%`}
          </Text>

          <Text
            style={{
              fontFamily: "Circular-Book",
              color: theme.color.opaque,
              fontSize: theme.fontSize.xxSmall,
            }}
            allowFontScaling={false}
          >
            SENTIMENT INDEX
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
