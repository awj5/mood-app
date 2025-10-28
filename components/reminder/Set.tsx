import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { BellRing } from "lucide-react-native";
import Button from "components/Button";
import { ReminderType } from "types";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

type SetProps = {
  reminder: ReminderType;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Set(props: SetProps) {
  const press = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();

      if (status !== "granted") {
        console.error("Permission not granted");
        return;
      }

      // Set Android notification channel
      if (Platform.OS === "android") {
        try {
          await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
          });
        } catch (error) {
          console.error("Failed to set Android notification channel:", error);
        }
      }

      try {
        await Notifications.cancelAllScheduledNotificationsAsync(); // Clear current notifications
      } catch (error) {
        console.error("Failed to cancel notifications:", error);
      }

      const days = Object.keys(props.reminder.days);

      // Loop days of the week and schedule notifications
      for (let i = 0; i < days.length; i++) {
        if (props.reminder.days[days[i] as keyof ReminderType["days"]]) {
          try {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: "How are you feeling?",
                body: "It's time to check-in.",
                sound: true,
                data: { route: "/check-in" },
              },
              trigger: {
                type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
                weekday: i + 1, // Day of the week (1 = Sunday)
                hour: parseInt(props.reminder.time.split(":")[0]),
                minute: parseInt(props.reminder.time.split(":")[1]),
              },
            });
          } catch (error) {
            console.error(`Failed to schedule notification for day ${i + 1}:`, error);
          }
        }
      }

      props.setVisible(false); // Close
    } catch (error) {
      console.error("Unexpected error setting reminder:", error);
    }
  };

  return (
    <Button func={press} fill icon={BellRing} disabled={!Object.values(props.reminder.days).some(Boolean)} large>
      Set reminder
    </Button>
  );
}
