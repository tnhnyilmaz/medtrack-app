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
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Easing, Pressable, Text, View } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import styles from "../../styles/HomeScreenStyles";

const MeasurementsCard = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const { t } = useTranslation();

  const [latestBP, setLatestBP] = useState<BloodPressure | null>(null);
  const [latestSugar, setLatestSugar] = useState<BloodSugar | null>(null);
  const sectionReveal = useRef(new Animated.Value(0)).current;
  const bpScale = useRef(new Animated.Value(1)).current;
  const sugarScale = useRef(new Animated.Value(1)).current;

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

  useEffect(() => {
    sectionReveal.setValue(0);
    Animated.timing(sectionReveal, {
      toValue: 1,
      duration: 480,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [latestBP, latestSugar, sectionReveal]);

  const animateScale = (value: Animated.Value, toValue: number) => {
    Animated.spring(value, {
      toValue,
      speed: 24,
      bounciness: 4,
      useNativeDriver: true,
    }).start();
  };

  const bpItemOpacity = sectionReveal.interpolate({
    inputRange: [0, 0.62],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const bpItemTranslateY = sectionReveal.interpolate({
    inputRange: [0, 0.62],
    outputRange: [12, 0],
    extrapolate: "clamp",
  });

  const sugarItemOpacity = sectionReveal.interpolate({
    inputRange: [0.2, 1],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const sugarItemTranslateY = sectionReveal.interpolate({
    inputRange: [0.2, 1],
    outputRange: [16, 0],
    extrapolate: "clamp",
  });

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
        <Animated.View
          style={{
            flex: 1,
            opacity: bpItemOpacity,
            transform: [{ translateY: bpItemTranslateY }],
          }}
        >
          <Animated.View style={{ transform: [{ scale: bpScale }] }}>
            <Pressable
              onPress={() => router.push("/bloodPressureScreen")}
              onPressIn={() => animateScale(bpScale, 0.97)}
              onPressOut={() => animateScale(bpScale, 1)}
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
          </Animated.View>
        </Animated.View>

        <Animated.View
          style={{
            flex: 1,
            opacity: sugarItemOpacity,
            transform: [{ translateY: sugarItemTranslateY }],
          }}
        >
          <Animated.View style={{ transform: [{ scale: sugarScale }] }}>
            <Pressable
              onPress={() => router.push("/sugarMeasurementsScreen")}
              onPressIn={() => animateScale(sugarScale, 0.97)}
              onPressOut={() => animateScale(sugarScale, 1)}
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
          </Animated.View>
        </Animated.View>
      </View>
    </View>
  );
};

export default MeasurementsCard;
