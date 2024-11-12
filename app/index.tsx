import { useEffect } from "react";
import { View, StyleSheet, Pressable, ScrollView, Text } from "react-native";
import { SplashScreen, Stack, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import * as Device from "expo-device";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Settings, Download } from "lucide-react-native";
import BigButton from "components/BigButton";
import Calendar from "components/home/Calendar";
import HeaderLeft from "components/home/HeaderLeft";
import Bg from "components/home/Bg";
import { pressedDefault, theme, convertToISO } from "utils/helpers";

export default function Home() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const colors = theme();
  const router = useRouter();
  const db = useSQLiteContext();
  const iconSize = Device.deviceType !== 1 ? 32 : 24;
  const iconStroke = Device.deviceType !== 1 ? 2.5 : 2;
  const edgePadding = Device.deviceType !== 1 ? 24 : 16;

  const verifyCheckIn = async () => {
    // Redirect if user hasn't checked-in today
    try {
      const today = new Date();

      // Check for check-in today (date column converted to local)
      const query = `
    SELECT * FROM check_ins
    WHERE DATE(datetime(date, 'localtime')) = ?
  `;

      const row = await db.getFirstAsync(query, [convertToISO(today)]);
      if (!row) router.push("check-in"); // Redirect
    } catch (error) {
      console.log(error);
    }

    SplashScreen.hideAsync();
  };

  useEffect(() => {
    verifyCheckIn();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerTransparent: true,
          headerLeft: () => <HeaderLeft />,
          headerRight: () => (
            <View style={{ flexDirection: "row", gap: Device.deviceType !== 1 ? 24 : 20 }}>
              <Pressable
                onPress={() => alert("Coming soon")}
                style={({ pressed }) => pressedDefault(pressed)}
                hitSlop={8}
              >
                <Download color={colors.primary} size={iconSize} absoluteStrokeWidth strokeWidth={iconStroke} />
              </Pressable>

              <Pressable
                onPress={() => alert("Coming soon")}
                style={({ pressed }) => pressedDefault(pressed)}
                hitSlop={8}
              >
                <Settings color={colors.primary} size={iconSize} absoluteStrokeWidth strokeWidth={iconStroke} />
              </Pressable>
            </View>
          ),
        }}
      />

      <Bg />

      <View style={{ flex: 1, marginTop: headerHeight }}>
        <Calendar />

        <ScrollView>
          <View
            style={{
              paddingHorizontal: edgePadding,
              paddingBottom: edgePadding * 2 + insets.bottom + (Device.deviceType !== 1 ? 96 : 72),
            }}
          >
            <Text style={{ color: colors.primary, display: "none" }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus viverra ligula at eros ullamcorper, id
              fermentum turpis facilisis. Nulla facilisi. Ut semper est a neque pretium, id fermentum mauris vestibulum.
              Vivamus porttitor nisl eget diam consequat, nec efficitur est tristique. Integer ornare nibh et libero
              porttitor, sed suscipit purus pulvinar. Nam in tortor at risus vestibulum tincidunt. Nullam sagittis
              consectetur ante, at egestas nisi volutpat eget. Cras bibendum, ex at dictum finibus, turpis libero
              ultricies velit, non varius lorem ipsum ut nisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Phasellus viverra ligula at eros ullamcorper, id fermentum turpis facilisis. Nulla facilisi. Ut semper est
              a neque pretium, id fermentum mauris vestibulum. Vivamus porttitor nisl eget diam consequat, nec efficitur
              est tristique. Integer ornare nibh et libero porttitor, sed suscipit purus pulvinar. Nam in tortor at
              risus vestibulum tincidunt. Nullam sagittis consectetur ante, at egestas nisi volutpat eget. Cras
              bibendum, ex at dictum finibus, turpis libero ultricies velit, non varius lorem ipsum ut nisi. Lorem ipsum
              dolor sit amet, consectetur adipiscing elit. Phasellus viverra ligula at eros ullamcorper, id fermentum
              turpis facilisis. Nulla facilisi. Ut semper est a neque pretium, id fermentum mauris vestibulum. Vivamus
              porttitor nisl eget diam consequat, nec efficitur est tristique. Integer ornare nibh et libero porttitor,
              sed suscipit purus pulvinar. Nam in tortor at risus vestibulum tincidunt. Nullam sagittis consectetur
              ante, at egestas nisi volutpat eget. Cras bibendum, ex at dictum finibus, turpis libero ultricies velit,
              non varius lorem ipsum ut nisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus viverra
              ligula at eros ullamcorper, id fermentum turpis facilisis. Nulla facilisi. Ut semper est a neque pretium,
              id fermentum mauris vestibulum. Vivamus porttitor nisl eget diam consequat, nec efficitur est tristique.
              Integer ornare nibh et libero porttitor, sed suscipit purus pulvinar. Nam in tortor at risus vestibulum
              tincidunt. Nullam sagittis consectetur ante, at egestas nisi volutpat eget. Cras bibendum, ex at dictum
              finibus, turpis libero ultricies velit, non varius lorem ipsum ut nisi. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit. Phasellus viverra ligula at eros ullamcorper, id fermentum turpis facilisis.
              Nulla facilisi. Ut semper est a neque pretium, id fermentum mauris vestibulum. Vivamus porttitor nisl eget
              diam consequat, nec efficitur est tristique. Integer ornare nibh et libero porttitor, sed suscipit purus
              pulvinar. Nam in tortor at risus vestibulum tincidunt. Nullam sagittis consectetur ante, at egestas nisi
              volutpat eget. Cras bibendum, ex at dictum finibus, turpis libero ultricies velit, non varius lorem ipsum
              ut nisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus viverra ligula at eros
              ullamcorper, id fermentum turpis facilisis. Nulla facilisi. Ut semper est a neque pretium, id fermentum
              mauris vestibulum. Vivamus porttitor nisl eget diam consequat, nec efficitur est tristique. Integer ornare
              nibh et libero porttitor, sed suscipit purus pulvinar. Nam in tortor at risus vestibulum tincidunt. Nullam
              sagittis consectetur ante, at egestas nisi volutpat eget. Cras bibendum, ex at dictum finibus, turpis
              libero ultricies velit, non varius lorem ipsum ut nisi. Lorem ipsum dolor sit amet, consectetur adipiscing
              elit. Phasellus viverra ligula at eros ullamcorper, id fermentum turpis facilisis. Nulla facilisi. Ut
              semper est a neque pretium, id fermentum mauris vestibulum. Vivamus porttitor nisl eget diam consequat,
              nec efficitur est tristique. Integer ornare nibh et libero porttitor, sed suscipit purus pulvinar. Nam in
              tortor at risus vestibulum tincidunt. Nullam sagittis consectetur ante, at egestas nisi volutpat eget.
              Cras bibendum, ex at dictum finibus, turpis libero ultricies velit, non varius lorem ipsum ut nisi. Lorem
              ipsum dolor sit amet, consectetur adipiscing elit. Phasellus viverra ligula at eros ullamcorper, id
              fermentum turpis facilisis. Nulla facilisi. Ut semper est a neque pretium, id fermentum mauris vestibulum.
              Vivamus porttitor nisl eget diam consequat, nec efficitur est tristique. Integer ornare nibh et libero
              porttitor, sed suscipit purus pulvinar. Nam in tortor at risus vestibulum tincidunt. Nullam sagittis
              consectetur ante, at egestas nisi volutpat eget. Cras bibendum, ex at dictum finibus, turpis libero
              ultricies velit, non varius lorem ipsum ut nisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Phasellus viverra ligula at eros ullamcorper, id fermentum turpis facilisis. Nulla facilisi. Ut semper est
              a neque pretium, id fermentum mauris vestibulum. Vivamus porttitor nisl eget diam consequat, nec efficitur
              est tristique. Integer ornare nibh et libero porttitor, sed suscipit purus pulvinar. Nam in tortor at
              risus vestibulum tincidunt. Nullam sagittis consectetur ante, at egestas nisi volutpat eget. Cras
              bibendum, ex at dictum finibus, turpis libero ultricies velit, non varius lorem ipsum ut nisi. Lorem ipsum
              dolor sit amet, consectetur adipiscing elit. Phasellus viverra ligula at eros ullamcorper, id fermentum
              turpis facilisis. Nulla facilisi. Ut semper est a neque pretium, id fermentum mauris vestibulum. Vivamus
              porttitor nisl eget diam consequat, nec efficitur est tristique. Integer ornare nibh et libero porttitor,
              sed suscipit purus pulvinar. Nam in tortor at risus vestibulum tincidunt. Nullam sagittis consectetur
              ante, at egestas nisi volutpat eget. Cras bibendum, ex at dictum finibus, turpis libero ultricies velit,
              non varius lorem ipsum ut nisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus viverra
              ligula at eros ullamcorper, id fermentum turpis facilisis. Nulla facilisi. Ut semper est a neque pretium,
              id fermentum mauris vestibulum. Vivamus porttitor nisl eget diam consequat, nec efficitur est tristique.
              Integer ornare nibh et libero porttitor, sed suscipit purus pulvinar. Nam in tortor at risus vestibulum
              tincidunt. Nullam sagittis consectetur ante, at egestas nisi volutpat eget. Cras bibendum, ex at dictum
              finibus, turpis libero ultricies velit, non varius lorem ipsum ut nisi.
            </Text>
          </View>
        </ScrollView>
      </View>

      <View
        style={[
          styles.footer,
          {
            padding: edgePadding,
            paddingBottom: Device.deviceType !== 1 ? 24 + insets.bottom : 16 + insets.bottom,
          },
        ]}
      >
        <BigButton route="check-in" shadow>
          Check-in
        </BigButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
  },
});
