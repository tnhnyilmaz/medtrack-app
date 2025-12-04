import { useTheme } from "@/src/contexts/ThemeContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import styles from "../../styles/HomeScreenStyles";
const AddBtn = () => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.addBtn, { backgroundColor: colors.lowSuccess }]}
      onPress={() => router.push("/addMedication")}
    >
      <MaterialIcons name="add" size={24} color={colors.success} />
      <Text style={[styles.addBtnText, { color: colors.success }]}>
        İlaç Ekle
      </Text>
    </TouchableOpacity>
  );
};

export default AddBtn;
