import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
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
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: `${colors.border}CC`,
          shadowColor: colors.shadow,
        },
      ]}
    >
      <View style={styles.row}>
        {tabs.map((tab) => (
          <Pressable
            key={tab}
            onPress={() => onTabChange(tab)}
            style={[
              styles.tabButton,
              activeTab === tab && {
                backgroundColor: `${colors.secondary}1F`,
                borderColor: `${colors.secondary}66`,
              },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === tab ? colors.iconGreen : colors.textSecondary },
              ]}
            >
              {getTabLabel(tab)}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 14,
    marginBottom: 12,
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  tabButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "transparent",
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "700",
  },
});

export default PeriodTabs;
