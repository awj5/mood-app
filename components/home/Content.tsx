import React, { useEffect } from "react";
import { useCallback, useContext, useRef, useState } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import * as Device from "expo-device";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { Easing, FadeIn } from "react-native-reanimated";
import { Sparkles } from "lucide-react-native";
import { CheckInType } from "data/database";
import { HomeDatesContext, HomeDatesContextType } from "context/home-dates";
import Insights from "./content/Insights";
import Quote from "../Quote";
import Article from "../Article";
import Fact from "./content/Fact";
import Song from "../Song";
import Gifs from "../Gifs";
import Burnout from "./content/Burnout";
import Journal from "./content/Journal";
import Stats from "./content/Stats";
import Button from "components/Button";
import { shuffleArray, theme, getStoredVal } from "utils/helpers";
import { convertToISO } from "utils/dates";

export default function Content() {
  const db = useSQLiteContext();
  const colors = theme();
  const insets = useSafeAreaInsets();
  const { homeDates } = useContext<HomeDatesContextType>(HomeDatesContext);
  const latestQueryRef = useRef<symbol>();
  const scrollViewRef = useRef<ScrollView>(null);
  const [checkIns, setCheckIns] = useState<CheckInType[]>();
  const [widgets, setWidgets] = useState<React.ReactNode>();
  const [hasAccess, setHasAccess] = useState(false);
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
    const uuid = await getStoredVal("uuid"); // Check if customer employee
    const proID = await getStoredVal("pro-id"); // Check if pro subscriber

    if (latestQueryRef.current === currentQuery) {
      setHasAccess(uuid || proID ? true : false);
      setCheckIns(checkInData);
    }
  };

  useEffect(() => {
    const now = Date.now(); // Use to make keys unique
    scrollViewRef.current?.scrollTo({ y: 0, animated: false }); // Reset

    // Add widgets
    if (checkIns?.length) {
      const largeWidgets = [
        <Quote checkIns={checkIns} dates={homeDates} />,
        <Gifs checkIns={checkIns} dates={homeDates} />,
        <Song checkIns={checkIns} dates={homeDates} />,
      ];
      const smallWidgets = [
        <Article checkIns={checkIns} dates={homeDates} />,
        <Fact checkIns={checkIns} dates={homeDates} />,
      ];
      const shuffledLarge = shuffleArray(largeWidgets);
      const shuffledSmall = shuffleArray(smallWidgets);
      const ordered = [];
      let index = 0;

      while (shuffledLarge.length || shuffledSmall.length) {
        let pickLarge = shuffledLarge.length ? Math.random() > 0.5 : false; // 50% chance of large

        if (pickLarge) {
          ordered.push(React.cloneElement(shuffledLarge.pop()!, { key: now + index }));
          index++;
        } else if (shuffledSmall.length > 1) {
          // Two small widgets available
          let double = (
            <View style={[styles.double, { gap: spacing }]} key={now + index}>
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
    <ScrollView
      ref={scrollViewRef}
      style={{ flex: 1 }}
      contentContainerStyle={{ flex: checkIns?.length ? 0 : 1, alignItems: "center" }}
    >
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
            {hasAccess ? (
              <>
                <Insights checkIns={checkIns} dates={homeDates} />
                <Stats checkIns={checkIns} dates={homeDates} />

                <View style={[styles.double, { gap: spacing }]}>
                  <Burnout checkIns={checkIns} />
                  <Journal checkIns={checkIns} />
                </View>
              </>
            ) : (
              <View style={{ width: "100%", marginTop: spacing, paddingHorizontal: spacing }}>
                <Button route="pro" fill icon={Sparkles} gradient>
                  Generate AI insights with Pro
                </Button>
              </View>
            )}

            {widgets}
          </>
        ) : (
          checkIns !== undefined && (
            <Animated.View entering={FadeIn.duration(300).easing(Easing.in(Easing.cubic))}>
              <Text
                style={{
                  color: colors.opaque,
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
    maxWidth: 720 + 48,
  },
  double: {
    flexDirection: "row",
  },
});
