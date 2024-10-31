import { useCallback, useState, useRef } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Image } from "expo-image";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import * as Device from "expo-device";
import { CheckInMoodType, CheckInType } from "data/database";
import { theme } from "utils/helpers";

type DayProps = {
  date: Date;
};

export default function Day(props: DayProps) {
  const db = useSQLiteContext();
  const colors = theme();
  const [checkInMood, setCheckInMood] = useState<CheckInMoodType>();
  const [isToday, setIsToday] = useState(false);
  const queriedRef = useRef(false);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const emojis = {
    0: require("../../../assets/img/emoji/small/white.svg"),
    1: require("../../../assets/img/emoji/small/yellow.svg"),
    2: require("../../../assets/img/emoji/small/chartreuse.svg"),
    3: require("../../../assets/img/emoji/small/green.svg"),
    4: require("../../../assets/img/emoji/small/spring-green.svg"),
    5: require("../../../assets/img/emoji/small/cyan.svg"),
    6: require("../../../assets/img/emoji/small/azure.svg"),
    7: require("../../../assets/img/emoji/small/blue.svg"),
    8: require("../../../assets/img/emoji/small/dark-violet.svg"),
    9: require("../../../assets/img/emoji/small/dark-magenta.svg"),
    10: require("../../../assets/img/emoji/small/dark-rose.svg"),
    11: require("../../../assets/img/emoji/small/red.svg"),
    12: require("../../../assets/img/emoji/small/orange.svg"),
  };

  const getData = async () => {
    const today = new Date();

    const todayCheck =
      today.getDate() === props.date.getDate() &&
      today.getMonth() === props.date.getMonth() &&
      today.getFullYear() === props.date.getFullYear()
        ? true
        : false;

    setIsToday(todayCheck);

    // If date is current day then query again to get latest check-in
    if (!queriedRef.current || (queriedRef.current && todayCheck)) {
      try {
        // Convert to ISO format but remain local
        const isoDate =
          props.date.getFullYear() +
          "-" +
          String(props.date.getMonth() + 1).padStart(2, "0") +
          "-" +
          String(props.date.getDate()).padStart(2, "0");

        // Check for check-ins on this date (date column converted to local)
        const query = `
      SELECT * FROM check_ins
      WHERE DATE(datetime(date, 'localtime')) = ? ORDER BY id DESC
    `;

        const row: CheckInType | null = await db.getFirstAsync(query, [isoDate]);

        if (row) {
          const mood: CheckInMoodType = JSON.parse(row.mood);
          setCheckInMood(mood);
        }

        queriedRef.current = true;
      } catch (error) {
        console.log(error);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Image
        source={checkInMood ? emojis[checkInMood.color as keyof typeof emojis] : emojis[0]}
        style={[styles.image, { width: Device.deviceType !== 1 ? 52 : 40 }]}
      />

      <Text
        style={[
          styles.text,
          {
            fontSize: Device.deviceType !== 1 ? 18 : 14,
            color: isToday ? colors.primary : colors.secondary,
          },
        ]}
        allowFontScaling={false}
      >
        {days[props.date.getDay()]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 4,
  },
  image: {
    aspectRatio: "1/1",
  },
  text: {
    fontFamily: "Circular-Book",
  },
});
