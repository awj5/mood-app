import { useEffect, useState } from "react";
import { Text, View, Pressable, useColorScheme } from "react-native";
import * as Device from "expo-device";
import * as WebBrowser from "expo-web-browser";
import { TrendingUp, TrendingDown, MoveRight, Info } from "lucide-react-native";
import { pressedDefault, getTheme, getSentimentRange } from "utils/helpers";

type SentimentProps = {
  score: number;
  trend: string;
  role: string;
};

export default function Sentiment(props: SentimentProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const [score, setScore] = useState(0);
  const Icon = props.trend === "increasing" ? TrendingUp : props.trend === "decreasing" ? TrendingDown : MoveRight;

  useEffect(() => {
    let currentScore = 0;
    const step = Math.max(1, Math.ceil(props.score / 50));

    // Animate score
    const interval = setInterval(() => {
      currentScore += step;

      if (currentScore >= props.score) {
        setScore(props.score);
        clearInterval(interval);
      } else {
        setScore(currentScore);
      }
    }, 10);

    return () => clearInterval(interval);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        aspectRatio: Device.deviceType === 1 ? "4/4" : "4/3",
        backgroundColor: theme.color.opaqueBg,
        borderRadius: theme.spacing.base,
      }}
    >
      <View style={{ padding: theme.spacing.base, flex: 1, justifyContent: "space-between" }}>
        <Text
          style={{
            fontSize: theme.fontSize.xSmall,
            color: theme.color.primary,
            fontFamily: "Circular-Bold",
          }}
          allowFontScaling={false}
        >
          SENTIMENT INDEX
        </Text>

        <View style={{ gap: theme.spacing.base / 4 }}>
          <Icon
            color={theme.color.primary}
            size={theme.icon.large.size}
            absoluteStrokeWidth
            strokeWidth={theme.icon.large.stroke}
          />

          <Text
            style={{
              fontFamily: "Circular-Bold",
              color: theme.color.primary,
              fontSize: props.role === "user" ? theme.fontSize.xLarge : theme.fontSize.xxxLarge,
              lineHeight: props.role === "user" ? theme.fontSize.xLarge : theme.fontSize.xxxLarge,
            }}
            allowFontScaling={false}
          >
            {props.role === "user" ? getSentimentRange(props.score) : `${score}%`}
          </Text>
        </View>

        <Pressable
          onPress={() => WebBrowser.openBrowserAsync("https://articles.mood.ai/sentiment-index/?iab=1")}
          style={({ pressed }) => [
            pressedDefault(pressed),
            { gap: theme.spacing.base / 4, flexDirection: "row", alignItems: "center" },
          ]}
          hitSlop={16}
        >
          <Info
            color={theme.color.opaque}
            size={theme.icon.small.size}
            absoluteStrokeWidth
            strokeWidth={theme.icon.small.stroke}
          />

          <Text
            style={{
              fontFamily: "Circular-Book",
              color: theme.color.opaque,
              fontSize: theme.fontSize.xSmall,
            }}
            allowFontScaling={false}
          >
            Learn more
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
