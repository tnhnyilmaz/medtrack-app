import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateSelection from "../components/SugarMeasurementsScreen/DateSelection";
import SugarCard from "../components/SugarMeasurementsScreen/SugarCard";
import TopBar from "../components/SugarMeasurementsScreen/TopBar";
import { useTheme } from "../contexts/ThemeContext";
import styles from "../styles/SugarMeasurementsStyle";

const SugarMeasurementsScreen = () => {
  const { colors } = useTheme();
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
        <FlatList
          data={mockSugarData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <SugarCard data={item} />}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <TouchableOpacity style={{ padding: 15 }}>
        <View style={[styles.addBtn, { backgroundColor: colors.iconGreen }]}>
          <Text style={[styles.addBtnText, { color: "#fff" }]}>
            + Add Sugar Measurement
          </Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SugarMeasurementsScreen;
