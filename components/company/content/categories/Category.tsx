import { useContext } from "react";
import { View, StyleSheet } from "react-native";
import * as Device from "expo-device";
import { LinearGradient } from "expo-linear-gradient";
import { DimensionsContext, DimensionsContextType } from "context/dimensions";
import moodsData from "data/moods.json";
import { CategoriesType } from "../Categories";
import Header from "./category/Header";

type CategoryProps = {
  data: CategoriesType;
};

export default function Category(props: CategoryProps) {
  const { dimensions } = useContext<DimensionsContextType>(DimensionsContext);
  const mood = moodsData.filter((item) => item.id === props.data.mood)[0];
  const spacing = Device.deviceType !== 1 ? 24 : 16;
  const parentWidth = dimensions.width >= 768 ? 768 : dimensions.width; // Detect min width

  return (
    <View
      style={{
        width: (parentWidth - spacing * 3) / 2, // 2 columns
        height: "100%",
        aspectRatio: Device.deviceType !== 1 ? "4/3" : "4/4",
        backgroundColor: mood.color,
        borderRadius: spacing,
        overflow: "hidden",
      }}
    >
      <LinearGradient colors={["rgba(255,255,255,0.4)", "transparent"]} style={{ flex: 1 }} />

      <View style={[styles.wrapper, { padding: spacing }]}>
        <Header
          title={props.data.title}
          icon={props.data.icon}
          color={props.data.mood >= 6 && props.data.mood <= 11 ? "white" : "black"}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    width: "100%",
  },
});
