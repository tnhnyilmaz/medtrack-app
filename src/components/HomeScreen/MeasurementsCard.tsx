import {
  BloodPressure,
  BloodSugar,
  getLatestBloodPressure,
  getLatestBloodSugar,
} from "@/src/database/measurementRepository";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import styles from "../../styles/HomeScreenStyles";

const MeasurementsCard = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const { t } = useTranslation();

  const [latestBP, setLatestBP] = useState<BloodPressure | null>(null);
  const [latestSugar, setLatestSugar] = useState<BloodSugar | null>(null);

  const loadLatestMeasurements = useCallback(async () => {
    try {
      const [bp, sugar] = await Promise.all([
        getLatestBloodPressure(),
        getLatestBloodSugar(),
      ]);
      setLatestBP(bp);
      setLatestSugar(sugar);
    } catch (error) {
      console.error("Failed to load latest measurements:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadLatestMeasurements();
    }, [loadLatestMeasurements])
  );

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return t("home.justNow");
    if (diffMins < 60) return `${diffMins} ${t("home.minutesAgo")}`;
    if (diffHours < 24) return `${diffHours} ${t("home.hoursAgo")}`;
    if (diffDays === 1) return t("home.yesterday");
    return `${diffDays} ${t("home.daysAgo")}`;
  };

  return (
    <View style={{ gap: 12 }}>
      <View style={styles.measurementsSectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t("home.latestMeasurements")}
        </Text>

        <Pressable onPress={() => router.push("/(tabs)/reports")}> 
          <Text style={[styles.sectionLink, { color: colors.primary }]}>
            {t("home.details")}
          </Text>
        </Pressable>
      </View>

      <View style={styles.measurementsContainer}>
        <Pressable
          onPress={() => router.push("/bloodPressureScreen")}
          style={[styles.measurementsCard, { backgroundColor: colors.surface }]}
        >
          <View style={styles.measurementsIconContainerRow}>
            <View
              style={[
                styles.measurementsIconContainer,
                { backgroundColor: colors.measurBackRed },
              ]}
            >
              <FontAwesome5
                name="heartbeat"
                size={20}
                color={colors.measurIconRed}
              />
            </View>
            <Entypo name="chevron-right" size={20} color={colors.textSecondary} />
          </View>

          <View>
            <Text style={[styles.measurementsTitleText, { color: colors.textSecondary }]}>
              {t("home.bloodPressure")}
            </Text>
            <View style={styles.measurementValueRow}>
              <Text style={[styles.measurementsValueText, { color: colors.text }]}> 
                {latestBP ? `${latestBP.systolic}/${latestBP.diastolic}` : "--/--"}
              </Text>
              <Text style={[styles.measurementsUnitText, { color: colors.textSecondary }]}>
                mmHg
              </Text>
            </View>
          </View>

          <View style={[styles.measurementsTimeBadge, { backgroundColor: `${colors.measurIconRed}15` }]}>
            <Text style={[styles.measurementsTimeText, { color: colors.measurIconRed }]}>
              {latestBP ? formatTimeAgo(latestBP.measure_time) : t("home.noMeasurement")}
            </Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => router.push("/sugarMeasurementsScreen")}
          style={[styles.measurementsCard, { backgroundColor: colors.surface }]}
        >
          <View style={styles.measurementsIconContainerRow}>
            <View
              style={[
                styles.measurementsIconContainer,
                { backgroundColor: colors.measurBackOrange },
              ]}
            >
              <Entypo name="drop" size={20} color={colors.measurIconORange} />
            </View>
            <Entypo name="chevron-right" size={20} color={colors.textSecondary} />
          </View>

          <View>
            <Text style={[styles.measurementsTitleText, { color: colors.textSecondary }]}>
              {t("home.sugar")}
            </Text>
            <View style={styles.measurementValueRow}>
              <Text style={[styles.measurementsValueText, { color: colors.text }]}> 
                {latestSugar ? `${latestSugar.level}` : "--"}
              </Text>
              <Text style={[styles.measurementsUnitText, { color: colors.textSecondary }]}>
                mg/dL
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.measurementsTimeBadge,
              { backgroundColor: `${colors.measurIconORange}15` },
            ]}
          >
            <Text style={[styles.measurementsTimeText, { color: colors.measurIconORange }]}> 
              {latestSugar
                ? formatTimeAgo(latestSugar.measure_time)
                : t("home.noMeasurement")}
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default MeasurementsCard;
