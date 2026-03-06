import { useTheme } from "@/src/contexts/ThemeContext";
import styles from "@/src/styles/AddMedicationStyles";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, TextInput, View } from "react-native";

const MedDose = ({
  frequency,
  timeInputs,
  setFrequency,
  setTimeInputs,
}: {
  frequency: string;
  timeInputs: string[];
  setFrequency: (value: string) => void;
  setTimeInputs: (value: string[]) => void;
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const handleFrequencyChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    setFrequency(numericValue);

    const freq = Number.parseInt(numericValue, 10) || 0;
    if (freq > 0) {
      setTimeInputs(
        Array.from({ length: freq }, (_, index) => timeInputs[index] || "")
      );
    } else {
      setTimeInputs([]);
    }
  };

  return (
    <View>
      <Text style={[styles.label, { color: colors.text }]}>{t("addMedicationScreen.frequency")}</Text>
      <TextInput
        value={frequency}
        onChangeText={handleFrequencyChange}
        placeholder={t("addMedicationScreen.frequencyPlaceholder")}
        placeholderTextColor={colors.textSecondary}
        keyboardType="numeric"
        style={[
          styles.textInput,
          {
            backgroundColor: colors.surface,
            color: colors.text,
            borderColor: `${colors.border}CC`,
          },
        ]}
      />
      <Text style={[styles.helperText, { color: colors.textSecondary }]}>
        {t("addMedicationScreen.howOften")}
      </Text>
    </View>
  );
};

export default MedDose;
