import { useTheme } from "@/src/contexts/ThemeContext";
import styles from "@/src/styles/AddMedicationStyles";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";

const MedClock = ({
  timeInputs,
  openTimePicker,
}: {
  timeInputs: string[];
  openTimePicker: (index: number) => void;
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View>
      <Text style={[styles.label, { color: colors.text }]}>{t("addMedicationScreen.time")}</Text>

      {timeInputs.map((time, index) => (
        <View key={index} style={styles.timeContainer}>
          <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>
            {index + 1}. {t("addMedicationScreen.time")}
          </Text>

          <TouchableOpacity
            onPress={() => openTimePicker(index)}
            style={[
              styles.timeButton,
              {
                backgroundColor: colors.surface,
                borderColor: `${colors.border}CC`,
              },
            ]}
          >
            <Text
              style={[
                styles.timeButtonText,
                { color: time ? colors.text : colors.textSecondary },
              ]}
            >
              {time || t("addMedicationScreen.selectTime")}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default MedClock;
