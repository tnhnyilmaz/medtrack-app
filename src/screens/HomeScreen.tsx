import React, { useEffect } from "react";
import { Text, View } from "react-native";
import AppBar from "../components/HomeScreen/AppBar";
import MeasurementsCard from "../components/HomeScreen/MeasurementsCard";
import MedList from "../components/HomeScreen/MedList";
import { useDevice } from "../contexts/DeviceContext";
import { useTheme } from "../contexts/ThemeContext";
import styles from "../styles/HomeScreenStyles";
const HomeScreen = () => {
  const { colors } = useTheme();
  const { deviceName, isConnected } = useDevice();

  useEffect(() => {
    if (isConnected && deviceName) {
      console.log(`📱 Hasta Ekranı Açıldı - Bağlı Cihaz: ${deviceName}`);
    } else {
      console.log("⚠️ Hasta Ekranı Açıldı - Cihaz Bağlı Değil");
    }
  }, []);
  const today = new Date().toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, gap: 10 },
      ]}
    >
      <AppBar />
      <View>
        <Text style={[styles.bigText, { color: colors.text }]}>
          Merhaba,Tuna
        </Text>
        <Text style={[styles.mediumText, { color: colors.text }]}>
          Bugün, {today}
        </Text>
      </View>
      <MedList />
      <MeasurementsCard />
    </View>
  );
};

export default HomeScreen;
