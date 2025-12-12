import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
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

  // Debug log
  console.log(
    `Rendering MedicationCard for ${
      medication.name
    }. onDelete: ${!!onDelete}, onEdit: ${!!onEdit}`
  );

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 20,
        marginVertical: 8,
      }}
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 15 }}
      >
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
          <Text
            style={{ color: colors.text, fontSize: 18, fontWeight: "bold" }}
          >
            {medication.name}
          </Text>
          <Text
            style={{ color: colors.textSecondary, fontSize: 14, marginTop: 2 }}
          >
            {medication.dosage || "Dozaj bilgisi yok"}
          </Text>
          <View style={{ flexDirection: "row", marginTop: 4, gap: 10 }}>
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
              Günde {medication.frequency}x
            </Text>
            {medication.instruction && (
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                •{" "}
                {medication.instruction === "aç"
                  ? "Aç karnına"
                  : medication.instruction === "tok"
                  ? "Tok karnına"
                  : medication.instruction}
              </Text>
            )}
          </View>
        </View>
      </View>

      <View
        style={{ height: 1, backgroundColor: colors.divider, marginBottom: 15 }}
      />

      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <TouchableOpacity
          onPress={() => onDelete && onDelete(medication.id!)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 8,
            paddingHorizontal: 16,
          }}
        >
          <MaterialIcons name="delete" size={20} color={colors.error} />
          <Text style={{ color: colors.error, marginLeft: 8, fontSize: 16 }}>
            Delete
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onEdit && onEdit(medication)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 8,
            paddingHorizontal: 16,
          }}
        >
          <MaterialIcons name="edit" size={20} color="#007AFF" />
          <Text style={{ color: "#007AFF", marginLeft: 8, fontSize: 16 }}>
            Edit
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MedicationCard;
