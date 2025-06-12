import { useState, useContext, useEffect } from "react";
import { Text, Pressable, useColorScheme } from "react-native";
import { Check } from "lucide-react-native";
import { CompanyFiltersContext, CompanyFiltersContextType, CompanyFiltersType } from "context/company-filters";
import { ListItemType } from "app/company-filters/list";
import { pressedDefault, getTheme } from "utils/helpers";

type ListItemProps = {
  data: ListItemType;
  type: string;
};

export default function ListItem(props: ListItemProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const { companyFilters, setCompanyFilters } = useContext<CompanyFiltersContextType>(CompanyFiltersContext);
  const [checked, setChecked] = useState(false);

  const press = () => {
    if (companyFilters[props.type as keyof CompanyFiltersType].includes(props.data.id)) {
      // Remove
      setCompanyFilters({
        ...companyFilters,
        [props.type]: companyFilters[props.type as keyof CompanyFiltersType].filter((item) => item !== props.data.id),
      });
    } else {
      // Add
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
    <Pressable
      onPress={press}
      style={({ pressed }) => [
        pressedDefault(pressed),
        { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
      ]}
      hitSlop={16}
    >
      <Text
        style={{
          color: theme.color.primary,
          fontFamily: "Circular-Medium",
          fontSize: theme.fontSize.body,
        }}
        allowFontScaling={false}
      >
        {props.data.name}
      </Text>

      <Check
        color={theme.color.primary}
        size={theme.icon.base.size}
        absoluteStrokeWidth
        strokeWidth={theme.icon.base.stroke}
        style={{ opacity: checked ? 1 : 0 }}
      />
    </Pressable>
  );
}
