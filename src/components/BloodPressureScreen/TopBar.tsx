import { useTheme } from "@/src/contexts/ThemeContext";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";
import { useLanguage } from "../../contexts/LanguageContext";
import styles from "../../styles/BloodPressureStyle";

const TopBar = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const locale = language === "tr" ? "tr-TR" : "en-US";
  const dateLabel = new Date().toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
  });

  return (
    <View style={styles.topBar}>
      <Pressable
        onPress={() => router.back()}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        style={[
          styles.topBarBackButton,
          {
            backgroundColor: colors.surface,
            borderColor: `${colors.border}CC`,
          },
        ]}
      >
        <Feather name="chevron-left" size={22} color={colors.text} />
      </Pressable>
      <View style={styles.topBarTextWrap}>
        <Text style={[styles.headText, { color: colors.text }]}>
          {t("bloodPressure.title")}
        </Text>
        <Text style={[styles.topBarSubText, { color: colors.textSecondary }]}>
          {dateLabel}
        </Text>
      </View>
    </View>
  );
};

export default TopBar;
