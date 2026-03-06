import React, { useEffect, useRef } from "react";
import { Animated, Easing, RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppBar from "../components/HomeScreen/AppBar";
import MeasurementsCard from "../components/HomeScreen/MeasurementsCard";
import MedList from "../components/HomeScreen/MedList";
import { useTheme } from "../contexts/ThemeContext";
import styles from "../styles/HomeScreenStyles";

const HomeScreen = () => {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = React.useState(false);
  const appBarAnim = useRef(new Animated.Value(0)).current;
  const medListAnim = useRef(new Animated.Value(0)).current;
  const measurementAnim = useRef(new Animated.Value(0)).current;
  const ambientFloat = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const entrance = Animated.stagger(120, [
      Animated.timing(appBarAnim, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(medListAnim, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(measurementAnim, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    entrance.start();
  }, [appBarAnim, medListAnim, measurementAnim]);

  useEffect(() => {
    const floatingLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(ambientFloat, {
          toValue: 1,
          duration: 4200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(ambientFloat, {
          toValue: 0,
          duration: 4200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    floatingLoop.start();

    return () => {
      floatingLoop.stop();
    };
  }, [ambientFloat]);

  const topCircleTranslateY = ambientFloat.interpolate({
    inputRange: [0, 1],
    outputRange: [-6, 8],
  });

  const bottomCircleTranslateY = ambientFloat.interpolate({
    inputRange: [0, 1],
    outputRange: [6, -5],
  });

  const sectionStyle = (anim: Animated.Value, startOffset: number) => ({
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [startOffset, 0],
        }),
      },
    ],
  });

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
        <Animated.View
          style={[
            styles.ambientCircleTop,
            { backgroundColor: `${colors.primary}18` },
            { transform: [{ translateY: topCircleTranslateY }] },
          ]}
        />
        <Animated.View
          style={[
            styles.ambientCircleBottom,
            { backgroundColor: `${colors.secondary}12` },
            { transform: [{ translateY: bottomCircleTranslateY }] },
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
        <Animated.View style={sectionStyle(appBarAnim, 22)}>
          <AppBar />
        </Animated.View>

        <Animated.View style={sectionStyle(medListAnim, 28)}>
          <MedList />
        </Animated.View>

        <Animated.View style={sectionStyle(measurementAnim, 34)}>
          <MeasurementsCard />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
