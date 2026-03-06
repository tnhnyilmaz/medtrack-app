import { useTheme } from "@/src/contexts/ThemeContext";
import {
  getTodaysMedications,
  logMedicationIntake,
  TodayMedication,
} from "@/src/database/medicineRepository";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MedTile from "./MedTile";

const MedList = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [medications, setMedications] = useState<TodayMedication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMed, setSelectedMed] = useState<TodayMedication | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const listReveal = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0.92)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;

  const loadMedications = useCallback(async () => {
    try {
      setLoading(true);
      const todayMeds = await getTodaysMedications();
      setMedications(todayMeds);
    } catch (error) {
      console.error("Failed to load medications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadMedications();
    }, [loadMedications])
  );

  useEffect(() => {
    if (loading) return;

    listReveal.setValue(0);
    Animated.timing(listReveal, {
      toValue: 1,
      duration: 520,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [listReveal, loading, medications.length]);

  useEffect(() => {
    if (!modalVisible) return;

    modalOpacity.setValue(0);
    modalScale.setValue(0.92);

    Animated.parallel([
      Animated.timing(modalOpacity, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(modalScale, {
        toValue: 1,
        speed: 18,
        bounciness: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, [modalOpacity, modalScale, modalVisible]);

  const getItemAnimatedStyle = (index: number) => {
    const start = Math.min(index * 0.12, 0.78);
    const end = Math.min(start + 0.28, 1);
    const safeEnd = end <= start ? start + 0.01 : end;

    return {
      opacity: listReveal.interpolate({
        inputRange: [start, safeEnd],
        outputRange: [0, 1],
        extrapolate: "clamp",
      }),
      transform: [
        {
          translateY: listReveal.interpolate({
            inputRange: [start, safeEnd],
            outputRange: [10, 0],
            extrapolate: "clamp",
          }),
        },
      ],
    };
  };

  const handleMedicationPress = (med: TodayMedication) => {
    setSelectedMed(med);
    setModalVisible(true);
  };

  const handleConfirmIntake = async () => {
    if (!selectedMed) return;

    try {
      await logMedicationIntake(
        selectedMed.medicine_id,
        selectedMed.schedule_time,
        true
      );
      setModalVisible(false);
      setSelectedMed(null);
      await loadMedications();
    } catch (error) {
      console.error("Failed to log medication:", error);
    }
  };

  const handleUndoIntake = async () => {
    if (!selectedMed) return;

    try {
      await logMedicationIntake(
        selectedMed.medicine_id,
        selectedMed.schedule_time,
        false
      );
      setModalVisible(false);
      setSelectedMed(null);
      await loadMedications();
    } catch (error) {
      console.error("Failed to undo medication:", error);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMed(null);
  };

  const getModalContent = () => {
    if (!selectedMed) return null;

    const isTaken =
      selectedMed.status === "taken" || selectedMed.status === "taken_late";
    const isMissed = selectedMed.status === "missed";

    return (
      <Animated.View
        style={[
          styles.modalContent,
          { backgroundColor: colors.surface },
          { opacity: modalOpacity, transform: [{ scale: modalScale }] },
        ]}
      >
        <View style={styles.modalHeader}>
          <View
            style={[
              styles.modalIconContainer,
              { backgroundColor: `${colors.secondary}22` },
            ]}
          >
            <MaterialCommunityIcons
              name="pill"
              size={30}
              color={colors.secondary}
            />
          </View>
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            {selectedMed.name}
          </Text>
          <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
            {selectedMed.dosage && `${selectedMed.dosage} | `}
            {selectedMed.schedule_time}
          </Text>
        </View>

        {isMissed && (
          <View style={[styles.warningBox, { backgroundColor: "#FEE2E2" }]}>
            <Ionicons name="warning" size={20} color="#EF4444" />
            <Text style={[styles.warningText, { color: "#EF4444" }]}>
              {t("home.lateWarning")}
            </Text>
          </View>
        )}

        {selectedMed.status === "taken_late" && (
          <View style={[styles.warningBox, { backgroundColor: "#FFF3E0" }]}>
            <Ionicons name="time" size={20} color="#FF9800" />
            <Text style={[styles.warningText, { color: "#FF9800" }]}>
              {t("home.takenLateAt").replace(
                "{time}",
                selectedMed.taken_time || ""
              )}
            </Text>
          </View>
        )}

        {isTaken && selectedMed.status !== "taken_late" && (
          <View style={[styles.warningBox, { backgroundColor: "#DCFCE7" }]}>
            <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
            <Text style={[styles.warningText, { color: "#22C55E" }]}>
              {t("home.takenAt").replace("{time}", selectedMed.taken_time || "")}
            </Text>
          </View>
        )}

        <View style={styles.modalActions}>
          {!isTaken && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.secondary }]}
              onPress={handleConfirmIntake}
            >
              <Ionicons name="checkmark" size={22} color="white" />
              <Text style={styles.actionButtonText}>
                {isMissed ? t("home.takeLate") : t("home.takeMed")}
              </Text>
            </TouchableOpacity>
          )}

          {isTaken && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#EF4444" }]}
              onPress={handleUndoIntake}
            >
              <Ionicons name="arrow-undo" size={22} color="white" />
              <Text style={styles.actionButtonText}>{t("home.undo")}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.cancelButton, { borderColor: colors.textSecondary }]}
            onPress={closeModal}
          >
            <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>
              {t("home.close")}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="small" color={colors.secondary} />
        </View>
      );
    }

    if (medications.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {t("home.noMedicationsScheduled")}
          </Text>
          <Text style={[styles.emptySubText, { color: colors.textSecondary }]}>
            {t("home.tapPlusToAdd")}
          </Text>
        </View>
      );
    }

    return (
      <>
        {medications.map((med, index) => (
          <Animated.View
            key={`${med.medicine_id}-${med.schedule_time}`}
            style={getItemAnimatedStyle(index)}
          >
            <MedTile med={med} onPress={() => handleMedicationPress(med)} />
            {index < medications.length - 1 && (
              <View style={[styles.divider, { backgroundColor: colors.divider }]} />
            )}
          </Animated.View>
        ))}
      </>
    );
  };

  return (
    <View>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t("home.todaysMedications")}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/medicationsScreen")}
          style={[styles.seeAllChip, { backgroundColor: `${colors.primary}12` }]}
        >
          <Text style={[styles.seeAllText, { color: colors.primary }]}>
            {t("home.allMedications")}
          </Text>
          <Ionicons name="chevron-forward" size={14} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.surface,
            borderColor: `${colors.border}80`,
          },
        ]}
      >
        {renderContent()}
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeModal}
        >
          <TouchableOpacity activeOpacity={1}>{getModalContent()}</TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.2,
    flexShrink: 1,
  },
  seeAllChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: "700",
  },
  container: {
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  divider: {
    height: 1,
    borderRadius: 1,
  },
  emptyContainer: {
    paddingVertical: 28,
    alignItems: "center",
    gap: 4,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  emptySubText: {
    fontSize: 13,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(7, 13, 24, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 8,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 18,
  },
  modalIconContainer: {
    width: 62,
    height: 62,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 3,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    textAlign: "center",
  },
  warningBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 10,
    width: "100%",
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
  },
  modalActions: {
    width: "100%",
    gap: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },
  cancelButton: {
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
});

export default MedList;
