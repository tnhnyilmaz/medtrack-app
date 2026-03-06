import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../src/contexts/ThemeContext";

export default function ReportsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const revealAnim = useRef(new Animated.Value(0)).current;
  const cardScales = useRef([new Animated.Value(1), new Animated.Value(1)]).current;

  const reportCards = [
    {
      title: t('reports.bpTitle'),
      subtitle: t('reports.bpSubtitle'),
      icon: "heart" as const,
      color: "#FF6B6B",
      route: "/bloodPressureScreen",
    },
    {
      title: t('reports.sugarTitle'),
      subtitle: t('reports.sugarSubtitle'),
      icon: "water" as const,
      color: "#4ECDC4",
      route: "/sugarMeasurementsScreen",
    },
  ];

  useEffect(() => {
    revealAnim.setValue(0);
    Animated.timing(revealAnim, {
      toValue: 1,
      duration: 520,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [revealAnim, t]);

  const animateCardScale = (index: number, toValue: number) => {
    Animated.spring(cardScales[index], {
      toValue,
      speed: 24,
      bounciness: 4,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{t('reports.title')}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {t('reports.subtitle')}
        </Text>
      </View>

      <View style={styles.cardsContainer}>
        {reportCards.map((card, index) => (
          <Animated.View
            key={index}
            style={{
              opacity: revealAnim.interpolate({
                inputRange: [index * 0.25, 0.7 + index * 0.25],
                outputRange: [0, 1],
                extrapolate: "clamp",
              }),
              transform: [
                {
                  translateY: revealAnim.interpolate({
                    inputRange: [index * 0.25, 0.7 + index * 0.25],
                    outputRange: [14, 0],
                    extrapolate: "clamp",
                  }),
                },
                { scale: cardScales[index] },
              ],
            }}
          >
            <TouchableOpacity
              style={[styles.card, { backgroundColor: colors.card }]}
              onPress={() => router.push(card.route as any)}
              onPressIn={() => animateCardScale(index, 0.97)}
              onPressOut={() => animateCardScale(index, 1)}
              activeOpacity={0.85}
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
          </Animated.View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    paddingTop: 12,
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
