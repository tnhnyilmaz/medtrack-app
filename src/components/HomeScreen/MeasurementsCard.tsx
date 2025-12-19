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
import { Pressable, Text, View } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import styles from "../../styles/HomeScreenStyles";

const MeasurementsCard = () => {
  const { colors } = useTheme();
  const router = useRouter();

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

  // Format relative time (e.g., "2 saat önce")
  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Az önce";
    if (diffMins < 60) return `${diffMins} dk önce`;
    if (diffHours < 24) return `${diffHours} saat önce`;
    if (diffDays === 1) return "Dün";
    return `${diffDays} gün önce`;
  };

  return (
    <View style={{ gap: 10 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={[styles.bigText, { color: colors.text, fontSize: 24 }]}>
          Son Ölçümler
        </Text>

        <Text style={[{ color: colors.textSecondary }, styles.detailText]}>
          Detaylar
        </Text>
      </View>
      <View style={styles.measurementsContainer}>
        <Pressable
          onPress={() => router.push("/bloodPressureScreen")}
          style={[styles.measurementsCard, { backgroundColor: colors.surface }]}
        >
          <View
            style={[
              styles.measurementsIconContainer,
              { backgroundColor: colors.measurBackRed },
            ]}
          >
            <FontAwesome5
              name="heartbeat"
              size={24}
              color={colors.measurIconRed}
            />
          </View>
          <Text style={[styles.measurementsTitleText, { color: colors.text }]}>
            Tansiyon
          </Text>
          <Text style={[styles.measurementsValueText, { color: colors.text }]}>
            {latestBP ? `${latestBP.systolic}/${latestBP.diastolic}` : "--/--"}
          </Text>
          <Text style={{ color: colors.textSecondary }}>
            {latestBP ? formatTimeAgo(latestBP.measure_time) : "Ölçüm yok"}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/sugarMeasurementsScreen")}
          style={[styles.measurementsCard, { backgroundColor: colors.surface }]}
        >
          <View
            style={[
              styles.measurementsIconContainer,
              { backgroundColor: colors.measurBackOrange },
            ]}
          >
            <Entypo name="drop" size={24} color={colors.measurIconORange} />
          </View>
          <Text style={[styles.measurementsTitleText, { color: colors.text }]}>
            Şeker
          </Text>
          <Text style={[styles.measurementsValueText, { color: colors.text }]}>
            {latestSugar ? `${latestSugar.level}` : "--"}
          </Text>
          <Text style={{ color: colors.textSecondary }}>
            {latestSugar
              ? formatTimeAgo(latestSugar.measure_time)
              : "Ölçüm yok"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default MeasurementsCard;
