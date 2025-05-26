import { useCallback, useContext, useRef } from "react";
import { useColorScheme, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import Purchases, { PurchasesPackage } from "react-native-purchases";
import { HomeDatesContext, HomeDatesContextType } from "context/home-dates";
import Footer from "./Footer";
import Button from "components/Button";
import { getTheme, setStoredVal } from "utils/helpers";
import { getMonday } from "utils/dates";

type PurchaseProps = {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  selected: PurchasesPackage | string | null | undefined;
};

export default function Purchase(props: PurchaseProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const isMountedRef = useRef(false);
  const { setHomeDates } = useContext<HomeDatesContextType>(HomeDatesContext);

  const purchase = async () => {
    props.setLoading(true);

    try {
      const result = await Purchases.purchasePackage(props.selected as PurchasesPackage);
      const appUserID = result?.customerInfo.originalAppUserId; // Get unique ID from RC
      setStoredVal("pro-id", appUserID as string); // Store unique RC ID
      setHomeDates({ weekStart: getMonday(), rangeStart: undefined, rangeEnd: undefined }); // Trigger dashboard refresh
      if (isMountedRef.current) router.back(); // Close modal
    } catch (error: any) {
      if (!error.userCancelled && error?.message !== "The payment is pending. The payment is deferred.") {
        console.error(error);
        alert("An unexpected error has occurred.");
      }

      props.setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      isMountedRef.current = true;
      return () => (isMountedRef.current = false);
    }, [])
  );

  return (
    <View style={{ gap: theme.spacing.base / 2, paddingHorizontal: theme.spacing.base }}>
      <Button func={purchase} disabled={props.loading} large fill>
        Try FREE for 1 week
      </Button>

      <Footer />
    </View>
  );
}
