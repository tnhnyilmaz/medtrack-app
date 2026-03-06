import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../src/contexts/ThemeContext";

export default function AddMeasurementScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const measurementTypes = [
    {
      title: "Tansiyon Ölçümü",
      subtitle: "Kan basıncı değerlerinizi kaydedin",
      icon: "heart" as const,
      color: "#FF6B6B",
      route: "/bloodPressureScreen",
    },
    {
      title: "Şeker Ölçümü",
      subtitle: "Kan şekeri değerlerinizi kaydedin",
      icon: "water" as const,
      color: "#4ECDC4",
      route: "/sugarMeasurementsScreen",
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Ölçüm Ekle</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Ne tür bir ölçüm eklemek istiyorsunuz?
        </Text>

        <View style={styles.cardsContainer}>
          {measurementTypes.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card, { backgroundColor: colors.card }]}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: item.color + "20" },
                ]}
              >
                <Ionicons name={item.icon} size={40} color={item.color} />
              </View>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                {item.title}
              </Text>
              <Text
                style={[styles.cardSubtitle, { color: colors.textSecondary }]}
              >
                {item.subtitle}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
  },
  cardsContainer: {
    flexDirection: "row",
    gap: 15,
  },
  card: {
    flex: 1,
    padding: 24,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
});
