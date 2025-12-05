import { View } from "react-native";
import { useTheme } from '../src/contexts/ThemeContext';
import BloodPressureScreen from "../src/screens/BloodPressureScreen";

export default function BloodPressure() {
  const { colors } = useTheme();
  
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <BloodPressureScreen/>
    </View>
  );
}
