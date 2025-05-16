import { useContext, useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, Text, ActivityIndicator, Pressable } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as Device from "expo-device";
import * as Network from "expo-network";
import Constants from "expo-constants";
import { HeaderBackButton } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import axios from "axios";
import { CompanyFiltersContext, CompanyFiltersContextType, CompanyFiltersType } from "context/company-filters";
import HeaderTitle from "components/HeaderTitle";
import ListItem from "components/list/ListItem";
import Search from "components/list/Search";
import { getStoredVal, removeAccess, theme, pressedDefault } from "utils/helpers";

export type ListItemType = {
  id: number;
  name: string;
};

export default function List() {
  const params = useLocalSearchParams<{ title: string }>();
  const colors = theme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { companyFilters, setCompanyFilters } = useContext<CompanyFiltersContextType>(CompanyFiltersContext);
  const [items, setItems] = useState<ListItemType[]>([]);
  const [searchText, setSearchText] = useState("");
  const [isOffline, setIsOffline] = useState(false);
  const spacing = Device.deviceType !== 1 ? 24 : 16;
  const dividerStyle = { backgroundColor: colors.secondaryBg, marginVertical: spacing };
  const fontSize = Device.deviceType !== 1 ? 20 : 16;

  const getItemsData = async (uuid: string) => {
    try {
      const response = await axios.post(
        Constants.appOwnership !== "expo"
          ? `https://mood-web-zeta.vercel.app/api/${params.title.toLowerCase()}`
          : `http://localhost:3000/api/${params.title.toLowerCase()}`,
        {
          uuid: uuid,
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // User doesn't exist
        removeAccess();
        alert("Access denied.");
      }

      console.log(error);
    }
  };

  const getItems = async () => {
    const uuid = await getStoredVal("uuid"); // Check if customer employee
    const network = await Network.getNetworkStateAsync();

    if (uuid && network.isInternetReachable) {
      const itemsData = await getItemsData(uuid);
      setItems(itemsData);
    } else if (!network.isInternetReachable) {
      setIsOffline(true);
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: "",
          headerLeft: () => (
            <HeaderBackButton
              onPress={() => router.dismissAll()}
              label="Back"
              labelStyle={{ fontFamily: "Circular-Book", fontSize: fontSize }}
              tintColor={colors.link}
              allowFontScaling={false}
              style={{ marginLeft: -8 }}
            />
          ),
          headerRight: () => (
            <Pressable
              onPress={() =>
                setCompanyFilters({ ...companyFilters, [params.title.toLowerCase() as keyof CompanyFiltersType]: [] })
              }
              style={({ pressed }) => [
                pressedDefault(pressed),
                {
                  display: companyFilters[params.title.toLowerCase() as keyof CompanyFiltersType].length
                    ? "flex"
                    : "none",
                },
              ]}
              hitSlop={16}
            >
              <Text
                style={{
                  fontFamily: "Circular-Book",
                  fontSize: fontSize,
                  color: colors.link,
                }}
                allowFontScaling={false}
              >
                Clear all
              </Text>
            </Pressable>
          ),
        }}
      />

      <HeaderTitle text={params.title} />

      {items?.length ? (
        <View style={{ flex: 1 }}>
          <Search text={searchText} setText={setSearchText} />

          <ScrollView
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            style={{ flex: 1 }}
            contentContainerStyle={{
              padding: spacing,
              paddingBottom: insets.bottom + spacing,
            }}
          >
            {items.map((item, index) => {
              if (searchText === "" || item.name.toLowerCase().includes(searchText.toLowerCase())) {
                return (
                  <View key={index}>
                    <ListItem data={item} type={params.title.toLowerCase()} />
                    <View style={[styles.divider, dividerStyle]} />
                  </View>
                );
              }
            })}
          </ScrollView>
        </View>
      ) : isOffline ? (
        <View style={[styles.wrapper, { paddingBottom: insets.bottom }]}>
          <Text
            style={[
              styles.text,
              {
                color: colors.secondary,
                fontSize: fontSize,
              },
            ]}
          >
            {"You must be online to display\ncompany locations."}
          </Text>
        </View>
      ) : (
        <View style={[styles.wrapper, { paddingBottom: insets.bottom }]}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    width: "100%",
    height: 1,
  },
  text: {
    fontFamily: "Circular-Book",
    textAlign: "center",
  },
});
