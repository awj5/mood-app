import { useCallback, useState, useContext } from "react";
import { View, Text, Pressable, useColorScheme } from "react-native";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import * as Device from "expo-device";
import { getLocales } from "expo-localization";
import { HomeDatesContext, HomeDatesContextType } from "context/home-dates";
import { CheckInType, CheckInMoodType } from "types";
import { getTheme, pressedDefault } from "utils/helpers";
import { convertToISO } from "utils/dates";

type DayProps = {
  date: Date;
};

export default function Day(props: DayProps) {
  const db = useSQLiteContext();
  const router = useRouter();
  const localization = getLocales();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const { homeDates } = useContext<HomeDatesContextType>(HomeDatesContext);
  const [checkInMood, setCheckInMood] = useState<CheckInMoodType>();
  const [checkInCount, setCheckInCount] = useState(0);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isToday = today.getTime() === props.date.getTime();
  const isThisYear = props.date.getFullYear() === today.getFullYear();
  const month = props.date.getMonth() + 1;
  const year = props.date.getFullYear();

  // Returns true if no date range is currently set
  const inRange =
    !homeDates.rangeStart ||
    (homeDates.rangeStart &&
      homeDates.rangeEnd &&
      props.date >= homeDates.rangeStart &&
      props.date <= homeDates.rangeEnd);

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
    if (!checkInMood && isToday) {
      router.push("check-in"); // Is current day and not check-ins yet
    } else {
      router.push({
        pathname: "day",
        params: { day: props.date.getDate(), month: month, year: year },
      });
    }
  };

  const getCheckIns = async () => {
    try {
      // Check for check-ins on this date (date column converted to local)
      const rows: CheckInType[] = await db.getAllAsync(
        `SELECT * FROM check_ins WHERE DATE(datetime(date, 'localtime')) = ? ORDER BY id DESC`,
        [convertToISO(props.date)]
      );

      if (rows.length) {
        const mood: CheckInMoodType = JSON.parse(rows[0].mood); // Most recent mood
        setCheckInMood(mood);
      } else {
        setCheckInMood(undefined); // Clear
      }

      setCheckInCount(rows.length ? rows.length : 0);
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getCheckIns();
    }, [])
  );

  return (
    <Pressable
      onPress={press}
      style={({ pressed }) => pressedDefault(pressed)}
      hitSlop={4}
      disabled={(!checkInMood && !isToday) || !inRange}
    >
      <View
        style={{
          opacity: inRange ? 1 : 0.25,
          alignItems: "center",
          gap: theme.spacing.base / 4,
        }}
      >
        <View
          style={{
            display: checkInCount > 1 ? "flex" : "none",
            width: Device.deviceType === 1 ? 16 : 20,
            position: "absolute",
            top: -4,
            right: -2,
            zIndex: 1,
            backgroundColor: "black",
            borderRadius: 999,
            aspectRatio: "1/1",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: theme.fontSize.xxSmall,
              fontFamily: "Circular-Medium",
              color: "white",
            }}
            allowFontScaling={false}
          >
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
          style={{ aspectRatio: "1/1", width: Device.deviceType === 1 ? 40 : 52 }}
        />

        <Text
          style={{
            fontFamily: isToday ? "Circular-Bold" : "Circular-Book",
            fontSize: !isThisYear ? theme.fontSize.xxSmall : theme.fontSize.small,
            color: checkInMood ? theme.color.primary : theme.color.secondary,
          }}
          allowFontScaling={false}
        >
          {!homeDates.rangeStart
            ? days[props.date.getDay()]
            : localization[0].languageTag === "en-US"
            ? `${month}/${props.date.getDate()}${!isThisYear ? `/${year.toString().slice(-2)}` : ""}`
            : `${props.date.getDate()}/${month}${!isThisYear ? `/${year.toString().slice(-2)}` : ""}`}
        </Text>
      </View>
    </Pressable>
  );
}
