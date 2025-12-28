import { useTheme } from "@/src/contexts/ThemeContext";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, TextInput, View } from "react-native";

const MedName = ({ medName, setMedName }: { medName: string; setMedName: (value: string) => void }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View>
      <Text style={{ color: colors.text, fontSize: 16, marginBottom: 8 }}>
        {t('addMedicationScreen.medName')}
      </Text>
      <TextInput
        value={medName}
        onChangeText={setMedName}
        placeholder={t('addMedicationScreen.medNamePlaceholder')}
        placeholderTextColor={colors.textSecondary}
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

export default MedName;
