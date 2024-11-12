import { useState } from "react";
import { View, StyleSheet, LayoutChangeEvent } from "react-native";
import * as Device from "expo-device";
import { BlurView } from "expo-blur";
import { useHeaderHeight } from "@react-navigation/elements";
import { Canvas, Rect, LinearGradient, vec } from "@shopify/react-native-skia";
import { theme } from "utils/helpers";

export default function Bg() {
  const colors = theme();
  const headerHeight = useHeaderHeight();
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });
  const heightOffset = headerHeight + (Device.deviceType !== 1 ? 128 : 96);

  const getCanvasDimensions = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setCanvasDimensions({ width: width, height: height - heightOffset });
  };

  return (
    <View style={styles.container} onLayout={(e) => getCanvasDimensions(e)}>
      <Canvas style={{ flex: 1, top: heightOffset }}>
        <Rect x={0} y={0} width={canvasDimensions.width} height={canvasDimensions.height}>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(0, canvasDimensions.height)}
            colors={[colors.primaryBg, "red", "blue", "red"]}
          />
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
