import { View } from "react-native";
import { useTheme } from "../src/contexts/ThemeContext";
import SugarMeasurementsScreen from "../src/screens/SugarMeasurementsScreen";

export default function SugarMeasurements() {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <SugarMeasurementsScreen />
    </View>
  );
}
