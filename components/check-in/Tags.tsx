import { useEffect, useState } from "react";
import { useColorScheme, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import tagsData from "data/tags.json";
import { TagType } from "app/check-in";
import Tag from "./tags/Tag";
import Busyness from "./tags/Busyness";
import { getTheme, shuffleArray } from "utils/helpers";

type TagsProps = {
  tags: number[];
  setSelectedTags: React.Dispatch<React.SetStateAction<number[]>>;
  selectedTags: number[];
  foreground: string;
  busyness: number;
  setBusyness: React.Dispatch<React.SetStateAction<number>>;
};

export default function Tags(props: TagsProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const [tags, setTags] = useState<TagType[]>([]);

  useEffect(() => {
    const moodTags = tagsData.filter((item) => props.tags.includes(item.id));
    const shuffled = shuffleArray(moodTags);

    // Display a balance of 12 pos and neg tags
    let pos = shuffled.filter((item) => item.type === "pos");
    let neg = shuffled.filter((item) => item.type === "neg");

    if (pos.length < 6) {
      neg = neg.slice(0, 12 - pos.length); // Adjust neg if not enough pos
    } else if (neg.length < 6) {
      pos = pos.slice(0, 12 - neg.length); // Adjust pos if not enough neg
    } else {
      pos = pos.slice(0, 6);
      neg = neg.slice(0, 6);
    }

    setTags(shuffled.filter((item) => pos.includes(item) || neg.includes(item)));
    props.setBusyness(1);
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

      <View style={{ gap: theme.spacing.small, flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
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
      </View>

      <StatusBar style={props.foreground === "white" ? "light" : "dark"} />
    </View>
  );
}
