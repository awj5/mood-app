import { useEffect, useState } from "react";
import { View, useColorScheme, Text } from "react-native";
import competenciesData from "data/competencies.json";
import Statement from "./statements/Statement";
import { CompanyCheckInType } from "types";
import { getTheme } from "utils/helpers";
import { groupCheckIns } from "utils/data";

type StatementDataType = {
  id: number;
  text: string;
  average: number;
  count: number;
};

type StatementsProps = {
  checkIns: CompanyCheckInType[];
};

export default function Statements(props: StatementsProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const [statements, setStatements] = useState<StatementDataType[]>([]);

  useEffect(() => {
    const competenciesRecord: Record<string, CompanyCheckInType[]> = {};

    // Loop check-ins and group by competency
    for (const checkIn of props.checkIns) {
      const id = checkIn.value.competency;
      if (!competenciesRecord[id]) competenciesRecord[id] = []; // Create record
      competenciesRecord[id].push(checkIn); // Add check-in
    }

    const competencies: StatementDataType[] = [];

    Object.entries(competenciesRecord).forEach(([key, value]) => {
      const competency = competenciesData[0].competencies.filter((item) => item.id === Number(key))[0];
      const groupedCheckIns = groupCheckIns(value); // Group by user and week
      const responses: number[] = [];

      // Loop users to get statement responses
      for (const [, weeks] of Object.entries(groupedCheckIns)) {
        // Loop weeks
        for (const [, checkIns] of Object.entries(weeks)) {
          const checkInResponses = [];

          // Loop check-ins
          for (const checkIn of checkIns) {
            checkInResponses.push(checkIn.value.statementResponse);
          }

          const checkInResponse = checkInResponses.reduce((sum, num) => sum + num, 0) / checkInResponses.length; // Average response from user for week
          responses.push(checkInResponse);
        }
      }

      competencies.push({
        id: Number(key),
        text: competency.posStatement,
        average: Math.round((responses.reduce((sum, num) => sum + num, 0) / responses.length) * 100), // Average response for all users
        count: Object.keys(groupedCheckIns).length,
      });
    });

    setStatements(
      competencies.sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count; // Most users
        return b.average - a.average; // Highest average (secondary)
      })
    );
  }, []);

  return (
    <View
      style={{
        backgroundColor: theme.color.opaqueBg,
        borderRadius: theme.spacing.base,
        padding: theme.spacing.base,
        gap: theme.spacing.base,
      }}
    >
      <Text
        style={{
          fontFamily: "Circular-Bold",
          color: theme.color.primary,
          fontSize: theme.fontSize.xSmall,
        }}
        allowFontScaling={false}
      >
        STATEMENT RESPONSES
      </Text>

      <View>
        {statements.map((item, index) => (
          <View key={item.id}>
            <Statement text={item.text} average={item.average} count={item.count} />

            {index + 1 !== statements.length && (
              <View
                style={{
                  backgroundColor: theme.color.primary,
                  marginVertical: theme.spacing.small,
                  width: "100%",
                  height: 1,
                  opacity: 0.1,
                }}
              />
            )}
          </View>
        ))}
      </View>
    </View>
  );
}
