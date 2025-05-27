import { useCallback, useContext, useRef } from "react";
import { Text, Pressable, useColorScheme, Alert } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import Purchases from "react-native-purchases";
import { HomeDatesContext, HomeDatesContextType } from "context/home-dates";
import { getTheme, pressedDefault, setStoredVal } from "utils/helpers";
import { getMonday } from "utils/dates";

type RestoreProps = {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Restore(props: RestoreProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const isFocusedRef = useRef(false);
  const { setHomeDates } = useContext<HomeDatesContextType>(HomeDatesContext);

  const restore = async () => {
    props.setLoading(true);

    try {
      const restore = await Purchases.restorePurchases();

      if (restore.activeSubscriptions.length > 0) {
        const appUserID = await Purchases.getAppUserID(); // Get unique ID from RC
        setStoredVal("pro-id", appUserID as string); // Store unique RC ID
        setHomeDates({ weekStart: getMonday(), rangeStart: undefined, rangeEnd: undefined }); // Trigger dashboard refresh

        // Close modal if user hasn't closed already
        Alert.alert("Success!", "MOOD.ai Pro has been restored.", [
          {
            text: "OK",
            onPress: isFocusedRef.current
              ? () => {
                  router.back(); // Close modal
                }
              : () => null,
          },
        ]);
      } else {
        Alert.alert("No Active Subscription", "We couldn't find an active MOOD.ai Pro subscription.");
      }
    } catch (error) {
      console.error(error);
      alert("An unexpected error has occurred.");
    }

    props.setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      isFocusedRef.current = true;
      return () => (isFocusedRef.current = false);
    }, [])
  );

  return (
    <Pressable onPress={restore} style={({ pressed }) => pressedDefault(pressed)} hitSlop={16} disabled={props.loading}>
      <Text
        style={{
          fontFamily: "Circular-Book",
          fontSize: theme.fontSize.body,
          color: theme.color.inverted,
          opacity: props.loading ? 0.25 : 1,
        }}
        allowFontScaling={false}
      >
        Restore
      </Text>
    </Pressable>
  );
}
