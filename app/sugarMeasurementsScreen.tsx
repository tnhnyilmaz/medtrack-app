import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { useTheme } from "../src/contexts/ThemeContext";
import SugarMeasurementsScreen from "../src/screens/SugarMeasurementsScreen";

export default function SugarMeasurements() {
  const { colors } = useTheme();
  const { openModal } = useLocalSearchParams<{ openModal?: string }>();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <SugarMeasurementsScreen autoOpenModal={openModal === "true"} />
    </View>
  );
}
