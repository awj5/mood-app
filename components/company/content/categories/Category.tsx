import { useContext, useEffect, useState } from "react";
import { View, Text, Pressable, useColorScheme } from "react-native";
import * as Device from "expo-device";
import { useRouter } from "expo-router";
import { TrendingUp, TrendingDown, MoveRight, Eye, Minus } from "lucide-react-native";
import { DimensionsContext, DimensionsContextType } from "context/dimensions";
import Header from "./category/Header";
import { CategoryType } from "../Categories";
import { getSentimentRange, getTheme, pressedDefault } from "utils/helpers";

type CategoryProps = {
  data: CategoryType;
  role: string;
  focused: boolean;
};

export default function Category(props: CategoryProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const { dimensions } = useContext<DimensionsContextType>(DimensionsContext);
  const [score, setScore] = useState(0);
  const parentWidth = dimensions.width >= 768 ? 768 : dimensions.width; // Detect min width
  const focusedUser = props.focused && props.role !== "admin";
  const textBased = props.role === "user" || focusedUser || props.data.pending;

  const Icon = props.data.pending
    ? Minus
    : focusedUser
    ? Eye
    : props.data.trend === "increasing"
    ? TrendingUp
    : props.data.trend === "decreasing"
    ? TrendingDown
    : MoveRight;

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
          backgroundColor: props.focused ? theme.color.invertedOpaqueBg : theme.color.opaqueBg,
          borderRadius: theme.spacing.base,
          padding: theme.spacing.base,
          justifyContent: "space-between",
        },
      ]}
      hitSlop={8}
      disabled={focusedUser || props.data.pending}
    >
      <Header title={props.data.title} icon={props.data.icon} focused={props.focused} />

      <View style={{ gap: theme.spacing.base / (focusedUser ? 2 : 4) }}>
        <Icon
          color={props.focused ? theme.color.inverted : theme.color.primary}
          size={theme.icon.large.size}
          absoluteStrokeWidth
          strokeWidth={theme.icon.large.stroke}
        />

        <View style={{ gap: textBased ? theme.spacing.base / 4 : 0 }}>
          <Text
            style={{
              fontFamily: "Circular-Bold",
              color: props.focused ? theme.color.inverted : theme.color.primary,
              fontSize: textBased ? theme.fontSize.xLarge : theme.fontSize.xxxLarge,
              lineHeight: textBased ? theme.fontSize.xLarge : theme.fontSize.xxxLarge,
            }}
            allowFontScaling={false}
          >
            {props.data.pending
              ? "Low data"
              : focusedUser
              ? "In focus"
              : props.role === "user"
              ? getSentimentRange(props.data.score)
              : `${score}%`}
          </Text>

          <Text
            style={{
              fontFamily: "Circular-Book",
              color: props.focused ? theme.color.invertedOpaque : theme.color.opaque,
              fontSize: theme.fontSize.xxSmall,
            }}
            allowFontScaling={false}
          >
            {props.data.pending ? "TOO FEW CHECK-INS" : props.focused ? "MOOD CHECK ACTIVE" : "SENTIMENT INDEX"}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
