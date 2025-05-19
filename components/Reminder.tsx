import { useEffect, useState } from "react";
import { Modal, View, Text, Pressable, useColorScheme } from "react-native";
import * as Device from "expo-device";
import { X } from "lucide-react-native";
import Select from "components/reminder/Select";
import Set from "./reminder/Set";
import Remove from "./reminder/remove";
import { ReminderType } from "types";
import { pressedDefault, getTheme } from "utils/helpers";
import { getReminder } from "utils/reminders";

type ReminderProps = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Reminder(props: ReminderProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const [showRemove, setShowRemove] = useState(false);

  const [reminder, setReminder] = useState<ReminderType>({
    days: { sun: false, mon: true, tue: true, wed: true, thu: true, fri: true, sat: false },
    time: "17:0",
  }); // Default

  useEffect(() => {
    (async () => {
      // Only fire on open
      if (props.visible) {
        // Get reminder if already set
        const current = await getReminder();
        if (current) setReminder(current);
        setShowRemove(!!current);
      }
    })();
  }, [props.visible]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.visible}
      onRequestClose={() => props.setVisible(false)}
      statusBarTranslucent
    >
      <View
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: Device.deviceType === 1 ? 320 : 448,
            backgroundColor: theme.color.primaryBg,
            borderRadius: theme.spacing,
            padding: theme.spacing,
            gap: theme.spacing,
            shadowColor: "black",
            shadowOffset: { width: 4, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
          }}
        >
          <Pressable
            onPress={() => props.setVisible(false)}
            style={({ pressed }) => [pressedDefault(pressed), { alignSelf: "flex-end" }]}
            hitSlop={16}
          >
            <X
              color={theme.color.link}
              size={theme.icon.base.size}
              absoluteStrokeWidth
              strokeWidth={theme.icon.base.stroke}
            />
          </Pressable>

          <Text
            style={{
              color: theme.color.primary,
              fontSize: theme.fontSize.large,
              fontFamily: "Circular-Bold",
              textAlign: "center",
            }}
            allowFontScaling={false}
          >
            Schedule a daily check-in{"\n"}reminder notification
          </Text>

          <Select reminder={reminder} setReminder={setReminder} />
          <Set reminder={reminder} setVisible={props.setVisible} />
          {showRemove && <Remove setVisible={props.setVisible} />}
        </View>
      </View>
    </Modal>
  );
}
