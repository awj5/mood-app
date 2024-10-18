import { useCallback, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Stack, useFocusEffect } from "expo-router";
import MoodsData from "data/moods.json";
import Wheel from "components/check-in/Wheel";
import Emoji from "components/check-in/Emoji";
import Background from "components/check-in/Background";
import Instructions from "components/check-in/Instructions";
import Heading from "components/check-in/Heading";
import Next from "components/check-in/Next";
import Close from "components/check-in/Close";
import Tags from "components/check-in/Tags";

export type MoodType = {
  id: number;
  color: string;
  tags: number[];
};

export type TagType = {
  id: number;
  name: string;
  type: string;
};

export default function CheckIn() {
  const [angle, setAngle] = useState(0);
  const [mood, setMood] = useState<MoodType>(MoodsData[0]);
  const [visible, setVisible] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [showQuestion, setShowQuestion] = useState(false);
  const [question, setQuestion] = useState(0);

  useEffect(() => {
    // Snap to 1 of 12 angles (groups of 30 degrees)
    const normalizedAngle = angle % 360;
    const index = Math.floor((normalizedAngle + 15) / 30) % 12;
    setMood(MoodsData[index]);
  }, [angle]);

  useFocusEffect(
    useCallback(() => {
      setMood(MoodsData[0]);
      setVisible(true);
      setShowTags(false);
      setShowQuestion(false);

      return () => {
        // Wait for screen transition to finish
        setTimeout(() => {
          setVisible(false); // Reset
        }, 500);
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {visible && (
        <>
          <Heading text="How's work?" />
          <Instructions />
          <Next setState={setShowTags} />
          <Background mood={mood} showTags={showTags} />
          <Wheel setAngle={setAngle} />
          <Emoji mood={mood} showTags={showTags} />

          {showTags && (
            <>
              <Heading text="How do you feel right now?" angle={angle} />
              <Next setState={setShowQuestion} angle={angle} disabled={selectedTags.length ? false : true} />
              <Tags mood={mood} setSelectedTags={setSelectedTags} selectedTags={selectedTags} angle={angle} />
              <Close setShowTags={setShowTags} angle={angle} />

              {showQuestion && <></>}
            </>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
});
