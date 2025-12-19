import React, { useEffect } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import AppBar from "../components/HomeScreen/AppBar";
import MeasurementsCard from "../components/HomeScreen/MeasurementsCard";
import MedList from "../components/HomeScreen/MedList";
import { useDevice } from "../contexts/DeviceContext";
import { useTheme } from "../contexts/ThemeContext";
import styles from "../styles/HomeScreenStyles";

const HomeScreen = () => {
  const { colors } = useTheme();
  const { deviceName, isConnected } = useDevice();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    if (isConnected && deviceName) {
      console.log(`📱 Hasta Ekranı Açıldı - Bağlı Cihaz: ${deviceName}`);
    } else {
      console.log("⚠️ Hasta Ekranı Açıldı - Cihaz Bağlı Değil");
    }
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // The child components will handle their own refresh
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppBar />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.secondary]}
            tintColor={colors.secondary}
          />
        }
      >
        <MedList />
        <MeasurementsCard />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
