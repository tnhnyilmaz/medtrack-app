import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { useTheme } from "../src/contexts/ThemeContext";
import BloodPressureScreen from "../src/screens/BloodPressureScreen";

export default function BloodPressure() {
  const { colors } = useTheme();
  const { openModal } = useLocalSearchParams<{ openModal?: string }>();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <BloodPressureScreen autoOpenModal={openModal === "true"} />
    </View>
  );
}
