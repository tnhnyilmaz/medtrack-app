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
import PeriodTabs from "../components/shared/PeriodTabs";
import AddSugarMeasurementModal from "../components/SugarMeasurementsScreen/AddSugarMeasurementModal";
import DateSelection from "../components/SugarMeasurementsScreen/DateSelection";
import SugarCard from "../components/SugarMeasurementsScreen/SugarCard";
import TopBar from "../components/SugarMeasurementsScreen/TopBar";
import { useTheme } from "../contexts/ThemeContext";
import {
  addBloodSugar,
  BloodSugar,
  getBloodSugarsByDate,
  getBloodSugarsByPeriod,
  PeriodType,
} from "../database/measurementRepository";
import styles from "../styles/SugarMeasurementsStyle";

// Helper function to calculate sugar status based on level and type
const calculateStatus = (level: number, type: string, t: any): string => {
  if (type === t('sugar.fasting') || type === "Açlık") {
    // Fasting blood sugar levels
    if (level < 70) return t('sugar.statusLow');
    if (level <= 100) return t('sugar.statusNormal');
    if (level <= 125) return t('sugar.statusHigh');
    return t('sugar.statusVeryHigh');
  } else {
    // Postprandial (after meal) blood sugar levels
    if (level < 70) return t('sugar.statusLow');
    if (level <= 140) return t('sugar.statusNormal');
    if (level <= 199) return t('sugar.statusHigh');
    return t('sugar.statusVeryHigh');
  }
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
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<PeriodType>("Günlük");
  const [selectedDate, setSelectedDate] = useState(new Date());
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
      let data;
      if (activeTab === "Günlük") {
        data = await getBloodSugarsByDate(selectedDate);
      } else {
        data = await getBloodSugarsByPeriod(activeTab);
      }
      // Map database records to SugarCard format
      const formattedData: SugarCardData[] = data.map((sugar: BloodSugar) => ({
        id: sugar.id || 0,
        level: sugar.level,
        time: formatTime(sugar.measure_time),
        status: calculateStatus(sugar.level, sugar.type, t),
        type: sugar.type,
        note: sugar.note || "",
      }));
      setSugarMeasurements(formattedData);
    } catch (error) {
      console.error("Error fetching sugar measurements:", error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, selectedDate]);

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
    label: new Date(item.time.split(" ")[0].split(".").reverse().join("-")).getDate().toString(),
    dataPointText: item.level.toString(),
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
                {loading ? "" : t('sugar.noDataInChart')}
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
                  {t('sugar.noMeasurementsInPeriod')}
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
            {t('sugar.addButton')}
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
