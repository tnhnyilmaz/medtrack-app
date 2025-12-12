import { useTheme } from "@/src/contexts/ThemeContext";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const MedForm = ({
  medicineForm,
  setMedicineForm,
  dosage,
  setDosage,
}: {
  medicineForm: string;
  setMedicineForm: (value: string) => void;
  dosage: string;
  setDosage: (value: string) => void;
}) => {
  const { colors } = useTheme();

  const formTypes = [
    { label: "Tablet", value: "tablet" },
    { label: "Kapsül", value: "kapsül" },
    { label: "Enjeksiyon", value: "enjeksiyon" },
    { label: "Şurup", value: "şurup" },
    { label: "Damla", value: "damla" },
  ];

  return (
    <View style={{ gap: 15 }}>
      <View>
        <Text style={{ color: colors.text, fontSize: 16, marginBottom: 8 }}>
          İlaç Formu
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {formTypes.map((form) => (
            <TouchableOpacity
              key={form.value}
              onPress={() => setMedicineForm(form.value)}
              style={{
                backgroundColor:
                  medicineForm === form.value
                    ? colors.secondary
                    : colors.surface,
                borderRadius: 10,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderWidth: 1,
                borderColor: "#E5E5E5",
              }}
            >
              <Text
                style={{
                  color: medicineForm === form.value ? "white" : colors.text,
                  fontSize: 14,
                }}
              >
                {form.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View>
        <Text style={{ color: colors.text, fontSize: 16, marginBottom: 8 }}>
          Dozaj (örn: 500mg, 10ml)
        </Text>
        <TextInput
          value={dosage}
          onChangeText={setDosage}
          placeholder="Dozaj girin"
          placeholderTextColor={colors.textSecondary}
          style={{
            backgroundColor: colors.surface,
            borderRadius: 10,
            padding: 15,
            color: colors.text,
            fontSize: 16,
            borderWidth: 1,
            borderColor: "#E5E5E5",
          }}
        />
      </View>
    </View>
  );
};

export default MedForm;
