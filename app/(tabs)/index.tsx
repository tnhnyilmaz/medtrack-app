import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useTheme } from "../../src/contexts/ThemeContext";
import { useUser } from "../../src/contexts/UserContext";
import HomeScreen from "../../src/screens/HomeScreen";

export default function TabIndex() {
  const { colors } = useTheme();
  const { isOnboardingCompleted, isLoading } = useUser();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isOnboardingCompleted) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <HomeScreen />
    </View>
  );
}
