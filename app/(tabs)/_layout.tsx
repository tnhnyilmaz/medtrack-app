import { Tabs } from "expo-router";
import React from "react";
import CustomTabBar from "../../src/components/navigation/CustomTabBar";
import { useTheme } from "../../src/contexts/ThemeContext";

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Ana Sayfa",
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Takvim",
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: "Raporlar",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
        }}
      />
    </Tabs>
  );
}
