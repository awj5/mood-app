import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, LayoutChangeEvent } from "react-native";
import * as Device from "expo-device";
import { BlurView } from "expo-blur";
import { useHeaderHeight } from "@react-navigation/elements";
import { useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated";
import { Canvas, Rect, LinearGradient, vec } from "@shopify/react-native-skia";
import { CompanyCheckInType } from "app/company";
import MoodsData from "data/moods.json";
import { CheckInMoodType } from "types";
import { theme } from "utils/helpers";

type BgProps = {
  checkIns: CompanyCheckInType[] | undefined;
};

export default function Bg(props: BgProps) {
  const colors = theme();
  const headerHeight = useHeaderHeight();
  const color1 = useSharedValue(colors.primaryBg);
  const color2 = useSharedValue(colors.primaryBg);
  const color3 = useSharedValue(colors.primaryBg);
  const colorsArrayRef = useRef([colors.primaryBg]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });
  const heightOffset = headerHeight + (Device.deviceType !== 1 ? 128 : 96);
  const animationDuration = 3000;
  let index = 0;
  let step = 0;

  const gradientColors = useDerivedValue(() => {
    return [colors.primaryBg, color1.value, color2.value, color3.value];
  }, [colors.primaryBg]);

  const getCanvasDimensions = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setCanvasDimensions({ width: width, height: height - heightOffset });
  };

  const getCheckInData = (checkIns: CompanyCheckInType[]) => {
    let checkInColors = [colors.primaryBg];
    if (checkIns.length) checkInColors = []; // Clear when checkins found

    // Loop checkins and get color
    for (let i = 0; i < checkIns.length; i++) {
      let mood: CheckInMoodType = checkIns[i].value;
      let data = MoodsData.filter((item) => item.id === mood.color);
      checkInColors.push(data[0].color);
    }

    index = 0;
    step = 0;
    colorsArrayRef.current = checkInColors;
    intervalRef.current = setInterval(animateColors, animationDuration);
    animateColors(); // Init
  };

  const animateColors = () => {
    if (intervalRef.current !== null) {
      // Top
      if ((index === 0 && step === 2) || (index > 0 && step === 1))
        color1.value = withTiming(colorsArrayRef.current[index % colorsArrayRef.current.length], {
          duration: animationDuration,
        });

      // Middle
      if ((index === 0 && step === 1) || (index > 0 && step === 0))
        color2.value = withTiming(colorsArrayRef.current[index % colorsArrayRef.current.length], {
          duration: animationDuration,
        });

      // Bottom
      if ((index === 0 && step === 0) || (index === 0 && step === 2) || (index > 0 && step === 1))
        color3.value = withTiming(
          colorsArrayRef.current[(index + (step > 0 ? 1 : 0)) % colorsArrayRef.current.length],
          {
            duration: animationDuration,
          }
        );

      if ((index === 0 && step === 2) || (index > 0 && step === 1)) {
        index += 1; // Next color in array
        step = 0; // Reset
      } else {
        step += 1;
      }
    }
  };

  useEffect(() => {
    if (props.checkIns) getCheckInData(props.checkIns);

    return () => {
      // Stop animation
      clearInterval(intervalRef.current as NodeJS.Timeout);
      intervalRef.current = null;
    };
  }, [JSON.stringify(props.checkIns), colors.primaryBg]);

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
