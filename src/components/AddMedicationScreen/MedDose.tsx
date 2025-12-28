import { useTheme } from "@/src/contexts/ThemeContext";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, TextInput, View } from "react-native";

const MedDose = ({ frequency, setFrequency, setTimeInputs }: {
  frequency: string;
  setFrequency: (value: string) => void;
  setTimeInputs: (value: string[]) => void;
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const handleFrequencyChange = (value: string) => {
    setFrequency(value);
    const freq = parseInt(value) || 0;
    if (freq > 1) {
      setTimeInputs(new Array(freq).fill(""));
    } else {
      setTimeInputs([]);
    }
  };

  return (
    <View>
      <Text style={{ color: colors.text, fontSize: 16, marginBottom: 8 }}>
        {t('addMedicationScreen.frequency')}
      </Text>
      <TextInput
        value={frequency}
        onChangeText={handleFrequencyChange}
        placeholder={t('addMedicationScreen.frequencyPlaceholder')}
        placeholderTextColor={colors.textSecondary}
        keyboardType="numeric"
        style={{
          backgroundColor: colors.surface,
          borderRadius: 10,
          padding: 15,
          color: colors.text,
          fontSize: 16,
          borderWidth: 1,
          borderColor: "#E5E5E5",
        }}
      />
    </View>
  );
};

export default MedDose;