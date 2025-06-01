import { useContext } from "react";
import { useCallback, useEffect, useState, useRef } from "react";
import { useColorScheme, View } from "react-native";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { getLocales } from "expo-localization";
import axios from "axios";
import { useAnimatedReaction, useSharedValue } from "react-native-reanimated";
import MoodsData from "data/moods.json";
import { LayoutReadyContext, LayoutReadyContextType } from "context/layout-ready";
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
import { CheckInType, CheckInMoodType } from "types";
import { getStoredVal, removeAccess, removeStoredVal, setStoredVal } from "utils/helpers";
import { convertToISO } from "utils/dates";

export type MoodType = {
  id: number;
  name: string;
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
  const colorScheme = useColorScheme();
  const db = useSQLiteContext();
  const router = useRouter();
  const localization = getLocales();
  const rotation = useSharedValue(-360);
  const sliderVal = useSharedValue(50);
  const mood = useSharedValue<MoodType>({ id: 0, name: "", color: "", tags: [] });
  const wheelLoadedRef = useRef(false);
  const isMountedRef = useRef(true);
  const { setLayoutReady } = useContext<LayoutReadyContextType>(LayoutReadyContext);
  const [showTags, setShowTags] = useState(false);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [foregroundColor, setForegroundColor] = useState("");
  const [selectedMood, setSelectedMood] = useState<MoodType>({ id: 0, name: "", color: "", tags: [] });
  const [showStatement, setShowStatement] = useState(false);
  const [isFirstCheckIn, setIsFirstCheckIn] = useState(false);
  const [categories, setCategories] = useState<number[]>([]);
  const [focusedCategory, setFocusedCategory] = useState(0);
  const [competency, setCompetency] = useState<CompetencyType>({ id: 0, statement: "", type: "" });
  const wheelSize = Device.deviceType === 1 ? 304 : 448; // Smaller on phones

  const longPress = () => {
    router.push({
      pathname: "mood",
      params: {
        name: mood.value.name,
      },
    });

    isMountedRef.current = false;
  };

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

        if (rows.length < 1) {
          // Save to Supabase
          try {
            await axios.post(
              Constants.appOwnership !== "expo"
                ? "https://mood-web-zeta.vercel.app/api/check-in"
                : "http://localhost:3000/api/check-in",
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

            if (focusedCategory) setStoredVal("focused-statement", String(checkIn.competency));
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

  const getCheckInCount = async () => {
    try {
      const rows: CheckInType[] = await db.getAllAsync(`SELECT * FROM check_ins`);
      return rows.length;
    } catch (error) {
      console.log(error);
    }
  };

  const checkFirstCheckIn = async () => {
    const count = await getCheckInCount();
    setIsFirstCheckIn(!count ? true : false);
  };

  const getCategories = async () => {
    const uuid = await getStoredVal("uuid");
    const send = await getStoredVal("send-check-ins");

    if (uuid && send) {
      try {
        const response = await axios.post(
          !__DEV__ ? `https://mood-web-zeta.vercel.app/api/categories` : `http://localhost:3000/api/categories`,
          {
            uuid: uuid,
          }
        );

        setCategories(response.data.categories);
        setFocusedCategory(response.data.focused);
        if (!response.data.focused) removeStoredVal("focused-statement");
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          // User doesn't exist
          removeAccess();
          alert("Access denied.");
        }

        console.log(error);
      }
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

  useEffect(() => {
    setSelectedMood(mood.value);
    setForegroundColor((rotation.value >= 0 && rotation.value < 165) || rotation.value >= 345 ? "black" : "white");
    sliderVal.value = 0.5; // Reset
  }, [showTags]);

  useEffect(() => {
    setLayoutReady(true); // Hide splash screen
    getCategories();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (mood.value.id && isMountedRef.current) router.dismiss(); // Already checked in. Go back to home
      checkFirstCheckIn();
      isMountedRef.current = true;
    }, [])
  );

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Stack.Screen
        options={{
          headerShown: false,
          animation: "none",
          contentStyle: {
            backgroundColor: colorScheme === "light" ? "white" : "black",
          },
        }}
      />

      <Heading
        text="How's work?"
        wheelSize={wheelSize}
        description={
          isFirstCheckIn
            ? `Start your first check-in by choosing a mood ${
                localization[0].languageTag === "en-US" ? "color" : "colour"
              }`
            : ""
        }
        delay={1000}
      />

      <Instructions wheelSize={wheelSize} />
      <Background showTags={showTags} mood={mood} />
      <Wheel rotation={rotation} longPress={longPress} wheelSize={wheelSize} />
      <Emoji showTags={showTags} mood={mood} wheelSize={wheelSize} />
      <Next setState={setShowTags} disabled mood={mood} wheelSize={wheelSize} />

      {showTags && (
        <>
          <Heading
            text="How do you feel right now?"
            wheelSize={wheelSize}
            description={isFirstCheckIn ? "Select at least one word" : ""}
            delay={500}
            foreground={foregroundColor}
          />

          <Next
            setState={setShowStatement}
            foreground={foregroundColor}
            disabled={selectedTags.length ? false : true}
            wheelSize={wheelSize}
          />

          <Tags
            tags={selectedMood.tags}
            setSelectedTags={setSelectedTags}
            selectedTags={selectedTags}
            color={foregroundColor}
          />

          {showStatement && (
            <>
              <BackgroundOverlay color={selectedMood.color} sliderVal={sliderVal} competency={competency} />
              <Heading wheelSize={wheelSize} text="Do you agree with this statement?" foreground={foregroundColor} />
              <Done color={foregroundColor} sliderVal={sliderVal} submitCheckIn={submitCheckIn} />

              <Statement
                mood={selectedMood}
                color={foregroundColor}
                sliderVal={sliderVal}
                competency={competency}
                setCompetency={setCompetency}
                selectedTags={selectedTags}
                categories={categories}
                focusedCategory={focusedCategory}
                setFocusedCategory={setFocusedCategory}
              />
            </>
          )}

          <Close setShowTags={setShowTags} setShowStatement={setShowStatement} foreground={foregroundColor} />
        </>
      )}
    </View>
  );
}
