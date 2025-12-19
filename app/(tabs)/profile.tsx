import React from "react";
import { View } from "react-native";
import { useTheme } from "../../src/contexts/ThemeContext";
import ProfileScreen from "../../src/screens/ProfileScreen";

export default function TabProfile() {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <ProfileScreen />
    </View>
  );
}
