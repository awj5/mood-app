import { useEffect, useState } from "react";
import { Pressable, Text, useColorScheme } from "react-native";
import * as Device from "expo-device";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { TagType } from "app/check-in";
import { getTheme, pressedDefault } from "utils/helpers";

type TagProps = {
  tag: TagType;
  num: number;
  foreground: string;
  selectedTags: number[];
  setSelectedTags: React.Dispatch<React.SetStateAction<number[]>>;
};

export default function Tag(props: TagProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const scale = useSharedValue(0);
  const [selected, setSelected] = useState(false);

  const press = () => {
    const isSelected = props.selectedTags.includes(props.tag.id);

    // Add/remove from tags array
    if (isSelected) {
      // Remove
      props.setSelectedTags(props.selectedTags.filter((id) => id !== props.tag.id));
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
            borderWidth: theme.stroke,
            borderColor: props.foreground,
            paddingHorizontal: theme.spacing.small,
            justifyContent: "center",
            height: Device.deviceType === 1 ? 36 : 48,
            backgroundColor: selected ? props.foreground : "transparent",
          },
        ]}
        hitSlop={4}
      >
        <Text
          style={{
            fontFamily: "Circular-Medium",
            fontSize: theme.fontSize.body,
            color: selected && props.foreground === "black" ? "white" : selected ? "black" : props.foreground,
          }}
          allowFontScaling={false}
        >
          {props.tag.name}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
