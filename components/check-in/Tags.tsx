import { useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import * as Device from "expo-device";
import { StatusBar } from "expo-status-bar";
import tagsData from "data/tags.json";
import { DimensionsContext, DimensionsContextType } from "context/dimensions";
import { TagType } from "app/check-in";
import Tag from "./tags/Tag";

type TagsProps = {
  tags: number[];
  setSelectedTags: React.Dispatch<React.SetStateAction<number[]>>;
  selectedTags: number[];
  color: string;
};

export default function Tags(props: TagsProps) {
  const [tags, setTags] = useState<TagType[]>([]);
  const { dimensions } = useContext<DimensionsContextType>(DimensionsContext);

  const shuffleArray = (array: TagType[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      let rand = Math.floor(Math.random() * (i + 1));
      [array[i], array[rand]] = [array[rand], array[i]];
    }

    return array;
  };

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
    props.setSelectedTags([]); // Clear
  }, [props.tags]);

  return (
    <View
      style={[
        styles.container,
        {
          gap: Device.deviceType !== 1 ? 16 : dimensions.height <= 667 ? 8 : 12,
          maxWidth: dimensions.width > dimensions.height ? 448 + 48 : "auto",
          paddingHorizontal: Device.deviceType !== 1 ? 24 : 16,
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
  },
});
