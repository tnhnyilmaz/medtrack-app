import { useTheme } from "@/src/contexts/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { router } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import styles from "../../styles/MedicationsScreenStyles";

const MedAppBar = ({
  totalCount,
  filteredCount,
}: {
  totalCount: number;
  filteredCount: number;
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const subtitle =
    filteredCount === totalCount
      ? `${t("home.allMedications")}: ${totalCount}`
      : `${t("home.allMedications")}: ${filteredCount}/${totalCount}`;

  return (
    <View style={styles.appBarContainer}>
      <View style={styles.appBarLeft}>
        <Text style={[styles.bigText, { color: colors.text }]}>{t("medications.title")}</Text>
        <Text style={[styles.appBarSubText, { color: colors.textSecondary }]}>{subtitle}</Text>
      </View>

      <View style={styles.roundAddBtnShadow}>
        <TouchableOpacity style={styles.roundAddBtn} onPress={() => router.push("/addMedication")}>
          <LinearGradient
            colors={[colors.secondary, colors.iconGreen] as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.roundAddBtn}
          >
            <FontAwesome6 name="add" size={20} color="#F8FFF9" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MedAppBar;

