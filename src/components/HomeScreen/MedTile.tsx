import { useTheme } from "@/src/contexts/ThemeContext";
import { TodayMedication } from "@/src/database/medicineRepository";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface MedTileProps {
  med: TodayMedication;
  onPress?: () => void;
}

const MedTile = ({ med, onPress }: MedTileProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "taken":
      case "taken_late":
        return <Ionicons name="checkmark" size={14} color="#FFFFFF" />;
      case "missed":
        return <Ionicons name="close" size={14} color="#FFFFFF" />;
      case "pending":
        return <Ionicons name="time-outline" size={14} color="#3B82F6" />;
      default:
        return <Ionicons name="help" size={14} color={colors.textSecondary} />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "taken":
        return {
          backgroundColor: colors.secondary,
          textColor: colors.secondary,
          chipBg: `${colors.secondary}1A`,
          borderWidth: 0,
        };
      case "taken_late":
        return {
          backgroundColor: "#FF9800",
          textColor: "#FF9800",
          chipBg: "#FFF3E0",
          borderWidth: 0,
        };
      case "missed":
        return {
          backgroundColor: colors.error,
          textColor: colors.error,
          chipBg: `${colors.error}14`,
          borderWidth: 0,
        };
      case "pending":
        return {
          backgroundColor: "transparent",
          textColor: "#3B82F6",
          chipBg: "#DBEAFE",
          borderWidth: 2,
          borderColor: "#3B82F6",
        };
      default:
        return {
          backgroundColor: colors.gray,
          textColor: colors.textSecondary,
          chipBg: `${colors.textSecondary}14`,
          borderWidth: 0,
        };
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "taken":
        return t("home.statusTaken");
      case "taken_late":
        return t("home.statusTakenLate");
      case "missed":
        return t("home.statusMissed");
      case "pending":
        return t("home.statusPending");
      default:
        return "";
    }
  };

  const getMedicineIconConfig = (status: string) => {
    switch (status) {
      case "missed":
        return {
          backgroundColor: "#FEE2E2",
          iconColor: "#EF4444",
        };
      case "taken":
        return {
          backgroundColor: "#DCFCE7",
          iconColor: "#22C55E",
        };
      case "taken_late":
        return {
          backgroundColor: "#FFF3E0",
          iconColor: "#FF9800",
        };
      case "pending":
        return {
          backgroundColor: "#DBEAFE",
          iconColor: "#3B82F6",
        };
      default:
        return {
          backgroundColor: colors.lowSuccess,
          iconColor: colors.secondary,
        };
    }
  };

  const iconConfig = getMedicineIconConfig(med.status);
  const statusConfig = getStatusStyle(med.status);

  const getInstructionDisplay = (instruction: string | undefined) => {
    if (!instruction) return "";

    const normalizedInstruction = instruction
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    if (normalizedInstruction === "ac") return t("medications.onEmptyStomach");
    if (normalizedInstruction === "tok") return t("medications.onFullStomach");
    return instruction;
  };

  const displayInfo = med.dosage
    ? `${med.dosage}${med.instruction ? ` • ${getInstructionDisplay(med.instruction)}` : ""}`
    : getInstructionDisplay(med.instruction);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.75}
      disabled={!onPress}
    >
      <View style={styles.leftSection}>
        <View
          style={[
            styles.medicineIconContainer,
            { backgroundColor: iconConfig.backgroundColor },
          ]}
        >
          <MaterialCommunityIcons
            name="pill"
            size={22}
            color={iconConfig.iconColor}
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={[styles.medicineName, { color: colors.text }]} numberOfLines={1}>
            {med.name}
          </Text>

          <View style={styles.metaRow}>
            <Text style={[styles.timeText, { color: colors.textSecondary }]}> 
              {med.schedule_time}
            </Text>
            <View style={[styles.statusChip, { backgroundColor: statusConfig.chipBg }]}> 
              <Text style={[styles.statusChipText, { color: statusConfig.textColor }]}> 
                {getStatusText(med.status)}
              </Text>
            </View>
          </View>

          {displayInfo ? (
            <Text style={[styles.infoText, { color: colors.textSecondary }]} numberOfLines={1}>
              {displayInfo}
            </Text>
          ) : null}
        </View>
      </View>

      <View
        style={[
          styles.statusIcon,
          {
            backgroundColor: statusConfig.backgroundColor,
            borderWidth: statusConfig.borderWidth,
            borderColor: (statusConfig as { borderColor?: string }).borderColor,
          },
        ]}
      >
        {getStatusIcon(med.status)}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: 8,
  },
  medicineIconContainer: {
    height: 46,
    width: 46,
    borderRadius: 14,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  infoContainer: {
    flex: 1,
    gap: 4,
  },
  medicineName: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.1,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  timeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statusChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  statusChipText: {
    fontSize: 11,
    fontWeight: "700",
  },
  infoText: {
    fontSize: 12,
  },
  statusIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MedTile;

