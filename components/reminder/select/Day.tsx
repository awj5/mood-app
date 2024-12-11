import { StyleSheet, View, Text } from "react-native";
import * as Device from "expo-device";
import Checkbox from "expo-checkbox";
import { ReminderType } from "components/Reminder";
import { theme } from "utils/helpers";

type DayProps = {
  text: string;
  reminder: ReminderType;
  setReminder: React.Dispatch<React.SetStateAction<ReminderType>>;
};

export default function Day(props: DayProps) {
  const colors = theme();
  const isChecked = props.reminder.days[props.text as keyof ReminderType["days"]];

  const toggleDay = () => {
    props.setReminder((prevReminder) => ({
      ...prevReminder,
      days: {
        ...prevReminder.days,
        [props.text]: !isChecked, // Toggle
      },
    }));
  };

  return (
    <View style={{ alignItems: "center", gap: Device.deviceType !== 1 ? 6 : 4 }}>
      <Text
        style={[styles.text, { color: colors.primary, fontSize: Device.deviceType !== 1 ? 18 : 14 }]}
        allowFontScaling={false}
      >
        {props.text.charAt(0)}
      </Text>

      <Checkbox value={isChecked} onValueChange={toggleDay} color={colors.secondary} hitSlop={8} />
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "Circular-Medium",
    textTransform: "uppercase",
  },
});
