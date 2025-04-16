import { useCallback, useState, useRef, useContext } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import * as Device from "expo-device";
import { getLocales } from "expo-localization";
import { CheckInMoodType, CheckInType } from "data/database";
import { HomeDatesContext, HomeDatesContextType } from "context/home-dates";
import { pressedDefault, theme } from "utils/helpers";
import { convertToISO } from "utils/dates";

type DayProps = {
  date: Date;
};

export default function Day(props: DayProps) {
  const db = useSQLiteContext();
  const colors = theme();
  const router = useRouter();
  const localization = getLocales();
  const { homeDates } = useContext<HomeDatesContextType>(HomeDatesContext);
  const queriedRef = useRef(false);
  const [checkInMood, setCheckInMood] = useState<CheckInMoodType>();
  const [checkInCount, setCheckInCount] = useState(0);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const emojis = {
    empty: require("../../../assets/img/emoji/small/white-empty.png"),
    0: require("../../../assets/img/emoji/small/white.png"),
    1: require("../../../assets/img/emoji/small/yellow.png"),
    2: require("../../../assets/img/emoji/small/chartreuse.png"),
    3: require("../../../assets/img/emoji/small/green.png"),
    4: require("../../../assets/img/emoji/small/spring-green.png"),
    5: require("../../../assets/img/emoji/small/cyan.png"),
    6: require("../../../assets/img/emoji/small/azure.png"),
    7: require("../../../assets/img/emoji/small/blue.png"),
    8: require("../../../assets/img/emoji/small/dark-violet.png"),
    9: require("../../../assets/img/emoji/small/dark-magenta.png"),
    10: require("../../../assets/img/emoji/small/dark-rose.png"),
    11: require("../../../assets/img/emoji/small/red.png"),
    12: require("../../../assets/img/emoji/small/orange.png"),
  };

  const press = () => {
    if (!checkInMood && today.getTime() === props.date.getTime()) {
      router.push("check-in"); // Is current day and not check-ins yet
    } else {
      router.push({
        pathname: "day",
        params: { day: props.date.getDate(), month: props.date.getMonth() + 1, year: props.date.getFullYear() },
      });
    }
  };

  const isInRange = (date: Date, start?: Date, end?: Date, weekStart?: Date) => {
    let sunday: Date | undefined;

    if (weekStart && !start) {
      sunday = new Date(weekStart);
      sunday.setDate(weekStart.getDate() + 6);
    }

    return (
      (weekStart && sunday && date >= weekStart && date <= sunday) ||
      (!weekStart && !start) ||
      (start && end && date >= start && date <= end)
    );
  };

  const getCheckInData = async () => {
    // Query again if date is in range
    if (
      !queriedRef.current ||
      (queriedRef.current && isInRange(props.date, homeDates.rangeStart, homeDates.rangeEnd, homeDates.weekStart))
    ) {
      try {
        // Check for check-ins on this date (date column converted to local)
        const rows: CheckInType[] = await db.getAllAsync(
          `SELECT * FROM check_ins WHERE DATE(datetime(date, 'localtime')) = ? ORDER BY id DESC`,
          [convertToISO(props.date)]
        );

        if (rows.length) {
          const mood: CheckInMoodType = JSON.parse(rows[0].mood);
          setCheckInMood(mood);
          setCheckInCount(rows.length);
        } else {
          // Clear
          setCheckInMood(undefined);
          setCheckInCount(0);
        }

        queriedRef.current = true;
      } catch (error) {
        console.log(error);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      getCheckInData();
    }, [homeDates])
  );

  return (
    <Pressable
      onPress={press}
      style={({ pressed }) => [pressedDefault(pressed)]}
      hitSlop={4}
      disabled={
        (checkInMood && isInRange(props.date, homeDates.rangeStart, homeDates.rangeEnd)) ||
        (today.getTime() === props.date.getTime() && isInRange(props.date, homeDates.rangeStart, homeDates.rangeEnd))
          ? false
          : true
      }
    >
      <View
        style={[
          styles.container,
          { opacity: isInRange(props.date, homeDates.rangeStart, homeDates.rangeEnd) ? 1 : 0.25 },
        ]}
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
          <Text
            style={[
              styles.countText,
              {
                fontSize: Device.deviceType !== 1 ? 14 : 10,
                lineHeight: Device.deviceType !== 1 ? 16 : 12,
              },
            ]}
            allowFontScaling={false}
          >
            {checkInCount}
          </Text>
        </View>

        <Image
          key={checkInMood ? checkInMood.color : 0}
          source={
            checkInMood
              ? emojis[checkInMood.color as keyof typeof emojis]
              : props.date < today
              ? emojis["empty"]
              : emojis[0]
          }
          style={{ aspectRatio: "1/1", width: Device.deviceType !== 1 ? 52 : 40 }}
        />

        <Text
          style={{
            fontFamily: today.getTime() === props.date.getTime() ? "Circular-Bold" : "Circular-Book",
            fontSize:
              Device.deviceType !== 1
                ? props.date.getFullYear() !== today.getFullYear()
                  ? 14
                  : 18
                : props.date.getFullYear() !== today.getFullYear()
                ? 10
                : 14,
            color:
              (checkInMood && isInRange(props.date, homeDates.rangeStart, homeDates.rangeEnd)) ||
              (today.getTime() === props.date.getTime() &&
                isInRange(props.date, homeDates.rangeStart, homeDates.rangeEnd))
                ? colors.primary
                : colors.secondary,
          }}
          allowFontScaling={false}
        >
          {!homeDates.rangeStart
            ? days[props.date.getDay()]
            : localization[0].languageTag === "en-US"
            ? `${props.date.getMonth() + 1}/${props.date.getDate()}${
                props.date.getFullYear() !== today.getFullYear()
                  ? `/${props.date.getFullYear().toString().slice(-2)}`
                  : ""
              }`
            : `${props.date.getDate()}/${props.date.getMonth() + 1}${
                props.date.getFullYear() !== today.getFullYear()
                  ? `/${props.date.getFullYear().toString().slice(-2)}`
                  : ""
              }`}
        </Text>
      </View>
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
});
