import { useCallback, useEffect, useRef, useState } from "react";
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
import Background2 from "components/check-in/Background2";
import Done from "components/check-in/Done";
import Statement from "components/check-in/Statement";

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
  const [showStatement, setShowStatement] = useState(false);
  const [statement, setStatement] = useState("");
  const [statementValueSelected, setStatementValueSelected] = useState(false);
  const statementValue = useRef(0);
  const [foreground, setForeground] = useState("");
  const [background, setBackground] = useState("");

  useEffect(() => {
    // Snap to 1 of 12 angles (groups of 30 degrees)
    if (angle >= 15 && angle < 45) {
      setMood(MoodsData[1]);
    } else if (angle >= 45 && angle < 75) {
      setMood(MoodsData[2]);
    } else if (angle >= 75 && angle < 105) {
      setMood(MoodsData[3]);
    } else if (angle >= 105 && angle < 135) {
      setMood(MoodsData[4]);
    } else if (angle >= 135 && angle < 165) {
      setMood(MoodsData[5]);
    } else if (angle >= 165 && angle < 195) {
      setMood(MoodsData[6]);
    } else if (angle >= 195 && angle < 225) {
      setMood(MoodsData[7]);
    } else if (angle >= 225 && angle < 255) {
      setMood(MoodsData[8]);
    } else if (angle >= 255 && angle < 285) {
      setMood(MoodsData[9]);
    } else if (angle >= 285 && angle < 315) {
      setMood(MoodsData[10]);
    } else if (angle >= 315 && angle < 345) {
      setMood(MoodsData[11]);
    } else {
      setMood(MoodsData[0]);
    }

    setForeground(angle >= 15 && angle < 195 ? "white" : "black");
    setBackground(angle >= 15 && angle < 195 ? "black" : "white");
  }, [angle]);

  useFocusEffect(
    useCallback(() => {
      setMood(MoodsData[0]);
      setVisible(true);
      setShowTags(false);
      setShowStatement(false);

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
              <Heading text="How do you feel right now?" color={foreground} />
              <Next setState={setShowStatement} color={foreground} disabled={selectedTags.length ? false : true} />
              <Tags mood={mood} setSelectedTags={setSelectedTags} selectedTags={selectedTags} color={foreground} />
              <Close setState={setShowTags} color={foreground} />

              {showStatement && (
                <>
                  <Background2 color={foreground} />
                  <Heading text="Do you agree with this statement?" color={background} />

                  <Done
                    color={background}
                    statementValue={statementValue}
                    disabled={!statementValueSelected ? true : false}
                  />

                  <Statement
                    mood={mood}
                    text={statement}
                    color={background}
                    statementValue={statementValue}
                    setStatementValueSelected={setStatementValueSelected}
                    setStatement={setStatement}
                    selectedTags={selectedTags}
                  />

                  <Close setState={setShowStatement} color={background} />
                </>
              )}
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
