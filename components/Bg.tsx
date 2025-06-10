import { useCallback, useRef, useState } from "react";
import { View, StyleSheet, LayoutChangeEvent, useColorScheme, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { useHeaderHeight } from "@react-navigation/elements";
import { useFocusEffect } from "@react-navigation/native";
import { useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated";
import { Canvas, Rect, LinearGradient, vec } from "@shopify/react-native-skia";
import MoodsData from "data/moods.json";
import { CheckInType, CheckInMoodType, CompanyCheckInType } from "types";
import { getTheme } from "utils/helpers";

type BgProps = {
  checkIns?: CheckInType[] | CompanyCheckInType[];
  topOffset?: number;
};

export default function Bg(props: BgProps) {
  const headerHeight = useHeaderHeight();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const color1 = useSharedValue(theme.color.primaryBg);
  const color2 = useSharedValue(theme.color.primaryBg);
  const color3 = useSharedValue(theme.color.primaryBg);
  const colorsArrayRef = useRef([theme.color.primaryBg]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const indexRef = useRef(0);
  const stepRef = useRef(0);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });
  const trueHeaderHeight = Platform.OS === "android" ? 106 : headerHeight;
  const top = props.topOffset ? trueHeaderHeight + props.topOffset : trueHeaderHeight;
  const animationDuration = 3000;

  const gradientColors = useDerivedValue(() => {
    return [theme.color.primaryBg, color1.value, color2.value, color3.value];
  }, [theme.color.primaryBg]);

  const getCanvasDimensions = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setCanvasDimensions({ width: width, height: height - top });
  };

  const getCheckInColors = (checkIns: CheckInType[] | CompanyCheckInType[]) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const checkInColors = checkIns.length ? [] : [theme.color.primaryBg]; // Use background color if no check-ins

    for (const checkIn of checkIns) {
      const mood: CheckInMoodType = "value" in checkIn ? checkIn.value : JSON.parse(checkIn.mood); // Determine if company check-in
      const color = MoodsData.filter((item) => item.id === mood.color)[0].color;
      checkInColors.push(color);
    }

    indexRef.current = 0;
    stepRef.current = 0;
    colorsArrayRef.current = checkInColors;
    intervalRef.current = setInterval(animateColors, animationDuration);
    animateColors(); // Init
  };

  const animateColors = () => {
    if (intervalRef.current !== null) {
      // Top
      if ((indexRef.current === 0 && stepRef.current === 2) || (indexRef.current > 0 && stepRef.current === 1))
        color1.value = withTiming(colorsArrayRef.current[indexRef.current % colorsArrayRef.current.length], {
          duration: animationDuration,
        });

      // Middle
      if ((indexRef.current === 0 && stepRef.current === 1) || (indexRef.current > 0 && stepRef.current === 0))
        color2.value = withTiming(colorsArrayRef.current[indexRef.current % colorsArrayRef.current.length], {
          duration: animationDuration,
        });

      // Bottom
      if (
        (indexRef.current === 0 && stepRef.current === 0) ||
        (indexRef.current === 0 && stepRef.current === 2) ||
        (indexRef.current > 0 && stepRef.current === 1)
      )
        color3.value = withTiming(
          colorsArrayRef.current[(indexRef.current + (stepRef.current > 0 ? 1 : 0)) % colorsArrayRef.current.length],
          {
            duration: animationDuration,
          }
        );

      if ((indexRef.current === 0 && stepRef.current === 2) || (indexRef.current > 0 && stepRef.current === 1)) {
        indexRef.current += 1; // Next color in array
        stepRef.current = 0; // Reset
      } else {
        stepRef.current += 1;
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (props.checkIns) getCheckInColors(props.checkIns);

      return () => {
        // Stop animation
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }, [JSON.stringify(props.checkIns), colorScheme])
  );

  return (
    <View style={styles.container} onLayout={(e) => getCanvasDimensions(e)}>
      <Canvas style={{ flex: 1, top: top }}>
        <Rect x={0} y={0} width={canvasDimensions.width} height={canvasDimensions.height}>
          <LinearGradient start={vec(0, 0)} end={vec(0, canvasDimensions.height)} colors={gradientColors} />
        </Rect>
      </Canvas>

      <BlurView intensity={50} tint={colorScheme as "light" | "dark"} style={styles.container} />
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
