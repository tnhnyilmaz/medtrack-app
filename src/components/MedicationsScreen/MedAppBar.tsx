import { useTheme } from "@/src/contexts/ThemeContext";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import styles from "../../styles/MedicationsScreenStyles";
const MedAppBar = () => {
    const { colors } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text style={[styles.bigText, { color: colors.text, fontSize: 24 }]}>
        İlaçlarım
      </Text>
      <TouchableOpacity 
        style={[styles.roundAddBtn, { backgroundColor: colors.secondary }]}
        onPress={() => router.push("/addMedication")}
      >
        <FontAwesome6 name="add" size={24} color="#dcffe5ff" />
      </TouchableOpacity>
    </View>
  );
};

export default MedAppBar;
