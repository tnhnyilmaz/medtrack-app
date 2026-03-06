import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { Medicine } from "../../database/medicineRepository";

const MedicationCard = ({
  medication,
  onDelete,
  onEdit,
}: {
  medication: Medicine;
  onDelete: (id: number) => void;
  onEdit: (medicine: Medicine) => void;
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const frequencyLabel = `${medication.frequency} ${t("medications.timesPerDay")}`;
  const normalizedInstruction = (medication.instruction || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const instructionLabel =
    normalizedInstruction === "ac"
      ? t("medications.onEmptyStomach")
      : normalizedInstruction === "tok"
        ? t("medications.onFullStomach")
        : medication.instruction || "";

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: `${colors.border}B5`,
          shadowColor: colors.shadow,
        },
      ]}
    >
      <View style={styles.topRow}>
        <View
          style={[
            styles.iconWrap,
            {
              backgroundColor: colors.lowSuccess,
              borderColor: `${colors.secondary}33`,
            },
          ]}
        >
          <MaterialIcons name="medication" size={22} color={colors.success} />
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={[styles.medName, { color: colors.text }]} numberOfLines={1}>
              {medication.name}
            </Text>
            <View style={[styles.frequencyPill, { backgroundColor: `${colors.primary}16` }]}>
              <Text style={[styles.frequencyText, { color: colors.primary }]}>{frequencyLabel}</Text>
            </View>
          </View>

          <Text style={[styles.medSubText, { color: colors.textSecondary }]} numberOfLines={1}>
            {medication.dosage || t("medications.noDosageInfo")}
          </Text>

          <View style={styles.badgesRow}>
            <View style={[styles.badge, { backgroundColor: `${colors.secondary}14` }]}>
              <Text style={[styles.badgeText, { color: colors.iconGreen }]}>{frequencyLabel}</Text>
            </View>
            {instructionLabel ? (
              <View style={[styles.badge, { backgroundColor: `${colors.warning}16` }]}>
                <Text style={[styles.badgeText, { color: colors.warning }]}>{instructionLabel}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: `${colors.divider}B5` }]} />

      <View style={styles.actionsRow}>
        <TouchableOpacity
          onPress={() => onDelete && onDelete(medication.id!)}
          style={[styles.actionBtn, { backgroundColor: `${colors.error}14` }]}
          activeOpacity={0.8}
        >
          <MaterialIcons name="delete-outline" size={18} color={colors.error} />
          <Text style={[styles.actionText, { color: colors.error }]}>{t("medications.delete")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onEdit && onEdit(medication)}
          style={[styles.actionBtn, { backgroundColor: `${colors.primary}16` }]}
          activeOpacity={0.8}
        >
          <MaterialIcons name="edit" size={18} color={colors.primary} />
          <Text style={[styles.actionText, { color: colors.primary }]}>{t("medications.edit")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 1,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  medName: {
    flex: 1,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  frequencyPill: {
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  frequencyText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  medSubText: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: "500",
  },
  badgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    marginTop: 12,
    marginBottom: 10,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingVertical: 10,
    gap: 6,
  },
  actionText: {
    fontSize: 13,
    fontWeight: "700",
  },
});

export default MedicationCard;
