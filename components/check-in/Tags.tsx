import { useEffect, useRef, useState } from "react";
import { useColorScheme, View, Text, Pressable } from "react-native";
import { StatusBar } from "expo-status-bar";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import tagsData from "data/tags.json";
import { TagType } from "app/check-in";
import Tag from "./tags/Tag";
import Busyness from "./tags/Busyness";
import { getTheme, shuffleArray } from "utils/helpers";

type TagsProps = {
  tags: number[];
  secondaryTags: number[];
  setSelectedTags: React.Dispatch<React.SetStateAction<number[]>>;
  selectedTags: number[];
  foreground: string;
  busyness: number;
  setBusyness: React.Dispatch<React.SetStateAction<number>>;
};

export default function Tags(props: TagsProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const opacity = useSharedValue(0);
  const initRef = useRef(false);
  const [tags, setTags] = useState<TagType[]>([]);
  const [delay, setDelay] = useState(1000);

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const loadTags = () => {
    const selectedTags = tagsData.filter((item) => props.selectedTags.includes(item.id)); // Tags that have already been selected

    const moodTags = tagsData.filter(
      (item) =>
        (props.tags.includes(item.id) || props.secondaryTags.includes(item.id)) && !props.selectedTags.includes(item.id)
    );

    const shuffled = shuffleArray(moodTags);

    // Display a balance of pos and neg tags
    const total = 12 - selectedTags.length; // Show 12 tags (including already selected)
    let pos = shuffled.filter((item) => item.type === "pos");
    let neg = shuffled.filter((item) => item.type === "neg");
    let nonSelectedTags = [];

    if (total === 1) {
      const random = moodTags[Math.floor(Math.random() * moodTags.length)];
      nonSelectedTags.push(random);
    } else {
      if (pos.length < total / 2) {
        neg = neg.slice(0, total - pos.length); // Adjust neg if not enough pos
      } else if (neg.length < total / 2) {
        pos = pos.slice(0, total - neg.length); // Adjust pos if not enough neg
      } else {
        const half = Math.floor(total / 2);
        pos = pos.slice(0, half + (total % 2)); // Extra pos tag if total is odd
        neg = neg.slice(0, half);
      }

      nonSelectedTags = shuffleArray([...pos, ...neg]);
    }

    const combined = [...selectedTags, ...nonSelectedTags];
    if (initRef.current) setDelay(0);
    setTags(combined);
    initRef.current = true;
  };

  useEffect(() => {
    initRef.current = false;
    loadTags();
    props.setBusyness(1); // Reset

    // Fade in sub-heading
    const timeout = setTimeout(() => {
      opacity.value = withTiming(1, { duration: 200, easing: Easing.in(Easing.cubic) });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [props.tags]);

  return (
    <View
      style={{
        maxWidth: 448 + 48,
        paddingHorizontal: theme.spacing.base,
        position: "absolute",
        zIndex: 1,
        gap: theme.spacing.base * 2,
        alignItems: "center",
      }}
    >
      <Busyness foreground={props.foreground} level={props.busyness} setLevel={props.setBusyness} />

      <View style={{ alignItems: "center", gap: theme.spacing.base }}>
        <Animated.View style={animatedStyles}>
          <Text
            style={{
              fontFamily: "Circular-Bold",
              color: props.foreground,
              fontSize: theme.fontSize.xSmall,
            }}
            allowFontScaling={false}
          >
            PICK AT LEAST ONE
          </Text>
        </Animated.View>

        <View style={{ gap: theme.spacing.small, flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
          {tags.map((item, index) => (
            <Tag
              key={item.id}
              tag={item}
              num={index}
              foreground={props.foreground}
              selectedTags={props.selectedTags}
              setSelectedTags={props.setSelectedTags}
              delay={delay}
            />
          ))}
        </View>

        <Pressable onPress={loadTags}>
          <Text>Refresh</Text>
        </Pressable>
      </View>

      <StatusBar style={props.foreground === "white" ? "light" : "dark"} />
    </View>
  );
}
