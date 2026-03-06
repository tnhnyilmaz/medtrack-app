import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { PeriodType } from "../../database/measurementRepository";

interface PeriodTabsProps {
  activeTab: PeriodType;
  onTabChange: (tab: PeriodType) => void;
  tabs?: PeriodType[];
}

const PeriodTabs = ({
  activeTab,
  onTabChange,
  tabs = ["daily", "weekly", "monthly"],
}: PeriodTabsProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const getTabLabel = (tab: PeriodType) => {
    if (tab === "daily") return t("period.daily");
    if (tab === "weekly") return t("period.weekly");
    return t("period.monthly");
  };

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
          <Pressable key={tab} onPress={() => onTabChange(tab)} style={{ flex: 1 }}>
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
              {getTabLabel(tab)}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default PeriodTabs;
