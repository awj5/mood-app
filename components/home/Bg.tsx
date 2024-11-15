import { useCallback, useContext, useState } from "react";
import { View, StyleSheet, LayoutChangeEvent } from "react-native";
import * as Device from "expo-device";
import { BlurView } from "expo-blur";
import { useSQLiteContext } from "expo-sqlite";
import { useHeaderHeight } from "@react-navigation/elements";
import { useFocusEffect } from "@react-navigation/native";
import { useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated";
import { Canvas, Rect, LinearGradient, vec } from "@shopify/react-native-skia";
import { CheckInMoodType, CheckInType } from "data/database";
import MoodsData from "data/moods.json";
import { HomeDatesContext, HomeDatesContextType } from "context/home-dates";
import { convertToISO, theme } from "utils/helpers";

export default function Bg() {
  const db = useSQLiteContext();
  const colors = theme();
  const headerHeight = useHeaderHeight();
  const color1 = useSharedValue(colors.primaryBg);
  const color2 = useSharedValue(colors.primaryBg);
  const color3 = useSharedValue(colors.primaryBg);
  const { homeDates } = useContext<HomeDatesContextType>(HomeDatesContext);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });
  const [colorsArray, setColorsArray] = useState([colors.primaryBg]);
  const heightOffset = headerHeight + (Device.deviceType !== 1 ? 128 : 96);
  const animationDuration = 3000;

  const gradientColors = useDerivedValue(() => {
    return [colors.primaryBg, color1.value, color2.value, color3.value];
  }, [colors.primaryBg]);

  const getCanvasDimensions = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setCanvasDimensions({ width: width, height: height - heightOffset });
  };

  const getData = async () => {
    const start = homeDates.rangeStart ? homeDates.rangeStart : homeDates.weekStart;
    var end = new Date(start);

    if (homeDates.rangeEnd) {
      end = homeDates.rangeEnd;
    } else {
      end.setDate(start.getDate() + 6); // Sunday
    }

    var checkInColors = [colors.primaryBg];

    try {
      const query = `
      SELECT * FROM check_ins
      WHERE DATE(datetime(date, 'localtime')) BETWEEN ? AND ? ORDER BY id ASC
    `;

      const rows: CheckInType[] | null = await db.getAllAsync(query, [convertToISO(start), convertToISO(end)]);
      if (rows.length) checkInColors = []; // Clear when checkins found

      // Loop checkins and get color
      for (let i = 0; i < rows.length; i++) {
        let mood: CheckInMoodType = JSON.parse(rows[i].mood);
        let data = MoodsData.filter((item) => item.id === mood.color);
        checkInColors.push(data[0].color);
      }

      setColorsArray(checkInColors);
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      var index = 0;
      var step = 0;

      const animateColors = () => {
        // Top
        if ((index === 0 && step === 2) || (index > 0 && step === 1)) {
          color1.value = withTiming(colorsArray[index % colorsArray.length], {
            duration: animationDuration,
          });
        }

        // Middle
        if ((index === 0 && step === 1) || (index > 0 && step === 0)) {
          color2.value = withTiming(colorsArray[index % colorsArray.length], {
            duration: animationDuration,
          });
        }

        // Bottom
        if ((index === 0 && step === 0) || (index === 0 && step === 2) || (index > 0 && step === 1)) {
          color3.value = withTiming(colorsArray[(index + (step > 0 ? 1 : 0)) % colorsArray.length], {
            duration: animationDuration,
          });
        }

        if ((index === 0 && step === 2) || (index > 0 && step === 1)) {
          index += 1; // Next color in array
          step = 0; // Reset
        } else {
          step += 1;
        }
      };

      const interval = setInterval(animateColors, animationDuration);
      animateColors();
      return () => clearInterval(interval);
    }, [colorsArray])
  );

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [homeDates])
  );

  return (
    <View style={styles.container} onLayout={(e) => getCanvasDimensions(e)}>
      <Canvas style={{ flex: 1, top: heightOffset }}>
        <Rect x={0} y={0} width={canvasDimensions.width} height={canvasDimensions.height}>
          <LinearGradient start={vec(0, 0)} end={vec(0, canvasDimensions.height)} colors={gradientColors} />
        </Rect>
      </Canvas>

      <BlurView intensity={50} tint={colors.primary === "white" ? "dark" : "light"} style={styles.container} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});
