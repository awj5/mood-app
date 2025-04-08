import { useEffect, useState } from "react";
import { StyleSheet, View, Text, Pressable, Alert, Platform, Linking } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Bell, BellRing } from "lucide-react-native";
import { ReminderType } from "components/Reminder";
import { theme, pressedDefault } from "utils/helpers";
import { times, getReminder } from "utils/reminders";

type ReminderProps = {
  reminderVisible: boolean;
  setReminderVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Reminder(props: ReminderProps) {
  const colors = theme();
  const [reminder, setReminder] = useState<ReminderType>();
  const fontSize = Device.deviceType !== 1 ? 20 : 16;

  const openSettings = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:").catch(() => {
        alert("Unable to open app settings.");
      });
    } else {
      Linking.openSettings().catch(() => {
        alert("Unable to open app settings.");
      });
    }
  };

  const press = async () => {
    try {
      const { status, canAskAgain } = await Notifications.getPermissionsAsync();

      if (status === "granted" || canAskAgain) {
        props.setReminderVisible(true); // Notifications allowed or can ask
      } else {
        // Notifications denied
        Alert.alert(
          "Notifications Not Allowed",
          "Please allow MOOD.ai to send notifications in your device Settings.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Settings", onPress: openSettings },
          ]
        );
      }
    } catch (error) {
      console.log(error);
      alert("An unexpected error has occurred.");
    }
  };

  const checkReminder = async () => {
    const current = await getReminder();
    setReminder(current ? current : undefined);
  };

  useEffect(() => {
    checkReminder();
  }, [props.reminderVisible]);

  return (
    <View style={[styles.container, { gap: Device.deviceType !== 1 ? 24 : 16 }]}>
      <Text
        style={{
          color: colors.primary,
          fontFamily: "Circular-Medium",
          fontSize: fontSize,
        }}
        allowFontScaling={false}
      >
        Check-In Reminder
      </Text>

      <Pressable
        onPress={press}
        style={({ pressed }) => [pressedDefault(pressed), styles.button, { gap: Device.deviceType !== 1 ? 10 : 6 }]}
        hitSlop={16}
      >
        {reminder ? (
          <BellRing
            color={colors.link}
            size={Device.deviceType !== 1 ? 28 : 20}
            absoluteStrokeWidth
            strokeWidth={Device.deviceType !== 1 ? 2 : 1.5}
          />
        ) : (
          <Bell
            color={colors.link}
            size={Device.deviceType !== 1 ? 28 : 20}
            absoluteStrokeWidth
            strokeWidth={Device.deviceType !== 1 ? 2 : 1.5}
          />
        )}

        <Text style={{ fontFamily: "Circular-Book", fontSize: fontSize, color: colors.link }} allowFontScaling={false}>
          {reminder ? times.filter((item) => item.value === reminder.time)[0].label : "Set"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
  },
});
