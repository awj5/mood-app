import { useContext } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { useRouter } from "expo-router";
import * as Device from "expo-device";
import { SharedValue } from "react-native-reanimated";
import axios from "axios";
import Next from "./Next";
import { FocusedCategoryContext, FocusedCategoryContextType } from "context/focused-category";
import { CompetencyType, MoodType } from "app/check-in";
import { CheckInMoodType } from "types";
import { getStoredVal, setStoredVal } from "utils/helpers";
import { convertToISO } from "utils/dates";

type DoneProps = {
  foreground: string;
  sliderVal: SharedValue<number>;
  wheelSize: number;
  selectedTags: number[];
  mood: MoodType;
  busyness: number;
  competency: CompetencyType;
};

export default function Done(props: DoneProps) {
  const db = useSQLiteContext();
  const router = useRouter();
  const { focusedCategory } = useContext<FocusedCategoryContextType>(FocusedCategoryContext);
  const isSimulator = Device.isDevice === false;

  const postCheckIn = async (checkIn: CheckInMoodType) => {
    const uuid = await getStoredVal("uuid"); // Check if customer employee
    const send = await getStoredVal("send-check-ins"); // Has agreed to send check-ins to company insights

    if (uuid && send) {
      const today = new Date();

      try {
        // Count today's recorded check-ins
        const rows = await db.getAllAsync(
          `SELECT id FROM check_in_record WHERE DATE(datetime(date, 'localtime')) = ?`,
          [convertToISO(today)]
        );

        if (rows.length < 1) {
          // Save to Supabase
          try {
            await axios.post(
              !isSimulator ? "https://mood-web-zeta.vercel.app/api/check-in" : "http://localhost:3000/api/check-in",
              {
                uuid: uuid,
                value: checkIn,
                date: convertToISO(today),
              }
            );

            await db.runAsync("INSERT INTO check_in_record DEFAULT VALUES;"); // Record check-in locally (users can only send 1 check-in per day to company insights)
            if (focusedCategory) setStoredVal("focused-statement", String(checkIn.competency));
          } catch (error) {
            console.error("Failed to save check-in:", error);
          }
        }
      } catch (error) {
        console.error("Failed to query check-ins:", error);
      }
    }
  };

  const submitCheckIn = async () => {
    const name = await getStoredVal("company-name");
    const manualDate = false; // Use for staging check-ins

    const value: CheckInMoodType = {
      color: props.mood.id,
      busyness: props.busyness,
      tags: props.selectedTags,
      competency: props.competency.id,
      statementResponse:
        props.competency.type === "neg" ? Math.floor((1 - props.sliderVal.value) * 100) / 100 : props.sliderVal.value,
      company: name ? name : undefined,
    };

    // Save check-in to local DB
    try {
      if (manualDate) {
        const date = "2025-08-12 09:00:00"; // UTC so make time in morning to show same day as Sydney

        await db.runAsync("INSERT INTO check_ins (date, mood) VALUES (?, ?) RETURNING *", [
          date,
          JSON.stringify(value),
        ]);
      } else {
        await db.runAsync("INSERT INTO check_ins (mood) VALUES (?) RETURNING *", [JSON.stringify(value)]);
      }

      router.push("chat");
      postCheckIn(value);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Next
      func={submitCheckIn}
      delay={500}
      foreground={props.foreground}
      wheelSize={props.wheelSize}
      sliderVal={props.sliderVal}
      disabled
    />
  );
}
