import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MedAppBar from "../components/MedicationsScreen/MedAppBar";
import MedicationCard from "../components/MedicationsScreen/MedicationCard";
import SearchBar from "../components/MedicationsScreen/SearchBar";
import { useTheme } from "../contexts/ThemeContext";
import {
  deleteMedicine,
  getMedicines,
  Medicine,
} from "../database/medicineRepository";
import styles from "../styles/MedicationsScreenStyles";

const MedicationsScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState("");
  const [medications, setMedications] = useState<Medicine[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadMedicines();
    }, [])
  );

  const loadMedicines = async () => {
    try {
      const data = await getMedicines();
      setMedications(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert(t('medications.deleteTitle'), t('medications.deleteMessage'), [
      { text: t('medications.cancel'), style: "cancel" },
      {
        text: t('medications.delete'),
        style: "destructive",
        onPress: async () => {
          try {
            await deleteMedicine(id);
            loadMedicines();
          } catch (error) {
            console.error(error);
            Alert.alert(t('medications.errorTitle'), `Mesaj: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
          }
        },
      },
    ]);
  };

  const handleEdit = (medicine: Medicine) => {
    router.push({
      pathname: "/addMedication",
      params: { id: medicine.id },
    });
  };

  const filteredMedications = medications.filter((med) =>
    med.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const totalDosePerDay = useMemo(
    () => medications.reduce((acc, med) => acc + Number(med.frequency || 0), 0),
    [medications]
  );

  const renderEmptyState = () => (
    <View
      style={[
        styles.emptyState,
        { backgroundColor: colors.surface, borderColor: `${colors.border}B5` },
      ]}
    >
      <View style={[styles.emptyStateIcon, { backgroundColor: `${colors.primary}15` }]}>
        <Ionicons name="medical-outline" size={26} color={colors.primary} />
      </View>
      <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
        {t("home.noMedicationsScheduled")}
      </Text>
      <Text style={[styles.emptyStateSubtitle, { color: colors.textSecondary }]}>
        {t("home.tapPlusToAdd")}
      </Text>
      <TouchableOpacity
        style={[styles.emptyActionBtn, { backgroundColor: `${colors.secondary}22` }]}
        onPress={() => router.push("/addMedication")}
      >
        <Text style={[styles.emptyActionText, { color: colors.iconGreen }]}>
          {t("navigation.addMed")}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.screenContainer, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={styles.ambientLayer} pointerEvents="none">
        <View
          style={[styles.ambientCircleTop, { backgroundColor: `${colors.primary}16` }]}
        />
        <View
          style={[styles.ambientCircleBottom, { backgroundColor: `${colors.secondary}12` }]}
        />
      </View>

      <View style={styles.content}>
        <MedAppBar totalCount={medications.length} filteredCount={filteredMedications.length} />

        <View style={styles.statsRow}>
          <View
            style={[
              styles.statCard,
              { backgroundColor: colors.surface, borderColor: `${colors.border}CC` },
            ]}
          >
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              {t("home.allMedications")}
            </Text>
            <Text style={[styles.statValue, { color: colors.text }]}>{medications.length}</Text>
          </View>

          <View
            style={[
              styles.statCard,
              { backgroundColor: colors.surface, borderColor: `${colors.border}CC` },
            ]}
          >
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              {t("addMedicationScreen.howOften")}
            </Text>
            <Text style={[styles.statValue, { color: colors.text }]}>{`${totalDosePerDay} ${t("medications.timesPerDay")}`}</Text>
          </View>
        </View>

        <SearchBar value={searchText} onSearchChange={setSearchText} />

        <FlatList
          data={filteredMedications}
          keyExtractor={(item) => String(item.id ?? `${item.name}-${item.start_date}`)}
          renderItem={({ item }) => (
            <MedicationCard medication={item} onDelete={handleDelete} onEdit={handleEdit} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
        />
      </View>
    </SafeAreaView>
  );
};

export default MedicationsScreen;

