import { useContext } from "react";
import { useCallback, useEffect, useState, useRef } from "react";
import { useColorScheme, View } from "react-native";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import * as Device from "expo-device";
import { getLocales } from "expo-localization";
import axios from "axios";
import { useAnimatedReaction, useSharedValue } from "react-native-reanimated";
import MoodsData from "data/moods.json";
import { LayoutReadyContext, LayoutReadyContextType } from "context/layout-ready";
import { FocusedCategoryContext, FocusedCategoryContextType } from "context/focused-category";
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
import { CheckInType } from "types";
import { getStoredVal, removeAccess, removeStoredVal } from "utils/helpers";

export type MoodType = {
  id: number;
  name: string;
  color: string;
  tags: number[];
  secondaryTags: number[];
  summary: string;
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
  const wheelMood = useSharedValue<MoodType>({ id: 0, name: "", color: "", tags: [], secondaryTags: [], summary: "" });
  const wheelActivatedRef = useRef(false);
  const isFocusedRef = useRef(true);
  const { setLayoutReady } = useContext<LayoutReadyContextType>(LayoutReadyContext);
  const { setFocusedCategory } = useContext<FocusedCategoryContextType>(FocusedCategoryContext);
  const [showTags, setShowTags] = useState(false);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [busyness, setBusyness] = useState(1);
  const [foregroundColor, setForegroundColor] = useState("");
  const [selectedMood, setSelectedMood] = useState<MoodType>({
    id: 0,
    name: "",
    color: "",
    tags: [],
    secondaryTags: [],
    summary: "",
  });
  const [showStatement, setShowStatement] = useState(false);
  const [isFirstCheckIn, setIsFirstCheckIn] = useState(false);
  const [categories, setCategories] = useState<number[]>([]);
  const [competency, setCompetency] = useState<CompetencyType>({ id: 0, statement: "", type: "" });
  const wheelSize = Device.deviceType === 1 ? 304 : 448; // Smaller on phones
  const isSimulator = Device.isDevice === false;

  const colorPress = () => {
    router.push({
      pathname: "mood",
      params: {
        name: wheelMood.value.name,
      },
    });

    isFocusedRef.current = false;
  };

  const getTotalCheckInCount = async () => {
    try {
      const rows: CheckInType[] = await db.getAllAsync(`SELECT * FROM check_ins`);
      return rows.length;
    } catch (error) {
      console.error(error);
    }
  };

  const getCategories = async () => {
    setFocusedCategory(0); // Reset
    const uuid = await getStoredVal("uuid");

    if (uuid) {
      try {
        const response = await axios.post(
          !isSimulator ? `https://mood-web-zeta.vercel.app/api/categories` : `http://localhost:3000/api/categories`,
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

        console.error(error);
      }
    }
  };

  useAnimatedReaction(
    () => rotation.value,
    (currentVal, previousVal) => {
      if (
        (!wheelActivatedRef.current && currentVal !== previousVal && currentVal >= 0) ||
        (wheelActivatedRef.current && currentVal !== previousVal)
      ) {
        const angle = currentVal < 0 ? currentVal + 360 : currentVal; // Check if negative angle and convert
        const index = Math.floor((angle + 15) / 30) % MoodsData.length; // Snap to 1 of 12 angles (groups of 30 degrees)
        wheelMood.value = MoodsData[index];
        wheelActivatedRef.current = true;
      }
    }
  );

  useEffect(() => {
    setSelectedMood(wheelMood.value);
    setForegroundColor((rotation.value >= 0 && rotation.value < 165) || rotation.value >= 345 ? "black" : "white");
    sliderVal.value = 0.5; // Reset
  }, [showTags]);

  useEffect(() => {
    (async () => {
      const count = await getTotalCheckInCount();
      setIsFirstCheckIn(!count);
    })();

    setLayoutReady(true); // Hide splash screen
    getCategories();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (wheelMood.value.id && isFocusedRef.current) router.dismiss(); // Already checked in. Go back to home
      isFocusedRef.current = true;
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
        text="How do you feel?"
        wheelSize={wheelSize}
        description={`Start your ${isFirstCheckIn ? "first " : ""}check-in by moving the ${
          localization[0].languageTag === "en-US" ? "color" : "colour"
        } wheel to choose your mood`}
        delay={1000}
        mood={wheelMood}
        colorPress={colorPress}
      />

      {/* <Instructions wheelSize={wheelSize} /> */}
      <Background showTags={showTags} mood={wheelMood} />
      <Wheel rotation={rotation} colorPress={colorPress} wheelSize={wheelSize} />
      <Emoji showTags={showTags} mood={wheelMood} wheelSize={wheelSize} />
      <Next setState={setShowTags} delay={1500} disabled mood={wheelMood} wheelSize={wheelSize} />

      {showTags && (
        <>
          <Heading
            text="How's work?"
            wheelSize={wheelSize}
            description="Select your workload and words that describe work right now"
            delay={500}
            foreground={foregroundColor}
          />

          <Next
            setState={setShowStatement}
            delay={1500}
            foreground={foregroundColor}
            disabled={selectedTags.length ? false : true}
            wheelSize={wheelSize}
          />

          <Tags
            tags={selectedMood.tags}
            secondaryTags={selectedMood.secondaryTags}
            setSelectedTags={setSelectedTags}
            selectedTags={selectedTags}
            foreground={foregroundColor}
            busyness={busyness}
            setBusyness={setBusyness}
          />

          {showStatement && (
            <>
              <BackgroundOverlay color={selectedMood.color} sliderVal={sliderVal} competency={competency} />
              <Heading wheelSize={wheelSize} text="Do you agree with this statement?" foreground={foregroundColor} />

              <Done
                foreground={foregroundColor}
                sliderVal={sliderVal}
                wheelSize={wheelSize}
                selectedTags={selectedTags}
                mood={selectedMood}
                busyness={busyness}
                competency={competency}
              />

              <Statement
                mood={selectedMood}
                foreground={foregroundColor}
                sliderVal={sliderVal}
                competency={competency}
                setCompetency={setCompetency}
                selectedTags={selectedTags}
                categories={categories}
              />
            </>
          )}

          <Close
            setShowTags={setShowTags}
            setShowStatement={setShowStatement}
            setSelectedTags={setSelectedTags}
            foreground={foregroundColor}
          />
        </>
      )}
    </View>
  );
}
