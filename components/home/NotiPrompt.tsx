import { useState } from "react";
import { Modal, StyleSheet, View, Text, Pressable } from "react-native";
import * as Device from "expo-device";
import { CircleX } from "lucide-react-native";
import { ReminderType } from "components/ReminderSelect";
import Button from "components/Button";
import ReminderSelect from "components/ReminderSelect";
import { theme, pressedDefault } from "utils/helpers";

type NotiPromptProps = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function NotiPrompt(props: NotiPromptProps) {
  const colors = theme();

  const [reminder, setReminder] = useState<ReminderType>({
    days: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false },
    time: 1700,
  });

  const spacing = Device.deviceType !== 1 ? 24 : 16;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.visible}
      onRequestClose={() => props.setVisible(false)}
    >
      <View style={styles.container}>
        <View
          style={[
            styles.wrapper,
            {
              width: Device.deviceType !== 1 ? 448 : 320,
              backgroundColor: colors.primaryBg,
              borderRadius: spacing,
            },
          ]}
        >
          <Pressable
            onPress={() => props.setVisible(false)}
            style={({ pressed }) => [
              pressedDefault(pressed),
              { alignSelf: "flex-end", padding: Device.deviceType !== 1 ? 16 : 12 },
            ]}
            hitSlop={12}
          >
            <CircleX
              color={colors.primary}
              size={Device.deviceType !== 1 ? 32 : 24}
              absoluteStrokeWidth
              strokeWidth={Device.deviceType !== 1 ? 2.25 : 1.75}
            />
          </Pressable>

          <Text
            style={[
              styles.description,
              {
                color: colors.secondary,
                fontSize: Device.deviceType !== 1 ? 20 : 16,
                padding: spacing,
                paddingTop: 0,
              },
            ]}
            allowFontScaling={false}
          >
            Recieve a daily check-in reminder notification by choosing the days and time that best suit your work
            schedule.
          </Text>

          <ReminderSelect reminder={reminder} setReminder={setReminder} />

          <View style={{ padding: spacing }}>
            <Button fill icon="bell">
              Set reminder
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: {
    shadowColor: "black",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  description: {
    fontFamily: "Circular-Book",
    textAlign: "center",
  },
});
