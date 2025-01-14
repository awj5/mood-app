import { useCallback, useContext, useRef, useState } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import * as Device from "expo-device";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn } from "react-native-reanimated";
import { CheckInType } from "data/database";
import { HomeDatesContext, HomeDatesContextType } from "context/home-dates";
import Insights from "./content/Insights";
import Quote from "./content/Quote";
import { convertToISO, theme } from "utils/helpers";

export default function Content() {
  const db = useSQLiteContext();
  const colors = theme();
  const insets = useSafeAreaInsets();
  const { homeDates } = useContext<HomeDatesContextType>(HomeDatesContext);
  const latestQueryRef = useRef<symbol>();
  const [checkIns, setCheckIns] = useState<CheckInType[]>();
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

    if (latestQueryRef.current === currentQuery) {
      setCheckIns(checkInData);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getCheckIns();
    }, [homeDates])
  );

  return (
    <ScrollView contentContainerStyle={{ flex: checkIns?.length ? 0 : 1 }}>
      <View
        style={[
          styles.wrapper,
          {
            paddingBottom: spacing * 2 + insets.bottom + (Device.deviceType !== 1 ? 96 : 72),
          },
        ]}
      >
        {checkIns?.length ? (
          <View style={{ gap: spacing, width: "100%" }}>
            <Insights checkIns={checkIns} dates={homeDates} />
            <Quote />
          </View>
        ) : (
          checkIns !== undefined && (
            <Animated.View entering={FadeIn}>
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
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});
