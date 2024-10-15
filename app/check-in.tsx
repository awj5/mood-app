import { useCallback, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Stack, useFocusEffect } from "expo-router";
import EmotionData from "data/emotions.json";
import Wheel from "components/check-in/Wheel";
import Emoji from "components/check-in/Emoji";
import Background from "components/check-in/Background";
import Instructions from "components/check-in/Instructions";
import Heading from "components/check-in/Heading";
import Next from "components/check-in/Next";
import Close from "components/check-in/Close";
import ListHeading from "components/check-in/ListHeading";
import List from "components/check-in/List";
import Done from "components/check-in/Done";

export type EmotionType = {
  angle: number;
  color: string;
  emoji: string;
  words: string[];
};

export default function CheckIn() {
  const [angle, setAngle] = useState(0);
  const [emotion, setEmotion] = useState<EmotionType>(EmotionData[0]);
  const [visible, setVisible] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [words, setWords] = useState<number[]>([]);

  useEffect(() => {
    // Snap to 1 of 12 angles (groups of 30 degrees)
    if ((angle >= 345 && angle <= 360 && emotion.angle !== 0) || (angle >= 0 && angle < 15 && emotion.angle !== 0)) {
      setEmotion(EmotionData[0]);
    } else if (angle >= 15 && angle < 45 && emotion.angle !== 30) {
      setEmotion(EmotionData[1]);
    } else if (angle >= 45 && angle < 75 && emotion.angle !== 60) {
      setEmotion(EmotionData[2]);
    } else if (angle >= 75 && angle < 105 && emotion.angle !== 90) {
      setEmotion(EmotionData[3]);
    } else if (angle >= 105 && angle < 135 && emotion.angle !== 120) {
      setEmotion(EmotionData[4]);
    } else if (angle >= 135 && angle < 165 && emotion.angle !== 150) {
      setEmotion(EmotionData[5]);
    } else if (angle >= 165 && angle < 195 && emotion.angle !== 180) {
      setEmotion(EmotionData[6]);
    } else if (angle >= 195 && angle < 225 && emotion.angle !== 210) {
      setEmotion(EmotionData[7]);
    } else if (angle >= 225 && angle < 255 && emotion.angle !== 240) {
      setEmotion(EmotionData[8]);
    } else if (angle >= 255 && angle < 285 && emotion.angle !== 270) {
      setEmotion(EmotionData[9]);
    } else if (angle >= 285 && angle < 315 && emotion.angle !== 300) {
      setEmotion(EmotionData[10]);
    } else if (angle >= 315 && angle < 345 && emotion.angle !== 330) {
      setEmotion(EmotionData[11]);
    }
  }, [angle]);

  useFocusEffect(
    useCallback(() => {
      setEmotion(EmotionData[0]);
      setVisible(true);
      setShowTags(false);

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
          <Heading />
          <Instructions />
          <Next setShowTags={setShowTags} />
          <Background emotion={emotion} showTags={showTags} />
          <Wheel setAngle={setAngle} />
          <Emoji emotion={emotion} showTags={showTags} />

          {showTags && (
            <>
              <ListHeading angle={emotion.angle} />
              <Done angle={emotion.angle} words={words} />
              <List emotion={emotion} words={words} setWords={setWords} />
              <Close setShowList={setShowTags} angle={emotion.angle} />
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
  },
});
