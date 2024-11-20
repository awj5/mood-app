import { View, Text } from "react-native";
import * as Device from "expo-device";
import { ScrollView } from "react-native-gesture-handler";
import tagsData from "data/tags.json";
import Button from "components/Button";
import { theme } from "utils/helpers";

type FeelingsProps = {
  tags: number[];
};

export default function Feelings(props: FeelingsProps) {
  const colors = theme();
  const gap = Device.deviceType !== 1 ? 12 : 8;
  const edges = Device.deviceType !== 1 ? 24 : 16;

  return (
    <View style={{ gap: gap }}>
      <Text
        style={{
          fontFamily: "Circular-Bold",
          color: colors.primary,
          fontSize: Device.deviceType !== 1 ? 18 : 14,
          marginLeft: edges,
        }}
        allowFontScaling={false}
      >
        FEELINGS
      </Text>

      <ScrollView
        horizontal
        contentContainerStyle={{
          gap: gap,
          paddingHorizontal: edges,
        }}
        showsHorizontalScrollIndicator={false}
      >
        {props.tags.map((item) => {
          let tag = tagsData.find((tag) => tag.id === item);

          if (tag) {
            return (
              <Button key={item} disabled>
                {tag.name}
              </Button>
            );
          }

          return null;
        })}
      </ScrollView>
    </View>
  );
}
