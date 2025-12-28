import { useTheme } from "@/src/contexts/ThemeContext";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";
import styles from "../../styles/SugarMeasurementsStyle";

const TopBar = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => router.back()}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <Feather name="chevron-left" size={42} color={colors.text} />
      </Pressable>
      <Text style={[styles.headText, { color: colors.text }]}>
        {t('sugar.title')}
      </Text>
    </View>
  );
};

export default TopBar;
