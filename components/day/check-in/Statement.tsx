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
    case props.mood.statementResponse >= 0.9:
      response = "Absolutely agreed";
      break;
    case props.mood.statementResponse >= 0.8:
      response = "Strongly agreed";
      break;
    case props.mood.statementResponse >= 0.7:
      response = "Agreed";
      break;
    case props.mood.statementResponse >= 0.6:
      response = "Somewhat agreed";
      break;
    case props.mood.statementResponse >= 0.5:
      response = "Slightly agreed";
      break;
    case props.mood.statementResponse >= 0.4:
      response = "Slightly disagreed";
      break;
    case props.mood.statementResponse >= 0.3:
      response = "Somewhat disagreed";
      break;
    case props.mood.statementResponse >= 0.2:
      response = "Disagreed";
      break;
    case props.mood.statementResponse >= 0.1:
      response = "Strongly disagreed";
      break;
    default:
      response = "Absolutely disagreed";
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
      {guidelinesData[0].competencies.filter((item) => item.id === props.mood.competency)[0].statement}
    </Text>
  );
}
