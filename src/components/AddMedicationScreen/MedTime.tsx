import { useTheme } from "@/src/contexts/ThemeContext";
import styles from "@/src/styles/AddMedicationStyles";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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

const MedTime = ({
  durationValue,
  setDurationValue,
  durationType,
  setDurationType,
}: {
  durationValue: string;
  setDurationValue: (value: string) => void;
  durationType: string;
  setDurationType: (value: string) => void;
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const activeType = normalizeToken(durationType);
  const [selectVisible, setSelectVisible] = React.useState(false);

  const durationOptions = [
    { key: "gun", label: t("addMedicationScreen.durationType.gun") },
    { key: "hafta", label: t("addMedicationScreen.durationType.hafta") },
    { key: "ay", label: t("addMedicationScreen.durationType.ay") },
    { key: "yil", label: t("addMedicationScreen.durationType.yil") },
  ];

  return (
    <View>
      <Text style={[styles.label, { color: colors.text }]}>{t("addMedicationScreen.durationTitle")}</Text>

      <View style={styles.durationRow}>
        <TextInput
          value={durationValue}
          onChangeText={(value) => setDurationValue(value.replace(/[^0-9]/g, ""))}
          placeholder={t("addMedicationScreen.durationPlaceholder")}
          placeholderTextColor={colors.textSecondary}
          keyboardType="numeric"
          style={[
            styles.textInput,
            styles.durationInput,
            {
              backgroundColor: colors.surface,
              color: colors.text,
              borderColor: `${colors.border}CC`,
            },
          ]}
        />

        <TouchableOpacity
          onPress={() => setSelectVisible(true)}
          style={[
            styles.selectInput,
            {
              flex: 1,
              backgroundColor: colors.surface,
              borderColor: `${colors.border}CC`,
            },
          ]}
          activeOpacity={0.85}
        >
          <Text
            style={[
              activeType ? styles.selectValueText : styles.selectPlaceholderText,
              { color: activeType ? colors.text : colors.textSecondary },
            ]}
          >
            {durationOptions.find((option) => option.key === activeType)?.label ||
              t("addMedicationScreen.durationType.gun")}
          </Text>
          <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <Modal visible={selectVisible} transparent animationType="fade">
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
              {t("addMedicationScreen.durationTitle")}
            </Text>

            <ScrollView contentContainerStyle={styles.optionList}>
              {durationOptions.map((option) => {
                const selected = activeType === option.key;

                return (
                  <TouchableOpacity
                    key={option.key}
                    onPress={() => {
                      setDurationType(option.key);
                      setSelectVisible(false);
                    }}
                    style={[
                      styles.optionItem,
                      {
                        backgroundColor: selected ? `${colors.secondary}16` : colors.surface,
                        borderColor: selected ? colors.secondary : `${colors.border}CC`,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionItemText,
                        { color: selected ? colors.iconGreen : colors.text },
                      ]}
                    >
                      {option.label}
                    </Text>

                    {selected ? (
                      <Ionicons name="checkmark-circle" size={18} color={colors.iconGreen} />
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={[styles.modalButtonRow, { marginTop: 12 }]}>
              <TouchableOpacity
                onPress={() => setSelectVisible(false)}
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

export default MedTime;
