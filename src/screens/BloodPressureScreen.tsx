import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";
import AddMeasurementModal from "../components/BloodPressureScreen/AddMeasurementModal";
import BloodCard from "../components/BloodPressureScreen/BloodCard";
import DateSelection from "../components/BloodPressureScreen/DateSelection";
import TopBar from "../components/BloodPressureScreen/TopBar";
import PeriodTabs from "../components/shared/PeriodTabs";
import { useTheme } from "../contexts/ThemeContext";
import {
  addBloodPressure,
  BloodPressure,
  getBloodPressuresByDate,
  getBloodPressuresByPeriod,
  PeriodType,
} from "../database/measurementRepository";
import styles from "../styles/BloodPressureStyle";

// Helper function to calculate blood pressure status
const calculateStatus = (systolic: number, diastolic: number, t: any): string => {
  if (systolic < 90 || diastolic < 60) {
    return t('bloodPressure.statusLow');
  } else if (systolic >= 140 || diastolic >= 90) {
    return t('bloodPressure.statusHigh');
  } else if (systolic >= 120 || diastolic >= 80) {
    return t('bloodPressure.statusElevated');
  }
  return t('bloodPressure.statusNormal');
};

// Helper function to format measure_time to display date and time
const formatTime = (measureTime: string): string => {
  try {
    const date = new Date(measureTime);
    return date.toLocaleString("tr-TR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return measureTime;
  }
};

interface BloodCardData {
  id: number;
  systolic: number;
  diastolic: number;
  pulse?: number;
  time: string;
  status: string;
  note: string;
}

interface BloodPressureScreenProps {
  autoOpenModal?: boolean;
}

const BloodPressureScreen = ({
  autoOpenModal = false,
}: BloodPressureScreenProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<PeriodType>("Günlük");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bloodPressures, setBloodPressures] = useState<BloodCardData[]>([]);
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

  // Fetch blood pressures from database based on selected period
  const fetchBloodPressures = useCallback(async () => {
    try {
      setLoading(true);
      let data;
      if (activeTab === "Günlük") {
        data = await getBloodPressuresByDate(selectedDate);
      } else {
        data = await getBloodPressuresByPeriod(activeTab);
      }
      // Map database records to BloodCard format
      const formattedData: BloodCardData[] = data.map((bp: BloodPressure) => ({
        id: bp.id || 0,
        systolic: bp.systolic,
        diastolic: bp.diastolic,
        pulse: bp.pulse,
        time: formatTime(bp.measure_time),
        status: calculateStatus(bp.systolic, bp.diastolic, t),
        note: bp.note || "",
      }));
      setBloodPressures(formattedData);
    } catch (error) {
      console.error("Error fetching blood pressures:", error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, selectedDate]);

  // Reload data when screen gains focus or when activeTab changes
  useFocusEffect(
    useCallback(() => {
      fetchBloodPressures();
    }, [fetchBloodPressures])
  );

  // Handle saving new blood pressure measurement
  const handleSave = async (data: {
    systolic: number;
    diastolic: number;
    pulse: number;
    time: string;
    note: string;
  }) => {
    try {
      await addBloodPressure({
        systolic: data.systolic,
        diastolic: data.diastolic,
        pulse: data.pulse || undefined,
        measure_time: new Date().toISOString(),
        note: data.note,
      });
      // Refresh the list after saving
      await fetchBloodPressures();
    } catch (error) {
      console.error("Error saving blood pressure:", error);
    }
  };

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab as PeriodType);
  };

  // Prepare data for the chart (reverse for chronological order)
  const chartData = [...bloodPressures].reverse();
  const chartDataSystolic = chartData.map((item) => ({
    value: item.systolic,
    label: new Date(item.time.split(" ")[0].split(".").reverse().join("-")).getDate().toString(),
    dataPointText: item.systolic.toString(),
  }));
  const chartDataDiastolic = chartData.map((item) => ({
    value: item.diastolic,
    dataPointText: item.diastolic.toString(),
  }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.container}>
        <TopBar />
        <PeriodTabs activeTab={activeTab} onTabChange={handleTabChange} />
        {activeTab === "Günlük" && (
          <DateSelection
            date={selectedDate}
            onDateChange={setSelectedDate}
          />
        )}
        <View
          style={{ height: 200, paddingVertical: 10, paddingHorizontal: 0 }}
        >
          {bloodPressures.length > 0 ? (
            <LineChart
              data={chartDataSystolic}
              data2={chartDataDiastolic}
              height={160}
              showVerticalLines
              spacing={44}
              initialSpacing={20}
              color1={colors.error || "red"}
              color2={colors.primary || "blue"}
              textColor1={colors.error || "red"}
              textColor2={colors.primary || "blue"}
              dataPointsHeight={6}
              dataPointsWidth={6}
              dataPointsColor1={colors.error || "red"}
              dataPointsColor2={colors.primary || "blue"}
              textShiftY={-2}
              textShiftX={-5}
              textFontSize={11}
              thickness={2}
              yAxisTextStyle={{ color: colors.textSecondary }}
              xAxisLabelTextStyle={{
                color: colors.textSecondary,
                fontSize: 10,
              }}
              noOfSections={4}
              yAxisThickness={0}
              xAxisThickness={1}
              xAxisColor={colors.border}
              rulesType="solid"
              rulesColor={colors.border ? colors.border + "40" : "#E0E0E0"}
              curved
              areaChart
              startFillColor1={colors.error || "red"}
              endFillColor1={colors.error || "red"}
              startOpacity1={0.2}
              endOpacity1={0.0}
              startFillColor2={colors.primary || "blue"}
              endFillColor2={colors.primary || "blue"}
              startOpacity2={0.2}
              endOpacity2={0.0}
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
                {loading ? "" : t('bloodPressure.noDataInChart')}
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
            data={bloodPressures}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <BloodCard data={item} />}
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
                  {t('bloodPressure.noMeasurementsInPeriod')}
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
            {t('bloodPressure.addButton')}
          </Text>
        </View>
      </TouchableOpacity>
      <AddMeasurementModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
      />
    </SafeAreaView>
  );
};

export default BloodPressureScreen;
