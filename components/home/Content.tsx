import React, { useEffect } from "react";
import { useCallback, useContext, useRef, useState } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import * as Device from "expo-device";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { Easing, FadeIn } from "react-native-reanimated";
import { CheckInType } from "data/database";
import { HomeDatesContext, HomeDatesContextType } from "context/home-dates";
import Insights from "./content/Insights";
import Quote from "./content/Quote";
import Article from "./content/Article";
import Fact from "./content/Fact";
import Song from "./content/Song";
import Gifs from "./content/Gifs";
import Burnout from "./content/Burnout";
import Events from "./content/Events";
import Stats from "./content/Stats";
import { convertToISO, shuffleArray, theme } from "utils/helpers";

export default function Content() {
  const db = useSQLiteContext();
  const colors = theme();
  const insets = useSafeAreaInsets();
  const { homeDates } = useContext<HomeDatesContextType>(HomeDatesContext);
  const latestQueryRef = useRef<symbol>();
  const [checkIns, setCheckIns] = useState<CheckInType[]>();
  const [widgets, setWidgets] = useState<React.ReactNode>();
  const spacing = Device.deviceType !== 1 ? 24 : 16;

  const getCheckInData = async () => {
    const start = homeDates.rangeStart ? homeDates.rangeStart : homeDates.weekStart;
    let end = new Date(start);

    if (homeDates.rangeEnd) {
      end = homeDates.rangeEnd;
    } else {
      end.setDate(start.getDate() + 6); // Sunday
    }

    try {
      const rows: CheckInType[] = await db.getAllAsync(
        `SELECT * FROM check_ins WHERE DATE(datetime(date, 'localtime')) BETWEEN ? AND ? ORDER BY id ASC`,
        [convertToISO(start), convertToISO(end)]
      );

      return rows;
    } catch (error) {
      console.log(error);
    }
  };

  const getCheckIns = async () => {
    const currentQuery = Symbol("currentQuery");
    latestQueryRef.current = currentQuery;
    const checkInData = await getCheckInData();
    if (latestQueryRef.current === currentQuery) setCheckIns(checkInData);
  };

  useEffect(() => {
    // Add widgets
    if (checkIns?.length) {
      const largeWidgets = [<Quote checkIns={checkIns} />, <Gifs checkIns={checkIns} />, <Song checkIns={checkIns} />];
      const smallWidgets = [<Article checkIns={checkIns} />, <Fact checkIns={checkIns} />];
      const shuffledLarge = shuffleArray(largeWidgets);
      const shuffledSmall = shuffleArray(smallWidgets);
      const ordered = [];
      let index = 0;

      while (shuffledLarge.length || shuffledSmall.length) {
        let pickLarge = shuffledLarge.length ? Math.random() > 0.5 : false; // 50% chance of large

        if (pickLarge) {
          ordered.push(React.cloneElement(shuffledLarge.pop()!, { key: index }));
          index++;
        } else if (shuffledSmall.length > 1) {
          // Two small widgets available
          let double = (
            <View style={[styles.double, { gap: spacing }]} key={index}>
              {shuffledSmall.pop()}
              {shuffledSmall.pop()}
            </View>
          );

          ordered.push(double);
          index++;
        } else if (!shuffledLarge.length) {
          break; // Single small widget cannot be added
        }
      }

      setWidgets(<>{ordered}</>); // Add widgets to DOM
    } else {
      setWidgets([]); // Clear
    }
  }, [JSON.stringify(checkIns)]);

  useFocusEffect(
    useCallback(() => {
      getCheckIns();
    }, [homeDates])
  );

  return (
    <ScrollView contentContainerStyle={{ flex: checkIns?.length ? 0 : 1, alignItems: "center" }}>
      <View
        style={[
          styles.wrapper,
          {
            paddingBottom: spacing * 2 + insets.bottom + (Device.deviceType !== 1 ? 96 : 72),
            gap: spacing,
            paddingHorizontal: spacing,
          },
        ]}
      >
        {checkIns?.length ? (
          <>
            <Insights checkIns={checkIns} dates={homeDates} />
            <Stats checkIns={checkIns} />

            <View style={[styles.double, { gap: spacing }]}>
              <Burnout checkIns={checkIns} />
              <Events checkIns={checkIns} />
            </View>

            {widgets}
          </>
        ) : (
          checkIns !== undefined && (
            <Animated.View entering={FadeIn.duration(300).easing(Easing.in(Easing.cubic))}>
              <Text
                style={{
                  color: colors.primary,
                  opacity: 0.5,
                  fontFamily: "Circular-Book",
                  fontSize: Device.deviceType !== 1 ? 20 : 16,
                }}
                allowFontScaling={false}
              >
                No check-ins found
              </Text>
            </Animated.View>
          )
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: 768 + 48,
  },
  double: {
    flexDirection: "row",
  },
});
