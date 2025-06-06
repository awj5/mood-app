import { useSQLiteContext } from "expo-sqlite";
import { useRouter } from "expo-router";
import * as Device from "expo-device";
import { SharedValue } from "react-native-reanimated";
import axios from "axios";
import Next from "./Next";
import { CompetencyType, MoodType } from "app/check-in";
import { CheckInMoodType } from "types";
import { getStoredVal, setStoredVal } from "utils/helpers";
import { convertToISO } from "utils/dates";

type DoneProps = {
  foreground: string;
  sliderVal: SharedValue<number>;
  wheelSize: number;
  focusedCategory: number;
  selectedTags: number[];
  mood: MoodType;
  competency: CompetencyType;
};

export default function Done(props: DoneProps) {
  const db = useSQLiteContext();
  const router = useRouter();
  const isSimulator = Device.isDevice === false;

  const postCheckIn = async (checkIn: CheckInMoodType) => {
    const uuid = await getStoredVal("uuid"); // Check if customer employee
    const deviceUUID = await getStoredVal("device-uuid"); // Unique device UUID
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
                deviceUUID: deviceUUID,
                value: checkIn,
                date: convertToISO(today),
              }
            );

            // Record check-in locally (users can only send 1 check-in per day to cpmpany insights)
            try {
              await db.runAsync("INSERT INTO check_in_record DEFAULT VALUES;");
            } catch (error) {
              console.error(error);
            }

            if (props.focusedCategory) setStoredVal("focused-statement", String(checkIn.competency));
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const submitCheckIn = async () => {
    const name = await getStoredVal("company-name");
    const manualDate = false; // Use for staging check-ins

    const value: CheckInMoodType = {
      color: props.mood.id,
      tags: props.selectedTags,
      competency: props.competency.id,
      statementResponse:
        props.competency.type === "neg" ? Math.floor((1 - props.sliderVal.value) * 100) / 100 : props.sliderVal.value,
      company: name ? name : undefined,
    };

    // Save check-in to local DB
    try {
      if (manualDate) {
        const date = "2025-06-06 09:00:00"; // UTC so make time in morning to show same day as Sydney

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
