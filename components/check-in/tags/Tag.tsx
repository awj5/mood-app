import { useEffect, useState } from "react";
import { Pressable, Text } from "react-native";
import * as Device from "expo-device";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { TagType } from "app/check-in";
import { pressedDefault } from "utils/helpers";

type TagProps = {
  tag: TagType;
  num: number;
  color: string;
  selectedTags: number[];
  setSelectedTags: React.Dispatch<React.SetStateAction<number[]>>;
};

export default function Tag(props: TagProps) {
  const scale = useSharedValue(0);
  const [selected, setSelected] = useState(false);

  const press = () => {
    const index = props.selectedTags.indexOf(props.tag.id);

    // Add/remove from tags array
    if (index !== -1) {
      // Remove
      const tags = [...props.selectedTags];
      tags.splice(index, 1);
      props.setSelectedTags(tags);
      setSelected(false);
    } else {
      // Add
      props.setSelectedTags([...props.selectedTags, props.tag.id]);
      setSelected(true);
    }
  };

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    scale.value = withDelay(1000 + 20 * props.num, withTiming(1, { duration: 200, easing: Easing.elastic(1) }));
  }, []);

  return (
    <Animated.View style={animatedStyles}>
      <Pressable
        onPress={press}
        style={({ pressed }) => [
          pressedDefault(pressed),
          {
            borderRadius: 999,
            borderWidth: Device.deviceType !== 1 ? 2.5 : 2,
            borderColor: props.color,
            paddingHorizontal: Device.deviceType !== 1 ? 16 : 12,
            paddingVertical: Device.deviceType !== 1 ? 8 : 6,
            backgroundColor: !selected ? "transparent" : props.color,
          },
        ]}
        hitSlop={4}
      >
        <Text
          style={{
            fontFamily: "Circular-Medium",
            fontSize: Device.deviceType !== 1 ? 22 : 18,
            color: selected && props.color === "black" ? "white" : selected ? "black" : props.color,
          }}
          allowFontScaling={false}
        >
          {props.tag.name}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
