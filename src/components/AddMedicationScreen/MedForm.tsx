import { useTheme } from "@/src/contexts/ThemeContext";
import styles from "@/src/styles/AddMedicationStyles";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

type SelectType = "form" | "unit" | null;

const normalizeToken = (value: string) =>
  value
    .toLowerCase()
    .replace(/\u0131/g, "i")
    .replace(/\u011f/g, "g")
    .replace(/\u00fc/g, "u")
    .replace(/\u00f6/g, "o")
    .replace(/\u015f/g, "s")
    .replace(/\u00e7/g, "c")
    .trim();

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
  const [activeSelect, setActiveSelect] = useState<SelectType>(null);

  const normalizedForm = normalizeToken(medicineForm);

  const formTypes = [
    { label: t("addMedication.forms.tablet"), value: "tablet", aliases: ["tablet"] },
    { label: t("addMedication.forms.capsule"), value: "capsule", aliases: ["capsule", "kapsul"] },
    { label: t("addMedication.forms.injection"), value: "injection", aliases: ["injection", "enjeksiyon"] },
    { label: t("addMedication.forms.syrup"), value: "syrup", aliases: ["syrup", "surup"] },
    { label: t("addMedication.forms.drops"), value: "drops", aliases: ["drops", "damla"] },
  ];

  const dosageUnits = [
    { label: t("addMedication.units.mg"), value: "mg" },
    { label: t("addMedication.units.ml"), value: "ml" },
    { label: t("addMedication.units.iu"), value: "iu" },
    { label: t("addMedication.units.piece"), value: "adet" },
    { label: t("addMedication.units.puff"), value: "puff" },
  ];

  const selectedFormLabel =
    formTypes.find((form) => form.aliases.includes(normalizedForm) || form.value === normalizedForm)
      ?.label || "";

  const selectedUnitLabel = dosageUnits.find((unit) => unit.value === dosageUnit)?.label || "";

  const options = activeSelect === "form" ? formTypes : dosageUnits;

  const getIsSelected = (value: string, aliases?: string[]) => {
    if (activeSelect === "form") {
      return aliases?.includes(normalizedForm) || normalizedForm === value;
    }

    return dosageUnit === value;
  };

  const selectOption = (value: string) => {
    if (activeSelect === "form") {
      setMedicineForm(value);
    } else if (activeSelect === "unit") {
      setDosageUnit(value);
    }
    setActiveSelect(null);
  };

  return (
    <View style={{ gap: 14 }}>
      <View>
        <Text style={[styles.label, { color: colors.text }]}>{t("addMedication.formTitle")}</Text>

        <TouchableOpacity
          onPress={() => setActiveSelect("form")}
          style={[
            styles.selectInput,
            {
              backgroundColor: colors.surface,
              borderColor: `${colors.border}CC`,
            },
          ]}
          activeOpacity={0.85}
        >
          <Text
            style={[
              selectedFormLabel ? styles.selectValueText : styles.selectPlaceholderText,
              { color: selectedFormLabel ? colors.text : colors.textSecondary },
            ]}
          >
            {selectedFormLabel || "Select form"}
          </Text>
          <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View>
        <Text style={[styles.label, { color: colors.text }]}>{t("addMedication.dosageTitle")}</Text>

        <View style={{ gap: 8 }}>
          <TextInput
            value={dosageAmount}
            onChangeText={(value) => setDosageAmount(value.replace(/[^0-9.]/g, ""))}
            placeholder={t("addMedication.amountPlaceholder")}
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

          <TouchableOpacity
            onPress={() => setActiveSelect("unit")}
            style={[
              styles.selectInput,
              {
                backgroundColor: colors.surface,
                borderColor: `${colors.border}CC`,
              },
            ]}
            activeOpacity={0.85}
          >
            <Text
              style={[
                selectedUnitLabel ? styles.selectValueText : styles.selectPlaceholderText,
                { color: selectedUnitLabel ? colors.text : colors.textSecondary },
              ]}
            >
              {selectedUnitLabel || "Select unit"}
            </Text>
            <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={activeSelect !== null} transparent animationType="fade">
        <View style={styles.optionModalOverlay}>
          <View
            style={[
              styles.optionModalCard,
              {
                backgroundColor: colors.surface,
                borderColor: `${colors.border}CC`,
              },
            ]}
          >
            <Text style={[styles.optionModalTitle, { color: colors.text }]}>
              {activeSelect === "form"
                ? t("addMedication.formTitle")
                : t("addMedication.dosageTitle")}
            </Text>

            <ScrollView contentContainerStyle={styles.optionList}>
              {options.map((item) => {
                const isSelected = getIsSelected(
                  item.value,
                  "aliases" in item ? item.aliases : undefined
                );

                return (
                  <TouchableOpacity
                    key={item.value}
                    onPress={() => selectOption(item.value)}
                    style={[
                      styles.optionItem,
                      {
                        backgroundColor: isSelected ? `${colors.secondary}16` : colors.surface,
                        borderColor: isSelected ? colors.secondary : `${colors.border}CC`,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionItemText,
                        { color: isSelected ? colors.iconGreen : colors.text },
                      ]}
                    >
                      {item.label}
                    </Text>

                    {isSelected ? (
                      <Ionicons name="checkmark-circle" size={18} color={colors.iconGreen} />
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={[styles.modalButtonRow, { marginTop: 12 }]}>
              <TouchableOpacity
                onPress={() => setActiveSelect(null)}
                style={[styles.modalButton, { backgroundColor: colors.textSecondary }]}
              >
                <Text style={styles.modalButtonText}>{t("home.close")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MedForm;
