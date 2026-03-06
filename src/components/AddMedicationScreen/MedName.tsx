import { useTheme } from "@/src/contexts/ThemeContext";
import styles from "@/src/styles/AddMedicationStyles";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, TextInput, View } from "react-native";

const MedName = ({
  medName,
  setMedName,
}: {
  medName: string;
  setMedName: (value: string) => void;
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View>
      <Text style={[styles.label, { color: colors.text }]}>{t("addMedicationScreen.medName")}</Text>
      <TextInput
        value={medName}
        onChangeText={setMedName}
        placeholder={t("addMedicationScreen.medNamePlaceholder")}
        placeholderTextColor={colors.textSecondary}
        style={[
          styles.textInput,
          {
            backgroundColor: colors.surface,
            color: colors.text,
            borderColor: `${colors.border}CC`,
          },
        ]}
      />
    </View>
  );
};

export default MedName;
