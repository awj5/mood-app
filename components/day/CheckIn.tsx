import { View, useColorScheme } from "react-native";
import Header from "./check-in/Header";
import Feelings from "./check-in/Feelings";
import Note from "./check-in/Note";
import Statement from "./check-in/Statement";
import { CheckInType, CheckInMoodType } from "types";
import { getTheme } from "utils/helpers";

type CheckInProps = {
  data: CheckInType;
  itemHeight: number;
  getCheckIns: () => Promise<void>;
};

export default function CheckIn(props: CheckInProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const mood: CheckInMoodType = JSON.parse(props.data.mood);

  return (
    <View
      style={{
        gap: theme.spacing.base,
        backgroundColor: theme.color.opaqueBg,
        paddingVertical: theme.spacing.base,
        borderRadius: theme.spacing.base,
        height: props.itemHeight,
      }}
    >
      <Header id={props.data.id} mood={mood} date={props.data.date} getCheckIns={props.getCheckIns} />
      <Feelings tags={mood.tags} />
      <Statement mood={mood} />
      <Note text={props.data.note} />
    </View>
  );
}
