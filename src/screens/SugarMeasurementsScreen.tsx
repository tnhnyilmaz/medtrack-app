import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";
import AddSugarMeasurementModal from "../components/SugarMeasurementsScreen/AddSugarMeasurementModal";
import DateSelection from "../components/SugarMeasurementsScreen/DateSelection";
import SugarCard from "../components/SugarMeasurementsScreen/SugarCard";
import TopBar from "../components/SugarMeasurementsScreen/TopBar";
import { useTheme } from "../contexts/ThemeContext";
import styles from "../styles/SugarMeasurementsStyle";

const SugarMeasurementsScreen = () => {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("Daily");
  const tabs = ["Daily", "Weekly", "Monthly"];
  const mockSugarData = [
    {
      id: 1,
      level: 95,
      time: "08:00",
      status: "Normal",
      type: "Açlık",
      note: "Sabah kahvaltıdan önce ölçüldü.",
    },
    {
      id: 2,
      level: 145,
      time: "14:30",
      status: "Yüksek",
      type: "Tokluk",
      note: "Öğle yemeğinden 2 saat sonra.",
    },
    {
      id: 3,
      level: 110,
      time: "20:00",
      status: "Normal",
      type: "Tokluk",
      note: "Akşam yemeğinden sonra.",
    },
    {
      id: 4,
      level: 70,
      time: "23:00",
      status: "Düşük",
      type: "Tokluk",
      note: "Gece yatmadan önce, biraz halsizlik var.",
    },
  ];

  // Prepare data for the chart
  const chartDataSugar = mockSugarData.map((item) => ({
    value: item.level,
    label: item.time,
    dataPointText: item.level.toString(),
  }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.container}>
        <TopBar />
        <View
          style={[styles.dateContainer, { backgroundColor: colors.surface }]}
        >
          <View
            style={[
              styles.row,
              {
                gap: 5,
                justifyContent: "space-around",
                paddingHorizontal: 5,
                paddingVertical: 5,
              },
            ]}
          >
            {tabs.map((tab) => (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={{ flex: 1 }}
              >
                <Text
                  style={[
                    { textAlign: "center" },
                    activeTab === tab
                      ? [
                          styles.dateTextActive,
                          { backgroundColor: colors.success },
                        ]
                      : [
                          styles.dateTextInactive,
                          { color: colors.textSecondary },
                        ],
                  ]}
                >
                  {tab}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
        <DateSelection />
        <View
          style={{ height: 250, paddingVertical: 10, paddingHorizontal: 0 }}
        >
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
            xAxisLabelTextStyle={{ color: colors.textSecondary, fontSize: 10 }}
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
        </View>
        <FlatList
          data={mockSugarData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <SugarCard data={item} />}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
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
        onSave={(data) => {
          console.log("Saved sugar measurement:", data);
        }}
      />
    </SafeAreaView>
  );
};

export default SugarMeasurementsScreen;
