import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
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
const MedicationsScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
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
    Alert.alert("İlacı Sil", "Bu ilacı silmek istediğinizden emin misiniz?", [
      { text: "İptal", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteMedicine(id);
            loadMedicines();
          } catch (error) {
            console.error(error);
            Alert.alert("Hata Detayı (GÜNCEL KOD)", `Mesaj: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
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

  console.log("MedicationsScreen Render. Handlers defined?", {
    handleDelete: !!handleDelete,
    handleEdit: !!handleEdit,
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, padding: 20 }}>
        <MedAppBar />
        <SearchBar onSearchChange={setSearchText} />
        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredMedications.map((med, index) => (
            <MedicationCard
              key={index}
              medication={med}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default MedicationsScreen;
