import React from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

interface PeriodTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs?: string[];
}

const PeriodTabs = ({
  activeTab,
  onTabChange,
  tabs = ["Daily", "Weekly", "Monthly"],
}: PeriodTabsProps) => {
  const { colors } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        marginTop: 20,
        marginBottom: 10,
        borderRadius: 20,
        padding: 5,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: 5,
          justifyContent: "space-around",
          paddingHorizontal: 5,
          paddingVertical: 5,
        }}
      >
        {tabs.map((tab) => (
          <Pressable
            key={tab}
            onPress={() => onTabChange(tab)}
            style={{ flex: 1 }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 13,
                fontWeight: "bold",
                padding: 6,
                borderRadius: 12,
                ...(activeTab === tab
                  ? { backgroundColor: colors.success, color: "#fff" }
                  : { color: colors.textSecondary }),
              }}
            >
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default PeriodTabs;
