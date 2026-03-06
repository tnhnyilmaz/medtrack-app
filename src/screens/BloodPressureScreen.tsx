import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import {
  addBloodPressure,
  BloodPressure,
  getBloodPressuresByDate,
  getBloodPressuresByPeriod,
  PeriodType,
} from "../database/measurementRepository";
import styles from "../styles/BloodPressureStyle";

type BloodPressureStatus = "low" | "normal" | "elevated" | "high";

const getBloodPressureStatus = (
  systolic: number,
  diastolic: number
): BloodPressureStatus => {
  if (systolic < 90 || diastolic < 60) {
    return "low";
  }

  if (systolic >= 140 || diastolic >= 90) {
    return "high";
  }

  if (systolic >= 120 || diastolic >= 80) {
    return "elevated";
  }

  return "normal";
};

const formatDisplayTime = (measureTime: string, locale: string): string => {
  const date = new Date(measureTime);

  if (Number.isNaN(date.getTime())) {
    return measureTime;
  }

  return date.toLocaleString(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatChartLabel = (
  measureTime: string,
  period: PeriodType,
  locale: string
): string => {
  const date = new Date(measureTime);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  if (period === "daily") {
    return date.toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (period === "weekly") {
    return date.toLocaleDateString(locale, {
      weekday: "short",
      day: "2-digit",
    });
  }

  return date.toLocaleDateString(locale, {
    day: "2-digit",
    month: "2-digit",
  });
};

const getVisibleLabelEvery = (length: number) => {
  if (length <= 8) return 1;
  if (length <= 16) return 2;
  if (length <= 30) return 3;
  return 4;
};

interface BloodCardData {
  id: number;
  systolic: number;
  diastolic: number;
  pulse?: number;
  time: string;
  measureTime: string;
  status: BloodPressureStatus;
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
  const { language } = useLanguage();
  const locale = language === "tr" ? "tr-TR" : "en-US";

  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<PeriodType>("daily");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bloodPressures, setBloodPressures] = useState<BloodCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!autoOpenModal) {
      return;
    }

    const timer = setTimeout(() => {
      setModalVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [autoOpenModal]);

  const fetchBloodPressures = useCallback(async () => {
    try {
      setLoading(true);
      const data =
        activeTab === "daily"
          ? await getBloodPressuresByDate(selectedDate)
          : await getBloodPressuresByPeriod(activeTab);

      const formattedData: BloodCardData[] = data.map((bp: BloodPressure) => ({
        id: bp.id ?? Date.parse(bp.measure_time),
        systolic: bp.systolic,
        diastolic: bp.diastolic,
        pulse: bp.pulse,
        time: formatDisplayTime(bp.measure_time, locale),
        measureTime: bp.measure_time,
        status: getBloodPressureStatus(bp.systolic, bp.diastolic),
        note: bp.note || "",
      }));

      setBloodPressures(formattedData);
    } catch (error) {
      console.error("Error fetching blood pressures:", error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, locale, selectedDate]);

  useFocusEffect(
    useCallback(() => {
      fetchBloodPressures();
    }, [fetchBloodPressures])
  );

  const handleSave = async (data: {
    systolic: number;
    diastolic: number;
    pulse?: number;
    time: string;
    note: string;
  }) => {
    try {
      await addBloodPressure({
        systolic: data.systolic,
        diastolic: data.diastolic,
        pulse: data.pulse,
        measure_time: data.time,
        note: data.note,
      });

      await fetchBloodPressures();
    } catch (error) {
      console.error("Error saving blood pressure:", error);
    }
  };

  const chronologicalData = useMemo(
    () => [...bloodPressures].reverse(),
    [bloodPressures]
  );

  const visibleLabelEvery = getVisibleLabelEvery(chronologicalData.length);

  const chartDataSystolic = useMemo(
    () =>
      chronologicalData.map((item, index) => {
        const shouldRenderLabel =
          index % visibleLabelEvery === 0 || index === chronologicalData.length - 1;

        return {
          value: item.systolic,
          label: shouldRenderLabel
            ? formatChartLabel(item.measureTime, activeTab, locale)
            : "",
          dataPointText: item.systolic.toString(),
        };
      }),
    [activeTab, chronologicalData, locale, visibleLabelEvery]
  );

  const chartDataDiastolic = useMemo(
    () =>
      chronologicalData.map((item) => ({
        value: item.diastolic,
        dataPointText: item.diastolic.toString(),
      })),
    [chronologicalData]
  );

  const chartSpacing =
    chronologicalData.length <= 6 ? 44 : chronologicalData.length <= 12 ? 30 : 22;

  const summary = useMemo(() => {
    if (bloodPressures.length === 0) {
      return null;
    }

    const systolicValues = bloodPressures.map((item) => item.systolic);
    const diastolicValues = bloodPressures.map((item) => item.diastolic);

    const avgSystolic = Math.round(
      systolicValues.reduce((sum, value) => sum + value, 0) / systolicValues.length
    );
    const avgDiastolic = Math.round(
      diastolicValues.reduce((sum, value) => sum + value, 0) / diastolicValues.length
    );

    const maxSystolic = Math.max(...systolicValues);
    const minDiastolic = Math.min(...diastolicValues);

    const oldest = chronologicalData[0];
    const latest = chronologicalData[chronologicalData.length - 1];
    const trendDelta = latest.systolic - oldest.systolic;

    const trendKey =
      Math.abs(trendDelta) < 3
        ? "stable"
        : trendDelta > 0
          ? "up"
          : "down";

    return {
      avgSystolic,
      avgDiastolic,
      maxSystolic,
      minDiastolic,
      trendDelta,
      trendKey,
      count: bloodPressures.length,
    };
  }, [bloodPressures, chronologicalData]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.container}>
        <TopBar />
        <PeriodTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "daily" && (
          <DateSelection date={selectedDate} onDateChange={setSelectedDate} />
        )}

        <View style={{ height: 220, paddingVertical: 10, paddingHorizontal: 0 }}>
          {bloodPressures.length > 0 ? (
            <LineChart
              data={chartDataSystolic}
              data2={chartDataDiastolic}
              height={170}
              showVerticalLines
              spacing={chartSpacing}
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
              endOpacity1={0}
              startFillColor2={colors.primary || "blue"}
              endFillColor2={colors.primary || "blue"}
              startOpacity2={0.2}
              endOpacity2={0}
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
                {loading ? "" : t("bloodPressure.noDataInChart")}
              </Text>
            </View>
          )}
        </View>

        {summary && (
          <View style={{ marginBottom: 10, gap: 8 }}>
            <View style={{ flexDirection: "row", gap: 14 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: colors.error || "red",
                  }}
                />
                <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                  {t("bloodPressure.legendSystolic")}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: colors.primary || "blue",
                  }}
                />
                <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                  {t("bloodPressure.legendDiastolic")}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 8 }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: colors.surface,
                  borderRadius: 10,
                  padding: 10,
                }}
              >
                <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                  {t("bloodPressure.analysisAverage")}
                </Text>
                <Text style={{ color: colors.text, fontWeight: "700", marginTop: 4 }}>
                  {summary.avgSystolic}/{summary.avgDiastolic}
                </Text>
              </View>

              <View
                style={{
                  flex: 1,
                  backgroundColor: colors.surface,
                  borderRadius: 10,
                  padding: 10,
                }}
              >
                <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                  {t("bloodPressure.analysisPeak")}
                </Text>
                <Text style={{ color: colors.text, fontWeight: "700", marginTop: 4 }}>
                  {summary.maxSystolic}/{summary.minDiastolic}
                </Text>
              </View>

              <View
                style={{
                  flex: 1,
                  backgroundColor: colors.surface,
                  borderRadius: 10,
                  padding: 10,
                }}
              >
                <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                  {t("bloodPressure.analysisCount")}
                </Text>
                <Text style={{ color: colors.text, fontWeight: "700", marginTop: 4 }}>
                  {summary.count}
                </Text>
              </View>
            </View>

            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
              {t(`bloodPressure.trend.${summary.trendKey}`, {
                delta: Math.abs(summary.trendDelta),
              })}
            </Text>
          </View>
        )}

        {loading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
                  {t("bloodPressure.noMeasurementsInPeriod")}
                </Text>
              </View>
            }
          />
        )}
      </View>

      <TouchableOpacity style={{ padding: 15 }} onPress={() => setModalVisible(true)}>
        <View style={[styles.addBtn, { backgroundColor: colors.iconGreen }]}>
          <Text style={[styles.addBtnText, { color: "#fff" }]}>
            {t("bloodPressure.addButton")}
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
