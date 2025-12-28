import { useTheme } from "@/src/contexts/ThemeContext";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const MedClock = ({ timeInputs, openTimePicker }: {
  timeInputs: string[];
  openTimePicker: (index: number) => void;
}) => {
  const { colors } = useTheme();

  return (
    <View>
      <Text style={{ color: colors.text, fontSize: 16, marginBottom: 8 }}>
        {t('addMedicationScreen.time')}
      </Text>
      {timeInputs.map((time, index) => (
        <View key={index} style={{ marginBottom: 10 }}>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 14,
              marginBottom: 5,
            }}
          >
            {index + 1}. Doz Saati
          </Text>
          <TouchableOpacity
            onPress={() => openTimePicker(index)}
            style={{
              backgroundColor: colors.surface,
              borderRadius: 10,
              padding: 15,
              borderWidth: 1,
              borderColor: "#E5E5E5",
            }}
          >
            <Text style={{ color: time ? colors.text : colors.textSecondary, fontSize: 16 }}>
              {time || "Saat seçin"}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default MedClock;