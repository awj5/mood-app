import { View, Text, useColorScheme } from "react-native";
import Checkbox from "expo-checkbox";
import { ReminderType } from "types";
import { getTheme } from "utils/helpers";

type DayProps = {
  text: string;
  reminder: ReminderType;
  setReminder: React.Dispatch<React.SetStateAction<ReminderType>>;
};

export default function Day(props: DayProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const isChecked = props.reminder.days[props.text as keyof ReminderType["days"]];

  const toggle = () => {
    props.setReminder((prevReminder) => ({
      ...prevReminder,
      days: {
        ...prevReminder.days,
        [props.text]: !isChecked,
      },
    }));
  };

  return (
    <View style={{ alignItems: "center", gap: theme.spacing.base / 4 }}>
      <Text
        style={{
          color: theme.color.primary,
          fontSize: theme.fontSize.small,
          fontFamily: "Circular-Medium",
          textTransform: "uppercase",
        }}
        allowFontScaling={false}
      >
        {props.text.charAt(0)}
      </Text>

      <Checkbox value={isChecked} onValueChange={toggle} color={theme.color.secondary} hitSlop={8} />
    </View>
  );
}
