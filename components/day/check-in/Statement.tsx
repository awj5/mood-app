import { Text } from "react-native";
import * as Device from "expo-device";
import { CheckInMoodType } from "data/database";
import guidelinesData from "data/guidelines.json";
import { theme } from "utils/helpers";

type StatementProps = {
  mood: CheckInMoodType;
};

export default function Statement(props: StatementProps) {
  const colors = theme();
  var response = "";

  switch (true) {
    case props.mood.statementResponse >= 0.85:
      response = "I strongly agreed % that";
      break;
    case props.mood.statementResponse >= 0.65:
      response = "I agreed % that";
      break;
    case props.mood.statementResponse >= 0.55:
      response = "I somewhat agreed % that";
      break;
    case props.mood.statementResponse >= 0.45:
      response = "I neither agreed nor disagreed % that";
      break;
    case props.mood.statementResponse >= 0.35:
      response = "I somewhat disagreed % that";
      break;
    case props.mood.statementResponse >= 0.15:
      response = "I disagreed % that";
      break;
    default:
      response = "I strongly disagreed % that";
  }

  return (
    <Text
      style={{
        fontFamily: "Circular-Book",
        color: colors.primary,
        fontSize: Device.deviceType !== 1 ? 20 : 16,
        paddingHorizontal: Device.deviceType !== 1 ? 24 : 16,
      }}
      allowFontScaling={false}
    >
      {response.replace("%", `(${Math.round(props.mood.statementResponse * 100)}%)`)}{" "}
      {guidelinesData[0].competencies.filter((item) => item.id === props.mood.competency)[0].response}
    </Text>
  );
}
