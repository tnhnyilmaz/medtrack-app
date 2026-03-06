import { useTheme } from "@/src/contexts/ThemeContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import styles from "../../styles/HomeScreenStyles";

const AddBtn = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      style={[styles.addBtn, { backgroundColor: colors.surface }]}
      onPress={() => router.push("/addMedication")}
      activeOpacity={0.8}
    >
      <View style={styles.addBtnLeft}>
        <View
          style={[styles.addBtnIconWrap, { backgroundColor: `${colors.secondary}22` }]}
        >
          <MaterialIcons name="add" size={20} color={colors.secondary} />
        </View>
        <Text style={[styles.addBtnText, { color: colors.text }]}>
          {t("navigation.addMed")}
        </Text>
      </View>

      <Ionicons name="arrow-forward" size={18} color={colors.textSecondary} />
    </TouchableOpacity>
  );
};

export default AddBtn;
