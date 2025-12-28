import { useTheme } from "@/src/contexts/ThemeContext";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const MedForm = ({
  medicineForm,
  setMedicineForm,
  dosageAmount,
  setDosageAmount,
  dosageUnit,
  setDosageUnit,
}: {
  medicineForm: string;
  setMedicineForm: (value: string) => void;
  dosageAmount: string;
  setDosageAmount: (value: string) => void;
  dosageUnit: string;
  setDosageUnit: (value: string) => void;
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const formTypes = [
    { label: t('addMedication.forms.tablet'), value: "tablet" },
    { label: t('addMedication.forms.capsule'), value: "kapsül" },
    { label: t('addMedication.forms.injection'), value: "enjeksiyon" },
    { label: t('addMedication.forms.syrup'), value: "şurup" },
    { label: t('addMedication.forms.drops'), value: "damla" },
  ];

  const dosageUnits = [
    { label: t('addMedication.units.mg'), value: "mg" },
    { label: t('addMedication.units.ml'), value: "ml" },
    { label: t('addMedication.units.iu'), value: "iu" },
    { label: t('addMedication.units.piece'), value: "adet" },
    { label: t('addMedication.units.puff'), value: "puff" },
  ];

  return (
    <View style={{ gap: 15 }}>
      <View>
        <Text style={{ color: colors.text, fontSize: 16, marginBottom: 8 }}>
          {t('addMedication.formTitle')}
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {formTypes.map((form) => (
            <TouchableOpacity
              key={form.value}
              onPress={() => setMedicineForm(form.value)}
              style={{
                backgroundColor:
                  medicineForm === form.value
                    ? colors.secondary
                    : colors.surface,
                borderRadius: 10,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderWidth: 1,
                borderColor: "#E5E5E5",
              }}
            >
              <Text
                style={{
                  color: medicineForm === form.value ? "white" : colors.text,
                  fontSize: 14,
                }}
              >
                {form.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View>
        <Text style={{ color: colors.text, fontSize: 16, marginBottom: 8 }}>
          {t('addMedication.dosageTitle')}
        </Text>
        <View style={{ gap: 10 }}>
          <TextInput
            value={dosageAmount}
            onChangeText={setDosageAmount}
            placeholder={t('addMedication.amountPlaceholder')}
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
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {dosageUnits.map((unit) => (
              <TouchableOpacity
                key={unit.value}
                onPress={() => setDosageUnit(unit.value)}
                style={{
                  backgroundColor:
                    dosageUnit === unit.value ? colors.secondary : colors.surface,
                  borderRadius: 10,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderWidth: 1,
                  borderColor: "#E5E5E5",
                  flex: 1,
                  alignItems: 'center'
                }}
              >
                <Text
                  style={{
                    color: dosageUnit === unit.value ? "white" : colors.text,
                    fontSize: 14,
                  }}
                >
                  {unit.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default MedForm;
