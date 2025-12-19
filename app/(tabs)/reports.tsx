import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../src/contexts/ThemeContext";

export default function ReportsScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const reportCards = [
    {
      title: "Tansiyon Ölçümleri",
      subtitle: "Kan basıncı geçmişinizi görüntüleyin",
      icon: "heart" as const,
      color: "#FF6B6B",
      route: "/bloodPressureScreen",
    },
    {
      title: "Şeker Ölçümleri",
      subtitle: "Kan şekeri geçmişinizi görüntüleyin",
      icon: "water" as const,
      color: "#4ECDC4",
      route: "/sugarMeasurementsScreen",
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Raporlar</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Sağlık verilerinizi inceleyin
        </Text>
      </View>

      <View style={styles.cardsContainer}>
        {reportCards.map((card, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { backgroundColor: colors.card }]}
            onPress={() => router.push(card.route as any)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: card.color + "20" },
              ]}
            >
              <Ionicons name={card.icon} size={32} color={card.color} />
            </View>
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                {card.title}
              </Text>
              <Text
                style={[styles.cardSubtitle, { color: colors.textSecondary }]}
              >
                {card.subtitle}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    paddingTop: 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  cardsContainer: {
    gap: 15,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
  },
});
