import { Text, View, StyleSheet } from "react-native";
import * as Device from "expo-device";
import { TrendingUp, TrendingDown, MoveRight } from "lucide-react-native";
import { theme } from "utils/helpers";

type SentimentProps = {
  score: number;
  trend: string;
};

export default function Sentiment(props: SentimentProps) {
  const colors = theme();
  const spacing = Device.deviceType !== 1 ? 24 : 16;
  const lowScore = props.score < 40 ? true : false;
  const fontSize = Device.deviceType !== 1 ? 16 : 12;
  const Icon = props.trend === "increasing" ? TrendingUp : props.trend === "decreasing" ? TrendingDown : MoveRight;

  return (
    <View
      style={{
        flex: 1,
        aspectRatio: Device.deviceType !== 1 ? "4/3" : "4/4",
        backgroundColor: colors.primary === "white" ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.4)",
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
            {lowScore ? "Under\nreview" : `${props.score}%`}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "space-between",
  },
});
