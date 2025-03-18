import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import * as Device from "expo-device";
import { TrendingUp, TrendingDown, MoveRight } from "lucide-react-native";
import { theme } from "utils/helpers";

type SentimentProps = {
  score: number;
  trend: string;
};

export default function Sentiment(props: SentimentProps) {
  const colors = theme();
  const [score, setScore] = useState(0);
  const spacing = Device.deviceType !== 1 ? 24 : 16;
  const lowScore = props.score < 40 ? true : false;
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
        width: "100%",
        backgroundColor: colors.primary === "white" ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.4)",
        borderRadius: spacing,
        padding: spacing,
        flexDirection: "row",
      }}
    >
      <View style={{ gap: spacing / 2, width: Device.deviceType !== 1 ? "60%" : "50%" }}>
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

        <Text
          style={{
            fontFamily: "Circular-Book",
            color: colors.primary,
            fontSize: fontSize,
          }}
          allowFontScaling={false}
        >
          A sentiment index averages employee responses on psychological safety. Scores below 40% trigger a review,
          alerting the organisation to take urgent action.
        </Text>
      </View>

      <View
        style={{
          width: Device.deviceType !== 1 ? "40%" : "50%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{ width: Device.deviceType !== 1 ? 152 : 120 }}>
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
            {lowScore ? "Under review" : `${score}%`}
          </Text>
        </View>
      </View>
    </View>
  );
}
