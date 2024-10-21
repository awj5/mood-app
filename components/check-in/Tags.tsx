import { useEffect, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import * as Device from "expo-device";
import { StatusBar } from "expo-status-bar";
import tagsData from "data/tags.json";
import { MoodType, TagType } from "app/check-in";
import Tag from "./tags/Tag";

type TagsProps = {
  mood: MoodType;
  setSelectedTags: React.Dispatch<React.SetStateAction<number[]>>;
  selectedTags: number[];
  color: string;
};

export default function Tags(props: TagsProps) {
  const [tags, setTags] = useState<TagType[]>([]);
  const height = Dimensions.get("screen").height;

  const shuffleArray = (array: TagType[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      let rand = Math.floor(Math.random() * (i + 1));
      [array[i], array[rand]] = [array[rand], array[i]];
    }

    return array;
  };

  useEffect(() => {
    const moodTags = tagsData.filter((item) => props.mood.tags.includes(item.id));
    const shuffled = shuffleArray(moodTags);

    // Display a balance of 12 pos and neg tags
    var pos = shuffled.filter((item) => item.type === "pos");
    var neg = shuffled.filter((item) => item.type === "neg");

    if (pos.length < 8) {
      neg = neg.slice(0, 16 - pos.length); // Adjust neg if not enough pos
    } else if (neg.length < 8) {
      pos = pos.slice(0, 16 - neg.length); // Adjust pos if not enough neg
    } else {
      pos = pos.slice(0, 8);
      neg = neg.slice(0, 8);
    }

    setTags(shuffled.filter((item) => pos.includes(item) || neg.includes(item)));
    props.setSelectedTags([]); // Clear
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          gap: Device.deviceType !== 1 ? 16 : height <= 667 ? 8 : 12,
        },
      ]}
    >
      {tags.map((item, index) => (
        <Tag
          key={index}
          tag={item}
          num={index}
          color={props.color}
          selectedTags={props.selectedTags}
          setSelectedTags={props.setSelectedTags}
        />
      ))}

      <StatusBar style={props.color === "white" ? "light" : "dark"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignContent: "center",
    maxWidth: 448 + 32,
    paddingHorizontal: 16,
  },
});
