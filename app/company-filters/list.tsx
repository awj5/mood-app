import { useContext, useEffect, useState } from "react";
import { View, ScrollView, Text, ActivityIndicator, Pressable, useColorScheme } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as Device from "expo-device";
import * as Network from "expo-network";
import { HeaderBackButton } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import axios from "axios";
import { CompanyFiltersContext, CompanyFiltersContextType, CompanyFiltersType } from "context/company-filters";
import HeaderTitle from "components/HeaderTitle";
import ListItem from "components/list/ListItem";
import Search from "components/list/Search";
import { getStoredVal, removeAccess, pressedDefault, getTheme } from "utils/helpers";

export type ListItemType = {
  id: number;
  name: string;
};

export default function List() {
  const params = useLocalSearchParams<{ title: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const { companyFilters, setCompanyFilters } = useContext<CompanyFiltersContextType>(CompanyFiltersContext);
  const [items, setItems] = useState<ListItemType[]>([]);
  const [searchText, setSearchText] = useState("");
  const [isOffline, setIsOffline] = useState(false);
  const isSimulator = Device.isDevice === false;

  const getItemsData = async (uuid: string) => {
    try {
      const response = await axios.post(
        !isSimulator
          ? `https://www.mood.ai/api/${params.title.toLowerCase()}`
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

      console.error(error);
    }
  };

  useEffect(() => {
    (async () => {
      const uuid = await getStoredVal("uuid"); // Check if customer employee
      const network = await Network.getNetworkStateAsync();

      if (uuid && network.isInternetReachable) {
        const itemsData = await getItemsData(uuid);
        setItems(itemsData);
      } else if (!network.isInternetReachable) {
        setIsOffline(true);
      }
    })();
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
              labelStyle={{ fontFamily: "Circular-Book", fontSize: theme.fontSize.body }}
              tintColor={theme.color.link}
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
                  fontSize: theme.fontSize.body,
                  color: theme.color.link,
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
            contentContainerStyle={{
              padding: theme.spacing.base,
              paddingBottom: insets.bottom + theme.spacing.base,
            }}
          >
            {items.map((item) => {
              if (searchText === "" || item.name.toLowerCase().includes(searchText.toLowerCase())) {
                return (
                  <View key={item.id}>
                    <ListItem data={item} type={params.title.toLowerCase()} />

                    <View
                      style={{
                        backgroundColor: theme.color.secondaryBg,
                        marginVertical: theme.spacing.base,
                        width: "100%",
                        height: 1,
                      }}
                    />
                  </View>
                );
              }
            })}
          </ScrollView>
        </View>
      ) : isOffline ? (
        <View style={{ paddingBottom: insets.bottom, flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text
            style={{
              color: theme.color.secondary,
              fontSize: theme.fontSize.body,
              fontFamily: "Circular-Book",
              textAlign: "center",
            }}
          >
            {`You must be online to display\ncompany ${params.title.toLowerCase()}.`}
          </Text>
        </View>
      ) : (
        <View
          style={{
            paddingBottom: insets.bottom,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator color={theme.color.primary} size="large" />
        </View>
      )}
    </View>
  );
}
