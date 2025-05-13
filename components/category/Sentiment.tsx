import { useEffect, useState } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import * as Device from "expo-device";
import * as WebBrowser from "expo-web-browser";
import { TrendingUp, TrendingDown, MoveRight, Info } from "lucide-react-native";
import { theme, pressedDefault } from "utils/helpers";

type SentimentProps = {
  score: number;
  trend: string;
  role: string;
};

export default function Sentiment(props: SentimentProps) {
  const colors = theme();
  const [score, setScore] = useState(0);
  const spacing = Device.deviceType !== 1 ? 24 : 16;
  const lowScore = props.score < 40 && props.role === "user" ? true : false;
  const fontSize = Device.deviceType !== 1 ? 16 : 12;
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
        aspectRatio: Device.deviceType !== 1 ? "4/3" : "4/4",
        backgroundColor: colors.opaqueBg,
        borderRadius: spacing,
      }}
    >
      <View style={[styles.wrapper, { padding: spacing }]}>
        <Text
          style={{
            fontFamily: "Circular-Bold",
            color: colors.primary,
            fontSize: fontSize,
          }}
          allowFontScaling={false}
        >
          SENTIMENT INDEX
        </Text>

        <View>
          {!lowScore && (
            <Icon
              color={colors.primary}
              size={Device.deviceType !== 1 ? 40 : 32}
              absoluteStrokeWidth
              strokeWidth={Device.deviceType !== 1 ? 3 : 2.5}
            />
          )}

          <Text
            style={{
              fontFamily: "Circular-Bold",
              color: colors.primary,
              fontSize: Device.deviceType !== 1 ? (lowScore ? 36 : 60) : lowScore ? 28 : 48,
              lineHeight: Device.deviceType !== 1 ? (lowScore ? 40 : 62) : lowScore ? 30 : 50,
            }}
            allowFontScaling={false}
          >
            {lowScore ? "Needs\nattention" : `${score}%`}
          </Text>
        </View>

        <Pressable
          onPress={() => WebBrowser.openBrowserAsync("https://articles.mood.ai/sentiment-index/")}
          style={({ pressed }) => [pressedDefault(pressed), styles.info, { gap: spacing / 4 }]}
          hitSlop={16}
        >
          <Info
            color={colors.opaque}
            size={Device.deviceType !== 1 ? 20 : 16}
            absoluteStrokeWidth
            strokeWidth={Device.deviceType !== 1 ? 1.5 : 1}
          />

          <Text
            style={{
              fontFamily: "Circular-Book",
              color: colors.opaque,
              fontSize: fontSize,
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

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "space-between",
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
  },
});
