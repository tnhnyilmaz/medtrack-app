import React from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppBar from "../components/HomeScreen/AppBar";
import MeasurementsCard from "../components/HomeScreen/MeasurementsCard";
import MedList from "../components/HomeScreen/MedList";
import { useTheme } from "../contexts/ThemeContext";
import styles from "../styles/HomeScreenStyles";

const HomeScreen = () => {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = React.useState(false);


  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <View style={styles.ambientLayer} pointerEvents="none">
        <View
          style={[
            styles.ambientCircleTop,
            { backgroundColor: `${colors.primary}18` },
          ]}
        />
        <View
          style={[
            styles.ambientCircleBottom,
            { backgroundColor: `${colors.secondary}12` },
          ]}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.secondary]}
            tintColor={colors.secondary}
          />
        }
      >
        <AppBar />
        <MedList />
        <MeasurementsCard />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
