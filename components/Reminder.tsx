import React, { useState } from "react";
import { Modal, StyleSheet, View, Text, Pressable, Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Animated, { FadeIn } from "react-native-reanimated";
import { CircleX } from "lucide-react-native";
import Button from "components/Button";
import Select from "components/reminder/Select";
import { theme, pressedDefault } from "utils/helpers";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export type ReminderType = {
  days: { sun: boolean; mon: boolean; tue: boolean; wed: boolean; thu: boolean; fri: boolean; sat: boolean };
  time: string;
};

type ReminderProps = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Reminder(props: ReminderProps) {
  const colors = theme();

  const [reminder, setReminder] = useState<ReminderType>({
    days: { sun: false, mon: true, tue: true, wed: true, thu: true, fri: true, sat: false },
    time: "17:0",
  });

  const spacing = Device.deviceType !== 1 ? 24 : 16;

  const press = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();

      if (status !== "granted") {
        console.log("Permission not granted");
        props.setVisible(false); // Close
        return;
      }

      if (Platform.OS === "android") {
        try {
          await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
          });
        } catch (error) {
          console.log(error);
        }
      }

      scheduleNotifications();
    } catch (error) {
      console.log(error);
      alert("An unexpected error has occurred.");
    }
  };

  const scheduleNotifications = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync(); // Remove all existing notifications

      // Loop days of the week and schedule notification
      Object.keys(reminder.days).forEach(async (day, index) => {
        if (reminder.days[day as keyof ReminderType["days"]]) {
          try {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: "How's work?",
                body: "It's time to check-in.",
                sound: true,
                data: { route: "/check-in" },
              },
              trigger: {
                weekday: index + 1, // Day of the week (1 = Sunday)
                hour: parseInt(reminder.time.split(":")[0]),
                minute: parseInt(reminder.time.split(":")[1]),
                repeats: true, // Repeats weekly
              },
            });
          } catch (error) {
            console.log(error);
          }
        }
      });

      props.setVisible(false); // Close
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {props.visible && (
        <Animated.View
          style={[
            styles.bg,
            { backgroundColor: colors.primary === "white" ? "rgba(0, 0, 0, 0.9)" : "rgba(0, 0, 0, 0.8)" },
          ]}
          entering={FadeIn}
        />
      )}

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
                  color: colors.primary,
                  fontSize: Device.deviceType !== 1 ? 24 : 18,
                  padding: spacing,
                  paddingTop: 0,
                },
              ]}
              allowFontScaling={false}
            >
              Schedule a daily check-in{"\n"}reminder notification
            </Text>

            <Select reminder={reminder} setReminder={setReminder} />

            <View style={{ padding: spacing }}>
              <Button
                func={press}
                fill
                icon="bell"
                disabled={
                  !reminder.days.mon &&
                  !reminder.days.tue &&
                  !reminder.days.wed &&
                  !reminder.days.thu &&
                  !reminder.days.fri &&
                  !reminder.days.sat &&
                  !reminder.days.sun
                    ? true
                    : false
                }
              >
                Set reminder
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bg: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  wrapper: {
    shadowColor: "black",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  description: {
    fontFamily: "Circular-Bold",
    textAlign: "center",
  },
});
