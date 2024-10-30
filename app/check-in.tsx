import { useCallback, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useAnimatedReaction, useSharedValue } from "react-native-reanimated";
import MoodsData from "data/moods.json";
import Wheel from "components/check-in/Wheel";
import Emoji from "components/check-in/Emoji";
import Background from "components/check-in/Background";
import Instructions from "components/check-in/Instructions";
import Heading from "components/check-in/Heading";
import Next from "components/check-in/Next";
import Close from "components/check-in/Close";
import Tags from "components/check-in/Tags";
import Done from "components/check-in/Done";
import Statement from "components/check-in/Statement";
import BackgroundOverlay from "components/check-in/BackgroundOverlay";
import Background2 from "components/check-in/Background2";

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

export type CompetencyType = {
  id: number;
  statement: string;
};

export default function CheckIn() {
  const db = useSQLiteContext();
  const router = useRouter();
  const rotation = useSharedValue(-360);
  const sliderVal = useSharedValue(50);
  const mood = useSharedValue<MoodType>({ id: 0, color: "", tags: [] });
  const foreground = useSharedValue("");
  const [visible, setVisible] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [showStatement, setShowStatement] = useState(false);
  const [competency, setCompetency] = useState<CompetencyType>({ id: 0, statement: "" });

  const submitCheckIn = async () => {
    try {
      const checkInMood = {
        color: mood.value.id,
        tags: selectedTags,
        competency: competency.id,
        statementResponse: sliderVal.value,
      };

      await db.runAsync(`INSERT INTO check_ins (mood) VALUES (?)`, [JSON.stringify(checkInMood)]);
    } catch (error) {
      console.log(error);
    }

    router.push("chat");
  };

  useAnimatedReaction(
    () => rotation.value,
    (currentValue, previousValue) => {
      if (currentValue !== previousValue && currentValue >= 0 && visible) {
        const index = Math.floor((currentValue + 15) / 30) % MoodsData.length; // Snap to 1 of 12 angles (groups of 30 degrees)
        mood.value = MoodsData[index];
        foreground.value = currentValue >= 15 && currentValue < 195 ? "black" : "white";
      }
    }
  );

  useFocusEffect(
    useCallback(() => {
      if (mood.value.id) {
        router.dismiss(); // Already checked in. Go back to home
      }

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
      <Stack.Screen options={{ headerShown: false, animation: "none" }} />

      {visible && (
        <>
          <Heading text="How's work?" />
          <Instructions />
          <Next setState={setShowTags} />
          <Background showTags={showTags} mood={mood} />
          <Wheel rotation={rotation} />
          <Emoji showTags={showTags} mood={mood} />

          {showTags && (
            <>
              <Heading text="How do you feel right now?" color={foreground.value} />

              <Next
                setState={setShowStatement}
                color={foreground.value}
                disabled={selectedTags.length ? false : true}
              />

              <Tags
                tags={mood.value.tags}
                setSelectedTags={setSelectedTags}
                selectedTags={selectedTags}
                color={foreground.value}
              />

              {showStatement && (
                <>
                  <Background2 color={mood.value.color} />
                  <BackgroundOverlay sliderVal={sliderVal} />
                  <Heading text="Do you agree with this statement?" color={foreground.value} />
                  <Done color={foreground.value} sliderVal={sliderVal} submitCheckIn={submitCheckIn} />

                  <Statement
                    moodColor={mood.value.color}
                    color={foreground.value}
                    sliderVal={sliderVal}
                    competency={competency}
                    setCompetency={setCompetency}
                    selectedTags={selectedTags}
                  />
                </>
              )}

              <Close setShowTags={setShowTags} setShowStatement={setShowStatement} color={foreground.value} />
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
