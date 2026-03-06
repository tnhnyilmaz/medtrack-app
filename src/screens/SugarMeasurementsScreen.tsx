import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
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
import PeriodTabs from "../components/shared/PeriodTabs";
import AddSugarMeasurementModal from "../components/SugarMeasurementsScreen/AddSugarMeasurementModal";
import DateSelection from "../components/SugarMeasurementsScreen/DateSelection";
import SugarCard from "../components/SugarMeasurementsScreen/SugarCard";
import TopBar from "../components/SugarMeasurementsScreen/TopBar";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import {
  addBloodSugar,
  BloodSugar,
  getBloodSugarsByDate,
  getBloodSugarsByPeriod,
  PeriodType,
} from "../database/measurementRepository";
import styles from "../styles/SugarMeasurementsStyle";

type SugarType = "fasting" | "postprandial";
type SugarStatus = "low" | "normal" | "high" | "veryHigh";

const normalizeSugarType = (type: string): SugarType => {
  const normalized = type
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();

  if (normalized === "fasting" || normalized === "aclik") {
    return "fasting";
  }

  if (normalized === "postprandial" || normalized === "tokluk") {
    return "postprandial";
  }

  return "postprandial";
};

const getSugarStatus = (level: number, type: SugarType): SugarStatus => {
  if (type === "fasting") {
    if (level < 70) return "low";
    if (level <= 100) return "normal";
    if (level <= 125) return "high";
    return "veryHigh";
  }

  if (level < 70) return "low";
  if (level <= 140) return "normal";
  if (level <= 199) return "high";
  return "veryHigh";
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

interface SugarCardData {
  id: number;
  level: number;
  time: string;
  measureTime: string;
  status: SugarStatus;
  type: SugarType;
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
  const { language } = useLanguage();
  const locale = language === "tr" ? "tr-TR" : "en-US";

  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<PeriodType>("daily");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sugarMeasurements, setSugarMeasurements] = useState<SugarCardData[]>([]);
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

  const fetchSugarMeasurements = useCallback(async () => {
    try {
      setLoading(true);
      const data =
        activeTab === "daily"
          ? await getBloodSugarsByDate(selectedDate)
          : await getBloodSugarsByPeriod(activeTab);

      const formattedData: SugarCardData[] = data.map((sugar: BloodSugar) => {
        const normalizedType = normalizeSugarType(sugar.type);

        return {
          id: sugar.id ?? Date.parse(sugar.measure_time),
          level: sugar.level,
          time: formatDisplayTime(sugar.measure_time, locale),
          measureTime: sugar.measure_time,
          status: getSugarStatus(sugar.level, normalizedType),
          type: normalizedType,
          note: sugar.note || "",
        };
      });

      setSugarMeasurements(formattedData);
    } catch (error) {
      console.error("Error fetching sugar measurements:", error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, locale, selectedDate]);

  useFocusEffect(
    useCallback(() => {
      fetchSugarMeasurements();
    }, [fetchSugarMeasurements])
  );

  const handleSave = async (data: {
    level: number;
    type: SugarType;
    time: string;
    note: string;
  }) => {
    try {
      await addBloodSugar({
        level: data.level,
        type: data.type,
        measure_time: data.time,
        note: data.note,
      });

      await fetchSugarMeasurements();
    } catch (error) {
      console.error("Error saving sugar measurement:", error);
    }
  };

  const chronologicalData = useMemo(
    () => [...sugarMeasurements].reverse(),
    [sugarMeasurements]
  );

  const visibleLabelEvery = getVisibleLabelEvery(chronologicalData.length);

  const chartDataSugar = useMemo(
    () =>
      chronologicalData.map((item, index) => {
        const shouldRenderLabel =
          index % visibleLabelEvery === 0 || index === chronologicalData.length - 1;

        return {
          value: item.level,
          label: shouldRenderLabel
            ? formatChartLabel(item.measureTime, activeTab, locale)
            : "",
        };
      }),
    [activeTab, chronologicalData, locale, visibleLabelEvery]
  );

  const chartSpacing =
    chronologicalData.length <= 6 ? 42 : chronologicalData.length <= 12 ? 28 : 20;

  const chartMaxValue = useMemo(() => {
    if (chronologicalData.length === 0) {
      return 220;
    }

    const peakValue = Math.max(...chronologicalData.map((item) => item.level));
    return Math.max(160, Math.ceil((peakValue + 15) / 10) * 10);
  }, [chronologicalData]);

  const summary = useMemo(() => {
    if (sugarMeasurements.length === 0) {
      return null;
    }

    const values = sugarMeasurements.map((item) => item.level);
    const avg = Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
    const min = Math.min(...values);
    const max = Math.max(...values);

    const normalCount = sugarMeasurements.filter(
      (measurement) => measurement.status === "normal"
    ).length;

    const normalRate = Math.round((normalCount / sugarMeasurements.length) * 100);

    const oldest = chronologicalData[0];
    const latest = chronologicalData[chronologicalData.length - 1];
    const trendDelta = latest.level - oldest.level;

    const trendKey =
      Math.abs(trendDelta) < 5
        ? "stable"
        : trendDelta > 0
          ? "up"
          : "down";

    return {
      avg,
      min,
      max,
      normalRate,
      trendDelta,
      trendKey,
      count: sugarMeasurements.length,
    };
  }, [chronologicalData, sugarMeasurements]);

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.ambientLayer} pointerEvents="none">
        <View
          style={[
            styles.ambientCircleTop,
            { backgroundColor: `${colors.primary}16` },
          ]}
        />
        <View
          style={[
            styles.ambientCircleBottom,
            { backgroundColor: `${colors.measurIconORange}14` },
          ]}
        />
      </View>

      <View style={styles.container}>
        <TopBar />
        <PeriodTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "daily" && (
          <DateSelection date={selectedDate} onDateChange={setSelectedDate} />
        )}

        <View
          style={[
            styles.chartCard,
            {
              backgroundColor: colors.surface,
              borderColor: `${colors.border}CC`,
              shadowColor: colors.shadow,
            },
          ]}
        >
          <View style={styles.chartArea}>
            {sugarMeasurements.length > 0 ? (
              <LineChart
                data={chartDataSugar}
                height={200}
                showVerticalLines
                verticalLinesColor={colors.border ? `${colors.border}32` : "#D6D6D6"}
                verticalLinesStrokeDashArray={[4, 4]}
                verticalLinesThickness={1}
                verticalLinesUptoDataPoint
                spacing={chartSpacing}
                initialSpacing={14}
                endSpacing={16}
                color={colors.measurIconORange || "orange"}
                textColor={colors.measurIconORange || "orange"}
                dataPointsHeight={7}
                dataPointsWidth={7}
                dataPointsRadius={4}
                dataPointsColor={colors.measurIconORange || "orange"}
                focusEnabled
                showDataPointOnFocus
                showStripOnFocus
                showTextOnFocus={false}
                stripWidth={1}
                stripColor={colors.border ? `${colors.border}80` : "#9CA3AF80"}
                textShiftY={-2}
                textShiftX={-5}
                textFontSize={11}
                thickness={3}
                yAxisTextStyle={{
                  color: colors.textSecondary,
                  fontSize: 11,
                  fontWeight: "600",
                }}
                xAxisLabelTextStyle={{
                  color: colors.textSecondary,
                  fontSize: 10,
                  fontWeight: "600",
                }}
                maxValue={chartMaxValue}
                noOfSections={5}
                yAxisThickness={0}
                xAxisThickness={1}
                xAxisColor={colors.border}
                rulesType="solid"
                rulesColor={colors.border ? colors.border + "40" : "#E0E0E0"}
                rulesThickness={1}
                curved
                adjustToWidth
                isAnimated
                animateOnDataChange
                animationDuration={700}
                onDataChangeAnimationDuration={550}
                lineGradient
                lineGradientDirection="vertical"
                lineGradientStartColor={colors.measurIconORange || "#F59E0B"}
                lineGradientEndColor={colors.primary || "#22C55E"}
                startFillColor={colors.measurIconORange || "orange"}
                endFillColor={colors.measurIconORange || "orange"}
                startOpacity={0.26}
                endOpacity={0}
                areaChart
              />
            ) : (
              <View style={styles.emptyChartWrap}>
                <Text style={[styles.emptyChartText, { color: colors.textSecondary }]}>
                  {loading ? "" : t("sugar.noDataInChart")}
                </Text>
              </View>
            )}
          </View>
        </View>

        {summary && (
          <View style={styles.summaryWrap}>
            <View style={styles.summaryLegendRow}>
              <View style={styles.summaryLegendItem}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: colors.measurIconORange || "orange" },
                  ]}
                />
                <Text style={[styles.legendText, { color: colors.textSecondary }]}>
                  {t("sugar.legendLevel")}
                </Text>
              </View>
            </View>

            <View style={styles.summaryCardsRow}>
              <View
                style={[
                  styles.summaryCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: `${colors.border}CC`,
                  },
                ]}
              >
                <Text style={[styles.summaryCardLabel, { color: colors.textSecondary }]}>
                  {t("sugar.analysisAverage")}
                </Text>
                <Text style={[styles.summaryCardValue, { color: colors.text }]}>
                  {summary.avg} mg/dL
                </Text>
              </View>

              <View
                style={[
                  styles.summaryCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: `${colors.border}CC`,
                  },
                ]}
              >
                <Text style={[styles.summaryCardLabel, { color: colors.textSecondary }]}>
                  {t("sugar.analysisRange")}
                </Text>
                <Text style={[styles.summaryCardValue, { color: colors.text }]}>
                  {summary.min} - {summary.max}
                </Text>
              </View>

              <View
                style={[
                  styles.summaryCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: `${colors.border}CC`,
                  },
                ]}
              >
                <Text style={[styles.summaryCardLabel, { color: colors.textSecondary }]}>
                  {t("sugar.analysisNormalRate")}
                </Text>
                <Text style={[styles.summaryCardValue, { color: colors.text }]}>
                  %{summary.normalRate}
                </Text>
              </View>
            </View>

            <Text style={[styles.trendText, { color: colors.textSecondary }]}>
              {t(`sugar.trend.${summary.trendKey}`, {
                delta: Math.abs(summary.trendDelta),
                count: summary.count,
              })}
            </Text>
          </View>
        )}

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={sugarMeasurements}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <SugarCard data={item} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View
                style={[
                  styles.listEmptyWrap,
                  {
                    backgroundColor: colors.surface,
                    borderColor: `${colors.border}CC`,
                  },
                ]}
              >
                <Text style={[styles.listEmptyText, { color: colors.textSecondary }]}>
                  {t("sugar.noMeasurementsInPeriod")}
                </Text>
              </View>
            }
          />
        )}
      </View>

      <TouchableOpacity style={styles.addButtonWrap} onPress={() => setModalVisible(true)}>
        <View
          style={[
            styles.addBtn,
            {
              backgroundColor: colors.iconGreen,
              shadowColor: colors.shadow,
            },
          ]}
        >
          <Ionicons name="add-circle-outline" size={19} color="#fff" />
          <Text style={[styles.addBtnText, { color: "#fff" }]}>
            {t("sugar.addButton")}
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
