import { useEffect, useState } from "react";
import { useColorScheme, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import tagsData from "data/tags.json";
import { TagType } from "app/check-in";
import Tag from "./tags/Tag";
import { getTheme, shuffleArray } from "utils/helpers";

type TagsProps = {
  tags: number[];
  setSelectedTags: React.Dispatch<React.SetStateAction<number[]>>;
  selectedTags: number[];
  foreground: string;
};

export default function Tags(props: TagsProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const [tags, setTags] = useState<TagType[]>([]);

  useEffect(() => {
    const moodTags = tagsData.filter((item) => props.tags.includes(item.id));
    const shuffled = shuffleArray(moodTags);

    // Display a balance of 16 pos and neg tags
    let pos = shuffled.filter((item) => item.type === "pos");
    let neg = shuffled.filter((item) => item.type === "neg");

    if (pos.length < 8) {
      neg = neg.slice(0, 16 - pos.length); // Adjust neg if not enough pos
    } else if (neg.length < 8) {
      pos = pos.slice(0, 16 - neg.length); // Adjust pos if not enough neg
    } else {
      pos = pos.slice(0, 8);
      neg = neg.slice(0, 8);
    }

    setTags(shuffled.filter((item) => pos.includes(item) || neg.includes(item)));
  }, [props.tags]);

  return (
    <View
      style={{
        gap: theme.spacing.small,
        maxWidth: 448 + 48,
        paddingHorizontal: theme.spacing.base,
        position: "absolute",
        zIndex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {tags.map((item, index) => (
        <Tag
          key={item.id}
          tag={item}
          num={index}
          foreground={props.foreground}
          selectedTags={props.selectedTags}
          setSelectedTags={props.setSelectedTags}
        />
      ))}

      <StatusBar style={props.foreground === "white" ? "light" : "dark"} />
    </View>
  );
}
