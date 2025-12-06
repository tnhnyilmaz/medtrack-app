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
import AddMeasurementModal from "../components/BloodPressureScreen/AddMeasurementModal";
import BloodCard from "../components/BloodPressureScreen/BloodCard";
import DateSelection from "../components/BloodPressureScreen/DateSelection";
import TopBar from "../components/BloodPressureScreen/TopBar";
import { useTheme } from "../contexts/ThemeContext";
import styles from "../styles/BloodPressureStyle";

const BloodPressureScreen = () => {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("Daily");
  const tabs = ["Daily", "Weekly", "Monthly"];
  const mockBloodData = [
    {
      id: 1,
      systolic: 120,
      diastolic: 80,
      pulse: 72,
      time: "09:30",
      status: "Normal",
      note: "Sabah ilacı alındıktan 1 saat sonra ölçüldü. Hafif baş ağrısı var.",
    },
    {
      id: 2,
      systolic: 135,
      diastolic: 85,
      pulse: 80,
      time: "14:15",
      status: "Yüksek",
      note: "Öğle yemeğinde biraz tuzlu kaçırdım, ondan olabilir.",
    },
    {
      id: 3,
      systolic: 110,
      diastolic: 70,
      pulse: 65,
      time: "21:00",
      status: "Düşük",
      note: "Yürüyüş sonrası dinlenme hali. Herhangi bir şikayet yok.",
    },
    {
      id: 4,
      systolic: 125,
      diastolic: 82,
      pulse: 78,
      time: "23:30",
      status: "Normal",
      note: "Gece yatmadan önce kontrol.",
    },
    {
      id: 5,
      systolic: 120,
      diastolic: 80,
      pulse: 72,
      time: "09:30",
      status: "Normal",
      note: "Sabah ilacı alındıktan 1 saat sonra ölçüldü. Hafif baş ağrısı var.",
    },
    {
      id: 6,
      systolic: 135,
      diastolic: 85,
      pulse: 80,
      time: "14:15",
      status: "Yüksek",
      note: "Öğle yemeğinde biraz tuzlu kaçırdım, ondan olabilir.",
    },
    {
      id: 7,
      systolic: 110,
      diastolic: 70,
      pulse: 65,
      time: "21:00",
      status: "Düşük",
      note: "Yürüyüş sonrası dinlenme hali. Herhangi bir şikayet yok.",
    },
    {
      id: 8,
      systolic: 125,
      diastolic: 82,
      pulse: 78,
      time: "23:30",
      status: "Normal",
      note: "Gece yatmadan önce kontrol.",
    },
    {
      id: 9,
      systolic: 120,
      diastolic: 80,
      pulse: 72,
      time: "09:30",
      status: "Normal",
      note: "Sabah ilacı alındıktan 1 saat sonra ölçüldü. Hafif baş ağrısı var.",
    },
    {
      id: 10,
      systolic: 135,
      diastolic: 85,
      pulse: 80,
      time: "14:15",
      status: "Yüksek",
      note: "Öğle yemeğinde biraz tuzlu kaçırdım, ondan olabilir.",
    },
    {
      id: 11,
      systolic: 110,
      diastolic: 70,
      pulse: 65,
      time: "21:00",
      status: "Düşük",
      note: "Yürüyüş sonrası dinlenme hali. Herhangi bir şikayet yok.",
    },
    {
      id: 12,
      systolic: 125,
      diastolic: 82,
      pulse: 78,
      time: "23:30",
      status: "Normal",
      note: "Gece yatmadan önce kontrol.",
    },
  ];
  // Prepare data for the chart
  // Sorting data by time for better visualization if needed, but assuming mock data is ordered or we just take it as is.
  // We need to reverse if the list is newest first, usually charts go left to right (oldest to newest).
  // Mock data seems to be daily?
  const chartDataSystolic = mockBloodData.map((item) => ({
    value: item.systolic,
    label: item.time,
    dataPointText: item.systolic.toString(),
  }));
  const chartDataDiastolic = mockBloodData.map((item) => ({
    value: item.diastolic,
    dataPointText: item.diastolic.toString(),
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
            data={chartDataSystolic}
            data2={chartDataDiastolic}
            height={200}
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
            xAxisLabelTextStyle={{ color: colors.textSecondary, fontSize: 10 }}
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
        </View>
        <FlatList
          data={mockBloodData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <BloodCard data={item} />}
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
            + Add Blood Pressure
          </Text>
        </View>
      </TouchableOpacity>
      <AddMeasurementModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={(data) => {
          console.log("Saved measurement:", data);
        }}
      />
    </SafeAreaView>
  );
};

export default BloodPressureScreen;
