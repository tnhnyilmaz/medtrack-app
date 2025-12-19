import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";
import PeriodTabs from "../components/shared/PeriodTabs";
import AddSugarMeasurementModal from "../components/SugarMeasurementsScreen/AddSugarMeasurementModal";
import DateSelection from "../components/SugarMeasurementsScreen/DateSelection";
import SugarCard from "../components/SugarMeasurementsScreen/SugarCard";
import TopBar from "../components/SugarMeasurementsScreen/TopBar";
import { useTheme } from "../contexts/ThemeContext";
import {
  addBloodSugar,
  BloodSugar,
  getBloodSugarsByPeriod,
  PeriodType,
} from "../database/measurementRepository";
import styles from "../styles/SugarMeasurementsStyle";

// Helper function to calculate sugar status based on level and type
const calculateStatus = (level: number, type: string): string => {
  if (type === "Açlık") {
    // Fasting blood sugar levels
    if (level < 70) return "Düşük";
    if (level <= 100) return "Normal";
    if (level <= 125) return "Yüksek";
    return "Çok Yüksek";
  } else {
    // Postprandial (after meal) blood sugar levels
    if (level < 70) return "Düşük";
    if (level <= 140) return "Normal";
    if (level <= 199) return "Yüksek";
    return "Çok Yüksek";
  }
};

// Helper function to format measure_time to display time
const formatTime = (measureTime: string): string => {
  try {
    const date = new Date(measureTime);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return measureTime;
  }
};

interface SugarCardData {
  id: number;
  level: number;
  time: string;
  status: string;
  type: string;
  note: string;
}

interface SugarMeasurementsScreenProps {
  autoOpenModal?: boolean;
}

const SugarMeasurementsScreen = ({
  autoOpenModal = false,
}: SugarMeasurementsScreenProps) => {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<PeriodType>("Daily");
  const [sugarMeasurements, setSugarMeasurements] = useState<SugarCardData[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  // Auto-open modal if requested
  useEffect(() => {
    if (autoOpenModal) {
      // Small delay to ensure screen is fully loaded
      const timer = setTimeout(() => {
        setModalVisible(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [autoOpenModal]);

  // Fetch sugar measurements from database based on selected period
  const fetchSugarMeasurements = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getBloodSugarsByPeriod(activeTab);
      // Map database records to SugarCard format
      const formattedData: SugarCardData[] = data.map((sugar: BloodSugar) => ({
        id: sugar.id || 0,
        level: sugar.level,
        time: formatTime(sugar.measure_time),
        status: calculateStatus(sugar.level, sugar.type),
        type: sugar.type,
        note: sugar.note || "",
      }));
      setSugarMeasurements(formattedData);
    } catch (error) {
      console.error("Error fetching sugar measurements:", error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  // Reload data when screen gains focus or when activeTab changes
  useFocusEffect(
    useCallback(() => {
      fetchSugarMeasurements();
    }, [fetchSugarMeasurements])
  );

  // Handle saving new sugar measurement
  const handleSave = async (data: {
    level: number;
    type: string;
    time: string;
    note: string;
  }) => {
    try {
      await addBloodSugar({
        level: data.level,
        type: data.type,
        measure_time: new Date().toISOString(),
        note: data.note,
      });
      // Refresh the list after saving
      await fetchSugarMeasurements();
    } catch (error) {
      console.error("Error saving sugar measurement:", error);
    }
  };

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab as PeriodType);
  };

  // Prepare data for the chart (reverse for chronological order)
  const chartData = [...sugarMeasurements].reverse();
  const chartDataSugar = chartData.map((item) => ({
    value: item.level,
    label: item.time,
    dataPointText: item.level.toString(),
  }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.container}>
        <TopBar />
        <PeriodTabs activeTab={activeTab} onTabChange={handleTabChange} />
        <DateSelection />
        <View
          style={{ height: 250, paddingVertical: 10, paddingHorizontal: 0 }}
        >
          {sugarMeasurements.length > 0 ? (
            <LineChart
              data={chartDataSugar}
              height={200}
              spacing={44}
              initialSpacing={20}
              color={colors.measurIconORange || "orange"}
              textColor={colors.measurIconORange || "orange"}
              dataPointsHeight={6}
              dataPointsWidth={6}
              dataPointsColor={colors.measurIconORange || "orange"}
              textShiftY={-2}
              textShiftX={-5}
              textFontSize={11}
              thickness={2}
              yAxisTextStyle={{ color: colors.textSecondary }}
              xAxisLabelTextStyle={{
                color: colors.textSecondary,
                fontSize: 10,
              }}
              yAxisThickness={0}
              xAxisThickness={1}
              xAxisColor={colors.border}
              rulesType="solid"
              rulesColor={colors.border ? colors.border + "40" : "#E0E0E0"}
              curved
              startFillColor={colors.measurIconORange}
              endFillColor={colors.measurIconORange}
              startOpacity={0.2}
              endOpacity={0.0}
              areaChart
            />
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: colors.textSecondary }}>
                {loading ? "" : "Bu dönemde ölçüm yok"}
              </Text>
            </View>
          )}
        </View>
        {loading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={sugarMeasurements}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <SugarCard data={item} />}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: 40,
                }}
              >
                <Text style={{ color: colors.textSecondary }}>
                  Bu dönemde kan şekeri ölçümü yok.
                </Text>
              </View>
            }
          />
        )}
      </View>
      <TouchableOpacity
        style={{ padding: 15 }}
        onPress={() => setModalVisible(true)}
      >
        <View style={[styles.addBtn, { backgroundColor: colors.iconGreen }]}>
          <Text style={[styles.addBtnText, { color: "#fff" }]}>
            + Add Sugar Measurement
          </Text>
        </View>
      </TouchableOpacity>
      <AddSugarMeasurementModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
      />
    </SafeAreaView>
  );
};

export default SugarMeasurementsScreen;
