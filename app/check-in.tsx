import React from "react";
import { useCallback, useEffect, useState, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import Constants from "expo-constants";
import axios from "axios";
import { useAnimatedReaction, useSharedValue } from "react-native-reanimated";
import MoodsData from "data/moods.json";
import { CheckInMoodType } from "data/database";
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
import { getStoredVal, theme } from "utils/helpers";
import { convertToISO } from "utils/dates";

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
  type: string;
};

export default function CheckIn() {
  const db = useSQLiteContext();
  const router = useRouter();
  const colors = theme();
  const rotation = useSharedValue(-360);
  const sliderVal = useSharedValue(50);
  const mood = useSharedValue<MoodType>({ id: 0, color: "", tags: [] });
  const wheelLoadedRef = useRef(false);
  const [showTags, setShowTags] = useState(false);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [foregroundColor, setForegroundColor] = useState("");
  const [selectedMood, setSelectedMood] = useState<MoodType>({ id: 0, color: "", tags: [] });
  const [showStatement, setShowStatement] = useState(false);
  const [competency, setCompetency] = useState<CompetencyType>({ id: 0, statement: "", type: "" });

  const postCheckIn = async (checkIn: CheckInMoodType) => {
    const uuid = await getStoredVal("uuid"); // Check if customer employee
    const send = await getStoredVal("send-check-ins"); // Has agreed to send check-ins to company insights

    if (uuid && send) {
      const today = new Date();

      try {
        // Count today's check-ins
        const rows = await db.getAllAsync(
          `SELECT id FROM check_in_record WHERE DATE(datetime(date, 'localtime')) = ?`,
          [convertToISO(today)]
        );

        if (rows.length < 3) {
          // Save to Supabase
          try {
            await axios.post(
              Constants.appOwnership !== "expo" ? "https://mood.ai/api/check-in" : "http://localhost:3000/api/check-in",
              {
                uuid: uuid,
                value: checkIn,
                date: convertToISO(today),
              }
            );

            // Record check-in locally (users can only send check-in 3 times per day)
            try {
              await db.runAsync("INSERT INTO check_in_record DEFAULT VALUES;");
            } catch (error) {
              console.log(error);
            }
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const submitCheckIn = async () => {
    const name = await getStoredVal("company-name");

    const value: CheckInMoodType = {
      color: mood.value.id,
      tags: selectedTags,
      competency: competency.id,
      statementResponse: competency.type === "neg" ? Math.floor((1 - sliderVal.value) * 100) / 100 : sliderVal.value,
      company: name ? name : undefined,
    };

    try {
      await db.runAsync("INSERT INTO check_ins (mood) VALUES (?) RETURNING *", [JSON.stringify(value)]);
      router.push("chat");
      postCheckIn(value);
    } catch (error) {
      console.log(error);
      alert("An unexpected error has occurred.");
    }
  };

  useAnimatedReaction(
    () => rotation.value,
    (currentValue, previousValue) => {
      if (
        (!wheelLoadedRef.current && currentValue !== previousValue && currentValue >= 0) ||
        (wheelLoadedRef.current && currentValue !== previousValue)
      ) {
        const angle = currentValue < 0 ? currentValue + 360 : currentValue; // Check if negative angle and convert
        const index = Math.floor((angle + 15) / 30) % MoodsData.length; // Snap to 1 of 12 angles (groups of 30 degrees)
        mood.value = MoodsData[index];
        wheelLoadedRef.current = true;
      }
    }
  );

  useFocusEffect(
    useCallback(() => {
      if (mood.value.id) router.dismiss(); // Already checked in. Go back to home
    }, [])
  );

  useEffect(() => {
    setSelectedMood(mood.value);
    setForegroundColor((rotation.value >= 0 && rotation.value < 165) || rotation.value >= 345 ? "black" : "white");
    sliderVal.value = 0.5; // Reset
  }, [showTags]);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
          animation: "none",
          contentStyle: {
            backgroundColor: colors.primary === "white" ? "black" : "white",
          },
        }}
      />

      <Heading text="How's work?" delay={1000} />
      <Instructions />
      <Background showTags={showTags} mood={mood} />
      <Wheel rotation={rotation} />
      <Emoji showTags={showTags} mood={mood} />
      <Next setState={setShowTags} disabled mood={mood} />

      {showTags && (
        <>
          <Heading text="How do you feel right now?" delay={500} color={foregroundColor} />
          <Next setState={setShowStatement} color={foregroundColor} disabled={selectedTags.length ? false : true} />

          <Tags
            tags={selectedMood.tags}
            setSelectedTags={setSelectedTags}
            selectedTags={selectedTags}
            color={foregroundColor}
          />

          {showStatement && (
            <>
              <BackgroundOverlay color={selectedMood.color} sliderVal={sliderVal} competency={competency} />
              <Heading text="Do you agree with this statement?" color={foregroundColor} />
              <Done color={foregroundColor} sliderVal={sliderVal} submitCheckIn={submitCheckIn} />

              <Statement
                moodID={selectedMood.id}
                color={foregroundColor}
                sliderVal={sliderVal}
                competency={competency}
                setCompetency={setCompetency}
                selectedTags={selectedTags}
              />
            </>
          )}

          <Close setShowTags={setShowTags} setShowStatement={setShowStatement} color={foregroundColor} />
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
