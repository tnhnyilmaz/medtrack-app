import { useTheme } from "@/src/contexts/ThemeContext";
import React from "react";
import { Text, TextInput, View } from "react-native";

const MedName = ({ medName, setMedName }: { medName: string; setMedName: (value: string) => void }) => {
  const { colors } = useTheme();
  return (
    <View>
      <Text style={{ color: colors.text, fontSize: 16, marginBottom: 8 }}>
        İlaç Adı
      </Text>
      <TextInput
        value={medName}
        onChangeText={setMedName}
        placeholder="İlaç adını girin"
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
  );
};

export default MedName;
