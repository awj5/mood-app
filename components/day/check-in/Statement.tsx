import { View, Text, StyleSheet } from "react-native";
import * as Device from "expo-device";
import { ThumbsUp, ThumbsDown } from "lucide-react-native";
import { CheckInMoodType } from "data/database";
import guidelinesData from "data/guidelines.json";
import { theme } from "utils/helpers";

type StatementProps = {
  mood: CheckInMoodType;
};

export default function Statement(props: StatementProps) {
  const colors = theme();
  const edges = Device.deviceType !== 1 ? 24 : 16;
  const fontSize = Device.deviceType !== 1 ? 18 : 14;
  const gap = Device.deviceType !== 1 ? 6 : 4;
  var response = "";

  switch (true) {
    case props.mood.statementResponse >= 0.9:
      response = "Absolutely agree";
      break;
    case props.mood.statementResponse >= 0.8:
      response = "Strongly agree";
      break;
    case props.mood.statementResponse >= 0.7:
      response = "Agree";
      break;
    case props.mood.statementResponse >= 0.6:
      response = "Somewhat agree";
      break;
    case props.mood.statementResponse >= 0.5:
      response = "Slightly agree";
      break;
    case props.mood.statementResponse >= 0.4:
      response = "Slightly disagree";
      break;
    case props.mood.statementResponse >= 0.3:
      response = "Somewhat disagree";
      break;
    case props.mood.statementResponse >= 0.2:
      response = "Disagree";
      break;
    case props.mood.statementResponse >= 0.1:
      response = "Strongly disagree";
      break;
    default:
      response = "Absolutely disagree";
  }

  return (
    <View style={{ gap: gap, paddingHorizontal: edges }}>
      <View style={styles.title}>
        <Text
          style={{
            fontFamily: "Circular-Bold",
            color: colors.primary,
            fontSize: fontSize,
          }}
          allowFontScaling={false}
        >
          STATEMENT
        </Text>

        <View style={[styles.response, { gap: gap }]}>
          {props.mood.statementResponse >= 0.5 ? (
            <ThumbsUp
              color={colors.primary}
              size={Device.deviceType !== 1 ? 22 : 16}
              absoluteStrokeWidth
              strokeWidth={Device.deviceType !== 1 ? 2 : 1.5}
            />
          ) : (
            <ThumbsDown
              color={colors.primary}
              size={Device.deviceType !== 1 ? 22 : 16}
              absoluteStrokeWidth
              strokeWidth={Device.deviceType !== 1 ? 2 : 1.5}
            />
          )}

          <Text
            style={{
              fontFamily: "Circular-Medium",
              color: colors.primary,
              fontSize: fontSize,
            }}
            allowFontScaling={false}
          >
            {response}
          </Text>
        </View>
      </View>

      <Text
        style={{ fontFamily: "Circular-Book", color: colors.primary, fontSize: Device.deviceType !== 1 ? 20 : 16 }}
        allowFontScaling={false}
      >
        {guidelinesData[0].competencies.filter((item) => item.id === props.mood.competency)[0].statement}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  response: {
    flexDirection: "row",
    alignItems: "center",
  },
});
