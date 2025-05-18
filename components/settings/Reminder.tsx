import { useEffect, useState } from "react";
import { View, Text, Pressable, Alert, Platform, Linking, useColorScheme } from "react-native";
import * as Notifications from "expo-notifications";
import { Bell, BellRing } from "lucide-react-native";
import { ReminderType } from "types";
import { pressedDefault, getTheme } from "utils/helpers";
import { times, getReminder } from "utils/reminders";

type ReminderProps = {
  reminderVisible: boolean;
  setReminderVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Reminder(props: ReminderProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const [reminder, setReminder] = useState<ReminderType>();

  const openSettings = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:").catch(() => console.error("Unable to open app settings."));
    } else {
      Linking.openSettings().catch(() => console.error("Unable to open app settings."));
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
      console.error(error);
    }
  };

  useEffect(() => {
    (async () => {
      // Get reminder if already set
      const current = await getReminder();
      setReminder(current ? current : undefined);
    })();
  }, [props.reminderVisible]);

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Text
        style={{
          color: theme.color.primary,
          fontFamily: "Circular-Medium",
          fontSize: theme.fontSize.body,
        }}
        allowFontScaling={false}
      >
        Check-In Reminder
      </Text>

      <Pressable
        onPress={press}
        style={({ pressed }) => [
          pressedDefault(pressed),
          { flexDirection: "row", alignItems: "center", gap: theme.spacing / 3 },
        ]}
        hitSlop={theme.spacing}
      >
        {reminder ? (
          <BellRing
            color={theme.color.link}
            size={theme.icon.base.size}
            absoluteStrokeWidth
            strokeWidth={theme.icon.base.stroke}
          />
        ) : (
          <Bell
            color={theme.color.link}
            size={theme.icon.base.size}
            absoluteStrokeWidth
            strokeWidth={theme.icon.base.stroke}
          />
        )}

        <Text
          style={{ fontFamily: "Circular-Book", fontSize: theme.fontSize.body, color: theme.color.link }}
          allowFontScaling={false}
        >
          {reminder ? times.find((item) => item.value === reminder.time)?.label : "Set"}
        </Text>
      </Pressable>
    </View>
  );
}
