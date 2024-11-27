import { useCallback, useContext, useRef, useState } from "react";
import { ScrollView, View, Text } from "react-native";
import * as Device from "expo-device";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CheckInType } from "data/database";
import { HomeDatesContext, HomeDatesContextType } from "context/home-dates";
import Insights from "./content/Insights";
import { convertToISO, theme } from "utils/helpers";

export default function Content() {
  const db = useSQLiteContext();
  const colors = theme();
  const insets = useSafeAreaInsets();
  const { homeDates } = useContext<HomeDatesContextType>(HomeDatesContext);
  const latestQueryRef = useRef<symbol>();
  const [checkIns, setCheckIns] = useState<CheckInType[]>();
  const edgePadding = Device.deviceType !== 1 ? 24 : 16;

  const getData = async () => {
    const start = homeDates.rangeStart ? homeDates.rangeStart : homeDates.weekStart;
    var end = new Date(start);

    if (homeDates.rangeEnd) {
      end = homeDates.rangeEnd;
    } else {
      end.setDate(start.getDate() + 6); // Sunday
    }

    try {
      const query = `
      SELECT * FROM check_ins
      WHERE DATE(datetime(date, 'localtime')) BETWEEN ? AND ? ORDER BY id ASC
    `;

      const rows: CheckInType[] = await db.getAllAsync(query, [convertToISO(start), convertToISO(end)]);
      return rows;
    } catch (error) {
      console.log(error);
    }
  };

  const getCheckIns = async () => {
    const currentQuery = Symbol("currentQuery");
    latestQueryRef.current = currentQuery;
    const checkInData = await getData();

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
        style={{
          alignItems: "center",
          flex: 1,
          justifyContent: "center",
          paddingTop: edgePadding,
          paddingBottom: edgePadding * 2 + insets.bottom + (Device.deviceType !== 1 ? 96 : 72),
        }}
      >
        {checkIns?.length ? (
          <Insights checkIns={checkIns} />
        ) : (
          checkIns !== undefined && (
            <Text
              style={{
                color: colors.primary === "white" ? "#999999" : "#666666",
                fontFamily: "Circular-Book",
                fontSize: Device.deviceType !== 1 ? 20 : 16,
              }}
              allowFontScaling={false}
            >
              No check-ins found
            </Text>
          )
        )}
      </View>
    </ScrollView>
  );
}
