import { View, Text } from "react-native";
import * as Device from "expo-device";
import { CheckInMoodType, CheckInType } from "data/database";
import Header from "./check-in/Header";
import Feelings from "./check-in/Feelings";
import Note from "./check-in/Note";
import { theme } from "utils/helpers";
import { getStatement } from "utils/data";

type CheckInProps = {
  data: CheckInType;
  itemHeight: number;
  getCheckInData: () => Promise<void>;
};

export default function CheckIn(props: CheckInProps) {
  const colors = theme();
  const mood: CheckInMoodType = JSON.parse(props.data.mood);
  const utc = new Date(`${props.data.date}Z`);
  const local = new Date(utc);
  const spacing = Device.deviceType !== 1 ? 24 : 16;

  return (
    <View
      style={{
        padding: spacing,
        paddingBottom: 0,
        height: props.itemHeight,
      }}
    >
      <View
        style={{
          flex: 1,
          gap: spacing,
          backgroundColor: colors.primary === "white" ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.4)",
          paddingVertical: spacing,
          borderRadius: spacing,
        }}
      >
        <Header id={props.data.id} mood={mood} date={local} getCheckInData={props.getCheckInData} />
        <Feelings tags={mood.tags} />

        <Text
          style={{
            fontFamily: "Circular-Book",
            color: colors.primary,
            fontSize: Device.deviceType !== 1 ? 20 : 16,
            paddingHorizontal: spacing,
          }}
          allowFontScaling={false}
        >
          {getStatement(mood.competency, mood.statementResponse, mood.company)}
        </Text>

        <Note text={props.data.note} />
      </View>
    </View>
  );
}
