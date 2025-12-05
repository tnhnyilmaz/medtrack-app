import React, { useState } from "react";
import { FlatList, Pressable, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BloodCard from "../components/BloodPressureScreen/BloodCard";
import DateSelection from "../components/BloodPressureScreen/DateSelection";
import TopBar from "../components/BloodPressureScreen/TopBar";
import { useTheme } from "../contexts/ThemeContext";
import styles from "../styles/BloodPressureStyle";

const BloodPressureScreen = () => {
  const { colors } = useTheme();
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
          data={mockBloodData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <BloodCard  data={item} />}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <TouchableOpacity style={{padding:15}}>
        <View style={[styles.addBtn,{backgroundColor:colors.iconGreen}]} >
          <Text style={[styles.addBtnText,{color:"#fff"}]}>+  Add Blood Pressure</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default BloodPressureScreen;
