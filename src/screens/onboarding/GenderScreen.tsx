import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { useUser } from "../../contexts/UserContext";

const GenderScreen = () => {
  const { colors } = useTheme();
  const { updateUser, user } = useUser();
  const router = useRouter();
  const [selectedGender, setSelectedGender] = useState<
    "male" | "female" | null
  >(user.gender);

  const handleNext = () => {
    if (selectedGender) {
      updateUser({ gender: selectedGender });
      router.push("/onboarding/photo");
    }
  };

  const genderOptions = [
    {
      value: "male" as const,
      label: "Erkek",
      icon: "male" as const,
      color: "#4A90D9",
    },
    {
      value: "female" as const,
      label: "Kadın",
      icon: "female" as const,
      color: "#E91E8C",
    },
  ];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.stepText, { color: colors.primary }]}>
            Adım 4 / 5
          </Text>
          <Text style={[styles.title, { color: colors.text }]}>
            Cinsiyetiniz nedir?
          </Text>
          <Text style={styles.subtitle}>
            Bu bilgi sağlık takibinizi kişiselleştirmemize yardımcı olur.
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          {genderOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionCard,
                { backgroundColor: colors.card },
                selectedGender === option.value && {
                  borderColor: option.color,
                  borderWidth: 3,
                },
              ]}
              onPress={() => setSelectedGender(option.value)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: option.color + "20" },
                ]}
              >
                <Ionicons name={option.icon} size={48} color={option.color} />
              </View>
              <Text style={[styles.optionLabel, { color: colors.text }]}>
                {option.label}
              </Text>
              {selectedGender === option.value && (
                <View
                  style={[styles.checkmark, { backgroundColor: option.color }]}
                >
                  <Ionicons name="checkmark" size={16} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: selectedGender
                  ? colors.primary
                  : colors.border,
              },
            ]}
            onPress={handleNext}
            disabled={!selectedGender}
          >
            <Text style={styles.buttonText}>Devam Et</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  header: {
    marginTop: 40,
  },
  stepText: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  optionsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  optionCard: {
    width: 140,
    height: 180,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 2,
    borderColor: "transparent",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: "600",
  },
  checkmark: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    marginBottom: 20,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default GenderScreen;
