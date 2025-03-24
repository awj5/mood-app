import { useState, useContext, useEffect } from "react";
import { StyleSheet, Text, Pressable } from "react-native";
import * as Device from "expo-device";
import { Check } from "lucide-react-native";
import { CompanyFiltersContext, CompanyFiltersContextType, CompanyFiltersType } from "context/company-filters";
import { ListItemType } from "app/company-filters/list";
import { theme, pressedDefault } from "utils/helpers";

type ItemProps = {
  data: ListItemType;
  type: string;
};

export default function Item(props: ItemProps) {
  const colors = theme();
  const { companyFilters, setCompanyFilters } = useContext<CompanyFiltersContextType>(CompanyFiltersContext);
  const [checked, setChecked] = useState(false);

  const press = () => {
    if (companyFilters[props.type as keyof CompanyFiltersType].includes(props.data.id)) {
      // Remove from context
      setCompanyFilters({
        ...companyFilters,
        [props.type]: companyFilters[props.type as keyof CompanyFiltersType].filter((item) => item !== props.data.id),
      });
    } else {
      // Add to context
      setCompanyFilters({
        ...companyFilters,
        [props.type]: [...companyFilters[props.type as keyof CompanyFiltersType], props.data.id],
      });
    }
  };

  useEffect(() => {
    setChecked(companyFilters[props.type as keyof CompanyFiltersType].includes(props.data.id));
  }, [companyFilters]);

  return (
    <Pressable onPress={press} style={({ pressed }) => [pressedDefault(pressed), styles.container]} hitSlop={16}>
      <Text
        style={{
          color: colors.primary,
          fontFamily: "Circular-Medium",
          fontSize: Device.deviceType !== 1 ? 20 : 16,
        }}
        allowFontScaling={false}
      >
        {props.data.name}
      </Text>

      <Check
        color={colors.primary}
        size={Device.deviceType !== 1 ? 28 : 20}
        absoluteStrokeWidth
        strokeWidth={Device.deviceType !== 1 ? 2 : 1.5}
        style={{ display: checked ? "flex" : "none" }}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
