import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLanguage } from "../../src/contexts/LanguageContext";
import { useTheme } from "../../src/contexts/ThemeContext";
import {
  getBloodPressuresByPeriod,
  getBloodSugarsByPeriod,
  getLatestBloodPressure,
  getLatestBloodSugar,
} from "../../src/database/measurementRepository";

type ReportCard = {
  title: string;
  subtitle: string;
  icon: "heart" | "water";
  accent: string;
  softAccent: string;
  count: number;
  latestLabel: string;
  historyRoute: "/bloodPressureScreen" | "/sugarMeasurementsScreen";
  addRoute: "/bloodPressureScreen?openModal=true" | "/sugarMeasurementsScreen?openModal=true";
  addAction: string;
};

export default function ReportsScreen() {
  const { colors } = useTheme();
  const { language } = useLanguage();
  const router = useRouter();
  const { t } = useTranslation();
  const locale = language === "tr" ? "tr-TR" : "en-US";

  const revealAnim = useRef(new Animated.Value(0)).current;
  const cardScales = useRef([new Animated.Value(1), new Animated.Value(1)]).current;

  const [loading, setLoading] = useState(true);
  const [monthlyBpCount, setMonthlyBpCount] = useState(0);
  const [monthlySugarCount, setMonthlySugarCount] = useState(0);
  const [latestBpTime, setLatestBpTime] = useState<string | null>(null);
  const [latestSugarTime, setLatestSugarTime] = useState<string | null>(null);

  const animateCardScale = (index: number, toValue: number) => {
    Animated.spring(cardScales[index], {
      toValue,
      speed: 24,
      bounciness: 4,
      useNativeDriver: true,
    }).start();
  };

  const formatDateTime = useCallback(
    (iso: string | null): string => {
      if (!iso) {
        return t("home.noMeasurement");
      }

      const date = new Date(iso);
      if (Number.isNaN(date.getTime())) {
        return t("home.noMeasurement");
      }

      return date.toLocaleString(locale, {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    [locale, t]
  );

  const loadReportStats = useCallback(async () => {
    try {
      setLoading(true);
      const [bpMonthly, sugarMonthly, latestBp, latestSugar] = await Promise.all([
        getBloodPressuresByPeriod("monthly"),
        getBloodSugarsByPeriod("monthly"),
        getLatestBloodPressure(),
        getLatestBloodSugar(),
      ]);

      setMonthlyBpCount(bpMonthly.length);
      setMonthlySugarCount(sugarMonthly.length);
      setLatestBpTime(latestBp?.measure_time ?? null);
      setLatestSugarTime(latestSugar?.measure_time ?? null);
    } catch (error) {
      console.error("Error loading reports data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      revealAnim.setValue(0);
      Animated.timing(revealAnim, {
        toValue: 1,
        duration: 560,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();

      loadReportStats();
    }, [loadReportStats, revealAnim])
  );

  const latestAnyTime = useMemo(() => {
    const bpTs = latestBpTime ? new Date(latestBpTime).getTime() : 0;
    const sugarTs = latestSugarTime ? new Date(latestSugarTime).getTime() : 0;
    if (bpTs === 0 && sugarTs === 0) {
      return null;
    }

    return bpTs >= sugarTs ? latestBpTime : latestSugarTime;
  }, [latestBpTime, latestSugarTime]);

  const totalMonthlyCount = monthlyBpCount + monthlySugarCount;

  const reportCards: ReportCard[] = useMemo(() => {
    const bpAccent = colors.error || colors.chartPrimary || "#FF6B6B";
    const sugarAccent =
      colors.measurIconORange || colors.chartSecondary || "#4ECDC4";

    return [
      {
        title: t("reports.bpTitle"),
        subtitle: t("reports.bpSubtitle"),
        icon: "heart",
        accent: bpAccent,
        softAccent: `${bpAccent}1A`,
        count: monthlyBpCount,
        latestLabel: formatDateTime(latestBpTime),
        historyRoute: "/bloodPressureScreen",
        addRoute: "/bloodPressureScreen?openModal=true",
        addAction: t("navigation.addBP"),
      },
      {
        title: t("reports.sugarTitle"),
        subtitle: t("reports.sugarSubtitle"),
        icon: "water",
        accent: sugarAccent,
        softAccent: `${sugarAccent}1A`,
        count: monthlySugarCount,
        latestLabel: formatDateTime(latestSugarTime),
        historyRoute: "/sugarMeasurementsScreen",
        addRoute: "/sugarMeasurementsScreen?openModal=true",
        addAction: t("navigation.addSugar"),
      },
    ];
  }, [
    colors.chartPrimary,
    colors.chartSecondary,
    colors.error,
    colors.measurIconORange,
    formatDateTime,
    latestBpTime,
    latestSugarTime,
    monthlyBpCount,
    monthlySugarCount,
    t,
  ]);

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={styles.ambientLayer} pointerEvents="none">
        <View style={[styles.ambientTop, { backgroundColor: `${colors.primary}18` }]} />
        <View style={[styles.ambientBottom, { backgroundColor: `${colors.secondary}12` }]} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[`${colors.primary}F0`, `${colors.secondary}E6`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <Text style={styles.heroTitle}>{t("reports.title")}</Text>
          <Text style={styles.heroSubtitle}>{t("reports.subtitle")}</Text>

          <View style={styles.heroStatsRow}>
            <View style={styles.heroStatCard}>
              <Text style={styles.heroStatValue}>{totalMonthlyCount}</Text>
              <Text style={styles.heroStatLabel}>{t("period.monthly")}</Text>
            </View>
            <View style={styles.heroStatCard}>
              <Text style={styles.heroStatValue}>
                {loading ? "..." : reportCards.filter((item) => item.count > 0).length}
              </Text>
              <Text style={styles.heroStatLabel}>{t("home.latestMeasurements")}</Text>
            </View>
          </View>

          <Text style={styles.heroMetaText}>
            {`${t("home.latestMeasurements")}: ${formatDateTime(latestAnyTime)}`}
          </Text>
        </LinearGradient>

        <View style={styles.quickActionRow}>
          <Pressable
            style={[styles.quickActionBtn, { backgroundColor: colors.surface, borderColor: `${colors.border}CC` }]}
            onPress={() => router.push("/bloodPressureScreen?openModal=true")}
          >
            <Ionicons name="add-circle-outline" size={18} color={colors.error || "#FF6B6B"} />
            <Text style={[styles.quickActionText, { color: colors.text }]} numberOfLines={1}>
              {t("navigation.addBP")}
            </Text>
          </Pressable>

          <Pressable
            style={[styles.quickActionBtn, { backgroundColor: colors.surface, borderColor: `${colors.border}CC` }]}
            onPress={() => router.push("/sugarMeasurementsScreen?openModal=true")}
          >
            <Ionicons
              name="add-circle-outline"
              size={18}
              color={colors.measurIconORange || colors.chartSecondary || "#4ECDC4"}
            />
            <Text style={[styles.quickActionText, { color: colors.text }]} numberOfLines={1}>
              {t("navigation.addSugar")}
            </Text>
          </Pressable>
        </View>

        {loading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        )}

        <View style={styles.cardsWrap}>
          {reportCards.map((card, index) => (
            <Animated.View
              key={card.historyRoute}
              style={{
                opacity: revealAnim.interpolate({
                  inputRange: [index * 0.22, 0.65 + index * 0.22],
                  outputRange: [0, 1],
                  extrapolate: "clamp",
                }),
                transform: [
                  {
                    translateY: revealAnim.interpolate({
                      inputRange: [index * 0.22, 0.65 + index * 0.22],
                      outputRange: [18, 0],
                      extrapolate: "clamp",
                    }),
                  },
                  { scale: cardScales[index] },
                ],
              }}
            >
              <View
                style={[
                  styles.reportCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: `${colors.border}D0`,
                    shadowColor: colors.shadow,
                  },
                ]}
              >
                <Pressable
                  style={styles.cardHeadPress}
                  onPress={() => router.push(card.historyRoute)}
                  onPressIn={() => animateCardScale(index, 0.98)}
                  onPressOut={() => animateCardScale(index, 1)}
                >
                  <View style={[styles.cardIconWrap, { backgroundColor: card.softAccent }]}>
                    <Ionicons name={card.icon} size={24} color={card.accent} />
                  </View>

                  <View style={styles.cardTextWrap}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>{card.title}</Text>
                    <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                      {card.subtitle}
                    </Text>
                  </View>

                  <View style={styles.chevronWrap}>
                    <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                  </View>
                </Pressable>

                <View style={styles.metaRow}>
                  <View
                    style={[
                      styles.metaPill,
                      { backgroundColor: colors.background, borderColor: `${colors.border}A8` },
                    ]}
                  >
                    <Ionicons name="calendar-outline" size={13} color={card.accent} />
                    <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                      {`${t("period.monthly")}: ${card.count}`}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.metaPill,
                      { backgroundColor: colors.background, borderColor: `${colors.border}A8` },
                    ]}
                  >
                    <Ionicons name="time-outline" size={13} color={colors.textSecondary} />
                    <Text style={[styles.metaText, { color: colors.textSecondary }]} numberOfLines={1}>
                      {card.latestLabel}
                    </Text>
                  </View>
                </View>

                <View style={styles.actionRow}>
                  <Pressable
                    style={[
                      styles.secondaryActionBtn,
                      { backgroundColor: colors.background, borderColor: `${colors.border}CC` },
                    ]}
                    onPress={() => router.push(card.historyRoute)}
                  >
                    <Ionicons name="bar-chart-outline" size={16} color={colors.textSecondary} />
                    <Text style={[styles.secondaryActionText, { color: colors.textSecondary }]}>
                      {t("home.details")}
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[styles.primaryActionBtn, { backgroundColor: card.accent }]}
                    onPress={() => router.push(card.addRoute)}
                  >
                    <Ionicons name="add" size={16} color="#fff" />
                    <Text style={styles.primaryActionText} numberOfLines={1}>
                      {card.addAction}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  ambientLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  ambientTop: {
    position: "absolute",
    top: -110,
    right: -90,
    width: 240,
    height: 240,
    borderRadius: 120,
  },
  ambientBottom: {
    position: "absolute",
    bottom: 130,
    left: -110,
    width: 260,
    height: 260,
    borderRadius: 130,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 22,
    paddingTop: 8,
    gap: 14,
  },
  heroCard: {
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.9)",
    marginTop: 4,
    fontSize: 14,
    fontWeight: "600",
  },
  heroStatsRow: {
    marginTop: 14,
    flexDirection: "row",
    gap: 10,
  },
  heroStatCard: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.14)",
    paddingVertical: 11,
    paddingHorizontal: 12,
  },
  heroStatValue: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.3,
  },
  heroStatLabel: {
    color: "rgba(255,255,255,0.86)",
    marginTop: 2,
    fontSize: 12,
    fontWeight: "600",
  },
  heroMetaText: {
    marginTop: 12,
    color: "rgba(255,255,255,0.92)",
    fontSize: 12,
    fontWeight: "600",
  },
  quickActionRow: {
    flexDirection: "row",
    gap: 8,
  },
  quickActionBtn: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 11,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: "700",
  },
  loadingRow: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 16,
  },
  cardsWrap: {
    gap: 12,
  },
  reportCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 12,
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  cardHeadPress: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  cardTextWrap: {
    flex: 1,
    paddingRight: 8,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  cardSubtitle: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "500",
  },
  chevronWrap: {
    width: 28,
    alignItems: "center",
  },
  metaRow: {
    marginTop: 12,
    flexDirection: "row",
    gap: 8,
  },
  metaPill: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    flex: 1,
    fontSize: 11,
    fontWeight: "600",
  },
  actionRow: {
    marginTop: 10,
    flexDirection: "row",
    gap: 8,
  },
  secondaryActionBtn: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  secondaryActionText: {
    fontSize: 12,
    fontWeight: "700",
  },
  primaryActionBtn: {
    flex: 1.35,
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  primaryActionText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "800",
    flexShrink: 1,
    textAlign: "center",
  },
});
