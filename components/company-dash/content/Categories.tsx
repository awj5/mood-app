import { View } from "react-native";
import * as Device from "expo-device";
import {
  ClipboardList,
  BicepsFlexed,
  Weight,
  Compass,
  TreePalm,
  CalendarClock,
  KeyRound,
  Users,
  Footprints,
  Puzzle,
  Trophy,
  Rocket,
  LifeBuoy,
  Eye,
  Handshake,
  Scale,
  BellElectric,
  MessageSquareWarning,
  Skull,
  TrafficCone,
} from "lucide-react-native";
import guidelinesData from "data/guidelines.json";
import Category from "./categories/Category";

export default function Categories() {
  const spacing = Device.deviceType !== 1 ? 24 : 16;

  const icons = {
    ClipboardList,
    BicepsFlexed,
    Weight,
    Compass,
    TreePalm,
    CalendarClock,
    KeyRound,
    Users,
    Footprints,
    Puzzle,
    Trophy,
    Rocket,
    LifeBuoy,
    Eye,
    Handshake,
    Scale,
    BellElectric,
    MessageSquareWarning,
    Skull,
    TrafficCone,
  };

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", paddingHorizontal: spacing, gap: spacing }}>
      {guidelinesData[0].categories.map((item, index) => (
        <Category key={index} title={item.title} icon={icons[item.icon as keyof typeof icons]} />
      ))}
    </View>
  );
}
