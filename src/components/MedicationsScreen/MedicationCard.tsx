import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

const MedicationCard = ({ medication }: { medication: { name: string; dosage: string } }) => {
  const { colors } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 20,
        marginVertical: 8,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 15 }}>
        <View
          style={{
            width: 50,
            height: 50,
            backgroundColor: colors.lowSuccess,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 15,
          }}
        >
          <MaterialIcons name="medication" size={24} color={colors.success} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: "bold" }}>
            {medication.name}
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 14, marginTop: 2 }}>
            {medication.dosage}
          </Text>
        </View>
      </View>
      
      <View style={{ height: 1, backgroundColor: colors.divider, marginBottom: 15 }} />
      
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 8,
            paddingHorizontal: 16,
          }}
        >
          <MaterialIcons name="delete" size={20} color={colors.error} />
          <Text style={{ color: colors.error, marginLeft: 8, fontSize: 16 }}>Delete</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 8,
            paddingHorizontal: 16,
          }}
        >
          <MaterialIcons name="edit" size={20} color="#007AFF" />
          <Text style={{ color: "#007AFF", marginLeft: 8, fontSize: 16 }}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MedicationCard;