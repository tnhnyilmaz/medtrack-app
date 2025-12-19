import { useTheme } from "@/src/contexts/ThemeContext";
import {
  getTodaysMedications,
  logMedicationIntake,
  TodayMedication,
} from "@/src/database/medicineRepository";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MedTile from "./MedTile";

const MedList = () => {
  const { colors } = useTheme();
  const [medications, setMedications] = useState<TodayMedication[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMed, setSelectedMed] = useState<TodayMedication | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const loadMedications = useCallback(async () => {
    try {
      setLoading(true);
      const todayMeds = await getTodaysMedications();
      setMedications(todayMeds);
    } catch (error) {
      console.error("Failed to load medications:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Reload medications when screen gains focus
  useFocusEffect(
    useCallback(() => {
      loadMedications();
    }, [loadMedications])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadMedications();
  }, [loadMedications]);

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
    const isPending = selectedMed.status === "pending";

    return (
      <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
        {/* Medicine Info */}
        <View style={styles.modalHeader}>
          <View
            style={[
              styles.modalIconContainer,
              { backgroundColor: colors.secondary + "20" },
            ]}
          >
            <MaterialCommunityIcons
              name="pill"
              size={32}
              color={colors.secondary}
            />
          </View>
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            {selectedMed.name}
          </Text>
          <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
            {selectedMed.dosage && `${selectedMed.dosage} • `}
            {selectedMed.schedule_time}
          </Text>
        </View>

        {/* Status Message */}
        {isMissed && (
          <View style={[styles.warningBox, { backgroundColor: "#FEE2E2" }]}>
            <Ionicons name="warning" size={20} color="#EF4444" />
            <Text style={[styles.warningText, { color: "#EF4444" }]}>
              Bu ilacın saati geçti! Şimdi alsanız "Geç Alındı" olarak
              kaydedilecek.
            </Text>
          </View>
        )}

        {selectedMed.status === "taken_late" && (
          <View style={[styles.warningBox, { backgroundColor: "#FFF3E0" }]}>
            <Ionicons name="time" size={20} color="#FF9800" />
            <Text style={[styles.warningText, { color: "#FF9800" }]}>
              Bu ilacı {selectedMed.taken_time} saatinde aldınız (geç).
            </Text>
          </View>
        )}

        {isTaken && selectedMed.status !== "taken_late" && (
          <View style={[styles.warningBox, { backgroundColor: "#DCFCE7" }]}>
            <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
            <Text style={[styles.warningText, { color: "#22C55E" }]}>
              Bu ilacı {selectedMed.taken_time} saatinde aldınız.
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.modalActions}>
          {!isTaken && (
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: colors.secondary },
              ]}
              onPress={handleConfirmIntake}
            >
              <Ionicons name="checkmark" size={24} color="white" />
              <Text style={styles.actionButtonText}>
                {isMissed ? "Geç Aldım" : "İlacı Aldım"}
              </Text>
            </TouchableOpacity>
          )}

          {isTaken && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#EF4444" }]}
              onPress={handleUndoIntake}
            >
              <Ionicons name="arrow-undo" size={24} color="white" />
              <Text style={styles.actionButtonText}>Geri Al</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.cancelButton, { borderColor: colors.textSecondary }]}
            onPress={closeModal}
          >
            <Text
              style={[styles.cancelButtonText, { color: colors.textSecondary }]}
            >
              Kapat
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
            Bugün için planlanmış ilaç yok
          </Text>
          <Text style={[styles.emptySubText, { color: colors.textSecondary }]}>
            Yeni ilaç eklemek için + butonuna tıklayın
          </Text>
        </View>
      );
    }

    return (
      <>
        {medications.map((med, index) => (
          <View key={`${med.medicine_id}-${med.schedule_time}`}>
            <MedTile med={med} onPress={() => handleMedicationPress(med)} />
            {index < medications.length - 1 && (
              <View
                style={[styles.divider, { backgroundColor: colors.divider }]}
              />
            )}
          </View>
        ))}
      </>
    );
  };

  return (
    <View>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Günün İlaçları
        </Text>
        <TouchableOpacity onPress={() => router.push("/medicationsScreen")}>
          <Text style={[styles.seeAllText, { color: colors.textSecondary }]}>
            Tüm İlaçlar
          </Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        {renderContent()}
      </View>

      {/* Medication Action Modal */}
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
          <TouchableOpacity activeOpacity={1}>
            {getModalContent()}
          </TouchableOpacity>
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
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "500",
  },
  container: {
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  scrollContent: {
    flexGrow: 1,
  },
  divider: {
    height: 1,
    borderRadius: 1,
  },
  emptyContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  emptySubText: {
    fontSize: 13,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
  },
  warningBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
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
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default MedList;
