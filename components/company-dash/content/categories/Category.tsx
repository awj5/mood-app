import { useContext } from "react";
import { View } from "react-native";
import * as Device from "expo-device";
import { DimensionsContext, DimensionsContextType } from "context/dimensions";
import Header from "./category/Header";
import Insights from "./category/Insights";
import { theme } from "utils/helpers";

type CategoryProps = {
  title: string;
  icon: React.ElementType;
};

export default function Category(props: CategoryProps) {
  const colors = theme();
  const { dimensions } = useContext<DimensionsContextType>(DimensionsContext);
  const spacing = Device.deviceType !== 1 ? 24 : 16;

  // 3 cols for landscape tablet, 2 cols for porttrait tablet, 1 col for phone
  const width =
    Device.deviceType !== 1 && dimensions.width > dimensions.height
      ? (dimensions.width - spacing * 4) / 3
      : Device.deviceType !== 1
      ? (dimensions.width - spacing * 3) / 2
      : dimensions.width - spacing * 2;

  return (
    <View
      style={{
        width: width,
        padding: spacing,
        backgroundColor: colors.primary === "white" ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.4)",
        borderRadius: spacing,
        gap: spacing,
      }}
    >
      <Header title={props.title} icon={props.icon} />
      <Insights text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit." />
    </View>
  );
}
