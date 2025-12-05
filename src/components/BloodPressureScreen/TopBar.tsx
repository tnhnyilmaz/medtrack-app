import { useTheme } from "@/src/contexts/ThemeContext";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import styles from "../../styles/BloodPressureStyle";
const TopBar = () => {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View style={styles.row}>
      <Pressable onPress={() => router.back()}>
        <Feather name="chevron-left" size={42} color={colors.text} />
      </Pressable>
      <Text style={[styles.headText, { color: colors.text }]}>
        Blood Pressure
      </Text>
    </View>
  );
};

export default TopBar;
