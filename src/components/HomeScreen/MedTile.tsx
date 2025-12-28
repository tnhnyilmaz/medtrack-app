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
        return <Ionicons name="checkmark" size={18} color="#FFFFFF" />;
      case "taken_late":
        return <Ionicons name="checkmark" size={18} color="#FFFFFF" />;
      case "missed":
        return <Ionicons name="close" size={18} color="#FFFFFF" />;
      case "pending":
        return <Ionicons name="time-outline" size={18} color="#3B82F6" />;
      default:
        return (
          <Ionicons
            name="time-outline"
            size={18}
            color={colors.textSecondary}
          />
        );
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "taken":
        return {
          backgroundColor: colors.secondary,
          borderWidth: 0,
        };
      case "taken_late":
        return {
          backgroundColor: "#FF9800", // Orange for late
          borderWidth: 0,
        };
      case "missed":
        return {
          backgroundColor: colors.error,
          borderWidth: 0,
        };
      case "pending":
        return {
          backgroundColor: "transparent",
          borderWidth: 2,
          borderColor: "#3B82F6",
        };
      default:
        return {
          backgroundColor: colors.gray,
          borderWidth: 0,
        };
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "taken":
        return t('home.statusTaken');
      case "taken_late":
        return t('home.statusTakenLate');
      case "missed":
        return t('home.statusMissed');
      case "pending":
        return t('home.statusPending');
      default:
        return "";
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "taken":
        return colors.secondary;
      case "taken_late":
        return "#FF9800";
      case "missed":
        return colors.error;
      case "pending":
        return "#3B82F6";
      default:
        return colors.textSecondary;
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
  const displayTime = med.schedule_time;

  // Translate instruction
  const getInstructionDisplay = (instruction: string | undefined) => {
    if (!instruction) return "";
    if (instruction === "aç") return t('medications.onEmptyStomach');
    if (instruction === "tok") return t('medications.onFullStomach');
    return instruction;
  };

  const displayInfo = med.dosage
    ? `${med.dosage}${med.instruction ? ` • ${getInstructionDisplay(med.instruction)}` : ""}`
    : getInstructionDisplay(med.instruction);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={styles.leftSection}>
        {/* Medicine Icon */}
        <View
          style={[
            styles.medicineIconContainer,
            { backgroundColor: iconConfig.backgroundColor },
          ]}
        >
          <MaterialCommunityIcons
            name="pill"
            size={24}
            color={iconConfig.iconColor}
          />
        </View>

        {/* Medicine Info */}
        <View style={styles.infoContainer}>
          <Text style={[styles.medicineName, { color: colors.text }]}>
            {med.name}
          </Text>
          <Text style={styles.timeStatus}>
            <Text style={{ color: colors.textSecondary }}>{displayTime}</Text>
            <Text style={{ color: colors.textSecondary }}> • </Text>
            <Text style={{ color: getStatusTextColor(med.status) }}>
              {getStatusText(med.status)}
            </Text>
            {med.taken_time && med.status === "taken_late" && (
              <>
                <Text style={{ color: colors.textSecondary }}>
                  {" "}
                  ({med.taken_time})
                </Text>
              </>
            )}
          </Text>
          {displayInfo ? (
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              {displayInfo}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Status Icon */}
      <View style={[styles.statusIcon, getStatusStyle(med.status)]}>
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
  },
  medicineIconContainer: {
    height: 48,
    width: 48,
    borderRadius: 12,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  infoContainer: {
    flex: 1,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  timeStatus: {
    fontSize: 13,
  },
  infoText: {
    fontSize: 12,
    marginTop: 2,
  },
  statusIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MedTile;
