import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Image } from "expo-image";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import * as Device from "expo-device";
import { CheckInMoodType, CheckInType } from "data/database";
import { theme } from "utils/helpers";

type EntryProps = {
  date: Date;
};

export default function Entry(props: EntryProps) {
  const db = useSQLiteContext();
  const colors = theme();
  const [checkInMood, setCheckInMood] = useState<CheckInMoodType>();
  var days = ["S", "M", "T", "W", "T", "F", "S"];
  const today = new Date();

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
    try {
      // Check for check-in on this date
      const isoDate = new Date(props.date).toISOString().split("T")[0];

      const query = `
      SELECT * FROM check_ins
      WHERE DATE(datetime(date, 'localtime')) = ? ORDER BY id DESC
    `;

      const row: CheckInType | null = await db.getFirstAsync(query, [isoDate]);

      if (row) {
        const mood: CheckInMoodType = JSON.parse(row.mood);
        setCheckInMood(mood);
      }
    } catch (error) {
      console.log(error);
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
            color: props.date.getDate() === today.getDate() ? colors.primary : colors.secondary,
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
    fontFamily: "Circular-Regular",
  },
});
