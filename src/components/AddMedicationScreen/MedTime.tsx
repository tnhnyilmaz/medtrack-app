import { useTheme } from "@/src/contexts/ThemeContext";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const MedTime = ({ durationValue, setDurationValue, durationType, setDurationType }: {
  durationValue: string;
  setDurationValue: (value: string) => void;
  durationType: string;
  setDurationType: (value: string) => void;
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View>
      <Text style={{ color: colors.text, fontSize: 16, marginBottom: 8 }}>
        {t('addMedicationScreen.durationTitle')}
      </Text>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <TextInput
          value={durationValue}
          onChangeText={setDurationValue}
          placeholder={t('addMedicationScreen.durationPlaceholder')}
          placeholderTextColor={colors.textSecondary}
          keyboardType="numeric"
          style={{
            flex: 1,
            backgroundColor: colors.surface,
            borderRadius: 10,
            padding: 15,
            color: colors.text,
            fontSize: 16,
            borderWidth: 1,
            borderColor: "#E5E5E5",
          }}
        />
        <View style={{ flex: 4, flexDirection: "row", gap: 5 }}>
          <TouchableOpacity
            onPress={() => setDurationType("gün")}
            style={{
              flex: 1,
              backgroundColor:
                durationType === "gün" ? colors.secondary : colors.surface,
              borderRadius: 10,
              padding: 15,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#E5E5E5",
            }}
          >
            <Text
              style={{
                color: durationType === "gün" ? "white" : colors.text,
                fontSize: 14,
              }}
            >
              {t('addMedicationScreen.durationType.gun')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setDurationType("hafta")}
            style={{
              flex: 1,
              backgroundColor:
                durationType === "hafta" ? colors.secondary : colors.surface,
              borderRadius: 10,
              padding: 15,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#E5E5E5",
            }}
          >
            <Text
              style={{
                color: durationType === "hafta" ? "white" : colors.text,
                fontSize: 14,
              }}
            >
              {t('addMedicationScreen.durationType.hafta')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setDurationType("ay")}
            style={{
              flex: 1,
              backgroundColor:
                durationType === "ay" ? colors.secondary : colors.surface,
              borderRadius: 10,
              padding: 15,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#E5E5E5",
            }}
          >
            <Text
              style={{
                color: durationType === "ay" ? "white" : colors.text,
                fontSize: 14,
              }}
            >
              {t('addMedicationScreen.durationType.ay')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setDurationType("yıl")}
            style={{
              flex: 1,
              backgroundColor:
                durationType === "yıl" ? colors.secondary : colors.surface,
              borderRadius: 10,
              padding: 15,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#E5E5E5",
            }}
          >
            <Text
              style={{
                color: durationType === "yıl" ? "white" : colors.text,
                fontSize: 14,
              }}
            >
              {t('addMedicationScreen.durationType.yil')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MedTime;