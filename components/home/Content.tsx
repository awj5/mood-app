import React, { useCallback, useEffect } from "react";
import { useContext, useRef, useState } from "react";
import { ScrollView, View, useColorScheme } from "react-native";
import * as Device from "expo-device";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { Easing, FadeIn } from "react-native-reanimated";
import { Sparkles, ChartSpline } from "lucide-react-native";
import { HomeDatesContext, HomeDatesContextType } from "context/home-dates";
import Insights from "./content/Insights";
import Quote from "../Quote";
import Article from "../Article";
import Fact from "./content/Fact";
import Song from "../Song";
import Gifs from "../Gifs";
import Burnout from "./content/Burnout";
import Journal from "./content/Journal";
import Stats from "./content/Stats";
import Button from "components/Button";
import NoCheckIns from "./content/NoCheckIns";
import WordCloud from "components/WordCloud";
import { CheckInType } from "types";
import { shuffleArray, getStoredVal, getTheme } from "utils/helpers";

type ContentProps = {
  checkIns: CheckInType[] | undefined;
  noCheckInToday: boolean;
};

export default function Content(props: ContentProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const scrollViewRef = useRef<ScrollView>(null);
  const { homeDates } = useContext<HomeDatesContextType>(HomeDatesContext);
  const [widgets, setWidgets] = useState<React.ReactNode>();
  const [hasAccess, setHasAccess] = useState(false);
  const [company, setCompany] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const now = Date.now(); // Use to make unique keys
    scrollViewRef.current?.scrollTo({ y: 0, animated: false }); // Scroll to top

    // Add widgets
    if (props.checkIns?.length) {
      const largeWidgets = [
        <Quote checkIns={props.checkIns} dates={homeDates} />,
        <Gifs checkIns={props.checkIns} dates={homeDates} />,
        <Song checkIns={props.checkIns} dates={homeDates} />,
        <WordCloud checkIns={props.checkIns} />,
      ];

      const smallWidgets = [
        <Article checkIns={props.checkIns} dates={homeDates} />,
        <Fact checkIns={props.checkIns} dates={homeDates} />,
      ];

      const shuffledLarge = shuffleArray(largeWidgets);
      const shuffledSmall = shuffleArray(smallWidgets);
      const ordered = [];
      let index = 0;

      // Randomise order
      while (shuffledLarge.length || shuffledSmall.length) {
        const pickLarge = shuffledLarge.length ? Math.random() > 0.5 : false; // 50% chance of large

        if (pickLarge) {
          ordered.push(React.cloneElement(shuffledLarge.pop(), { key: now + index }));
          index++;
        } else if (shuffledSmall.length > 1) {
          // Two small widgets available to add
          let double = (
            <View style={{ gap: theme.spacing.base, flexDirection: "row" }} key={now + index}>
              {shuffledSmall.pop()}
              {shuffledSmall.pop()}
            </View>
          );

          ordered.push(double);
          index++;
        } else if (!shuffledLarge.length) {
          break; // Single small widget cannot be added
        }
      }

      setWidgets(<>{ordered}</>); // Add widgets to DOM
    } else {
      setWidgets([]); // Clear
    }
  }, [JSON.stringify(props.checkIns)]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const uuid = await getStoredVal("uuid"); // Check if customer employee
        const proID = await getStoredVal("pro-id"); // Check if pro subscriber
        const companyName = await getStoredVal("company-name"); // Get company name
        const send = await getStoredVal("send-check-ins"); // Has agreed to send check-ins to company insights
        const admin = await getStoredVal("admin"); // Check if user is admin of their company (can bypass check-in)
        setHasAccess(!!(uuid || proID));
        setCompany(companyName && send ? companyName : "");
        setIsAdmin(admin === "true" ? true : false);
      })();
    }, [homeDates])
  );

  return (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={{
        paddingHorizontal: theme.spacing.base,
        paddingBottom: theme.spacing.base * 2 + insets.bottom + (Device.deviceType === 1 ? 72 : 96),
        gap: theme.spacing.base,
        width: "100%",
        maxWidth: 768,
        margin: "auto",
      }}
    >
      {props.checkIns?.length ? (
        <>
          {hasAccess ? (
            <>
              <Insights checkIns={props.checkIns} dates={homeDates} />
              <Stats checkIns={props.checkIns} dates={homeDates} />

              <View style={{ gap: theme.spacing.base, flexDirection: "row" }}>
                <Burnout checkIns={props.checkIns} />
                <Journal checkIns={props.checkIns} />
              </View>

              {((company && !props.noCheckInToday) || (company && isAdmin)) && (
                <View style={{ width: "100%", paddingHorizontal: theme.spacing.base }}>
                  <Button route="company" large icon={ChartSpline}>
                    {`${company} insights`}
                  </Button>
                </View>
              )}
            </>
          ) : (
            <Animated.View
              entering={FadeIn.duration(300).easing(Easing.in(Easing.cubic))}
              style={{ width: "100%", marginTop: theme.spacing.base, paddingHorizontal: theme.spacing.base }}
            >
              <Button route="pro" icon={Sparkles} gradient large>
                Generate AI insights with Pro
              </Button>
            </Animated.View>
          )}

          {widgets}
        </>
      ) : (
        props.checkIns !== undefined && <NoCheckIns company={company} isAdmin={isAdmin} />
      )}
    </ScrollView>
  );
}
