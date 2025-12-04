import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MedAppBar from "../components/MedicationsScreen/MedAppBar";
import MedicationCard from "../components/MedicationsScreen/MedicationCard";
import SearchBar from "../components/MedicationsScreen/SearchBar";
import { useTheme } from "../contexts/ThemeContext";
const MedicationsScreen = () => {
  const { colors } = useTheme();
  const [searchText, setSearchText] = useState("");
  
  const medications = [
    { name: "Lisinopril", dosage: "10mg Tablet, once daily in the morning" },
    { name: "Metformin", dosage: "500mg Tablet, twice daily with meals" },
    { name: "Aspirin", dosage: "81mg Tablet, once daily" },
    { name: "Vitamin D3", dosage: "1000 IU Capsule, once daily" },
  ];
  
  const filteredMedications = medications.filter(med =>
    med.name.toLowerCase().includes(searchText.toLowerCase())
  );
  return (
    <SafeAreaView style={{ flex: 1,backgroundColor: colors.background    }}>
      <View style={{ flex: 1, padding: 20 }}>
        <MedAppBar />
        <SearchBar onSearchChange={setSearchText} />
        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredMedications.map((med, index) => (
            <MedicationCard key={index} medication={med} />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default MedicationsScreen;
