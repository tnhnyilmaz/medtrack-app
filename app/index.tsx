import { View } from "react-native";
import { useTheme } from '../src/contexts/ThemeContext';
import HomeScreen from "../src/screens/HomeScreen";

export default function Index() {
  const { colors, toggleTheme, isDark } = useTheme();
  
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
      }}
    >
      <HomeScreen/>
    </View>
  );
}
