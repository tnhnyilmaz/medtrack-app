import { useTheme } from "@/src/contexts/ThemeContext";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import styles from "../../styles/HomeScreenStyles";
import AddBtn from "./AddBtn";
import MedTile from "./MedTile";
const MedList = () => {
  const { colors } = useTheme();

  const medications = [
    { name: "İlaç A", time: "08:00 AM", status: "missed" },
    { name: "İlaç B", time: "12:00 PM", status: "taken" },
    { name: "İlaç C", time: "06:00 PM", status: "future" },
  ];

  return (
    <View>
      <View  style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
        <Text style={[styles.bigText, { color: colors.text, fontSize: 24 }]}>
          Günün İlaçları
        </Text>
        <TouchableOpacity onPress={() => router.push("/medicationsScreen")}>
          <Text style={[{color:colors.textSecondary}, styles.detailText]}>
            Detaylar
          </Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.medContainer, { backgroundColor: colors.surface }]}>
        {medications.map((med, index) => {
          return <MedTile med={med} />;
        })}
        <AddBtn />
      </View>
    </View>
  );
};

export default MedList;
