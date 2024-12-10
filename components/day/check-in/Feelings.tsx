import { View } from "react-native";
import * as Device from "expo-device";
import { ScrollView } from "react-native-gesture-handler";
import tagsData from "data/tags.json";
import Button from "components/Button";

type FeelingsProps = {
  tags: number[];
};

export default function Feelings(props: FeelingsProps) {
  return (
    <View>
      <ScrollView
        horizontal
        contentContainerStyle={{
          gap: Device.deviceType !== 1 ? 12 : 8,
          paddingHorizontal: Device.deviceType !== 1 ? 24 : 16,
        }}
        showsHorizontalScrollIndicator={false}
      >
        {props.tags.map((item) => (
          <Button key={item}>{tagsData.filter((tag) => tag.id === item)[0].name}</Button>
        ))}
      </ScrollView>
    </View>
  );
}
