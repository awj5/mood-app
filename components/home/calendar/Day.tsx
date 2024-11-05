import { useCallback, useState, useRef, useContext } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import * as Device from "expo-device";
import { getLocales } from "expo-localization";
import { CheckInMoodType, CheckInType } from "data/database";
import { HomeDatesContext, HomeDatesContextType } from "context/home-dates";
import { pressedDefault, theme, convertToISO } from "utils/helpers";

type DayProps = {
  date: Date;
};

export default function Day(props: DayProps) {
  const db = useSQLiteContext();
  const colors = theme();
  const localization = getLocales();
  const { homeDates } = useContext<HomeDatesContextType>(HomeDatesContext);
  const queriedRef = useRef(false);
  const [checkInMood, setCheckInMood] = useState<CheckInMoodType>();
  const [checkInCount, setCheckInCount] = useState(0);
  const [isToday, setIsToday] = useState(false);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();

  const emojis = {
    empty: require("../../../assets/img/emoji/small/white-empty.svg"),
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
        // Check for check-ins on this date (date column converted to local)
        const query = `
      SELECT * FROM check_ins
      WHERE DATE(datetime(date, 'localtime')) = ? ORDER BY id DESC
    `;

        const rows: CheckInType[] | null = await db.getAllAsync(query, [convertToISO(props.date)]);

        if (rows.length) {
          const mood: CheckInMoodType = JSON.parse(rows[0].mood);
          setCheckInMood(mood);
          setCheckInCount(rows.length);
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
    <Pressable
      onPress={() => alert("Coming soon")}
      style={({ pressed }) => [styles.container, pressedDefault(pressed)]}
      hitSlop={4}
      disabled={!checkInMood}
    >
      <View
        style={[
          styles.count,
          {
            display: checkInCount > 1 ? "flex" : "none",
            width: Device.deviceType !== 1 ? 20 : 16,
          },
        ]}
      >
        <Text style={[styles.countText, { fontSize: Device.deviceType !== 1 ? 12 : 10 }]} allowFontScaling={false}>
          {checkInCount}
        </Text>
      </View>

      <Image
        source={
          checkInMood
            ? emojis[checkInMood.color as keyof typeof emojis]
            : props.date < today
            ? emojis["empty"]
            : emojis[0]
        }
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
        {!homeDates?.rangeStart
          ? days[props.date.getDay()]
          : localization[0].languageTag === "en-US"
          ? `${props.date.getMonth() + 1}/${props.date.getDate()}`
          : `${props.date.getDate()}/${props.date.getMonth() + 1}`}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 4,
  },
  count: {
    position: "absolute",
    top: -4,
    right: -2,
    zIndex: 1,
    backgroundColor: "black",
    borderRadius: 999,
    aspectRatio: "1/1",
    justifyContent: "center",
    alignItems: "center",
  },
  countText: {
    fontFamily: "Circular-Medium",
    color: "white",
  },
  image: {
    aspectRatio: "1/1",
  },
  text: {
    fontFamily: "Circular-Book",
  },
});
