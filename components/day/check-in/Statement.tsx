import { View, Text } from "react-native";
import * as Device from "expo-device";
import { CheckInMoodType } from "data/database";
import guidelinesData from "data/guidelines.json";
import { theme } from "utils/helpers";

type StatementProps = {
  mood: CheckInMoodType;
};

export default function Statement(props: StatementProps) {
  const colors = theme();

  return (
    <View style={{ gap: Device.deviceType !== 1 ? 8 : 4, paddingHorizontal: Device.deviceType !== 1 ? 24 : 16 }}>
      <Text
        style={{
          fontFamily: "Circular-Bold",
          color: colors.primary,
          fontSize: Device.deviceType !== 1 ? 18 : 14,
        }}
        allowFontScaling={false}
      >
        STATEMENT
      </Text>

      <Text
        style={{ fontFamily: "Circular-Book", color: colors.primary, fontSize: Device.deviceType !== 1 ? 20 : 16 }}
        allowFontScaling={false}
      >
        {guidelinesData[0].competencies.filter((item) => item.id === props.mood.competency)[0].statement}
      </Text>
    </View>
  );
}
