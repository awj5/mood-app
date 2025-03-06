import { useContext } from "react";
import { View } from "react-native";
import * as Device from "expo-device";
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
        padding: spacing,
        backgroundColor: mood.color,
        borderRadius: spacing,
      }}
    >
      <Header
        title={props.data.title}
        icon={props.data.icon}
        color={props.data.mood >= 6 && props.data.mood <= 11 ? "white" : "black"}
      />
    </View>
  );
}
