import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from "react";
import { Text, View } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import styles from "../../styles/HomeScreenStyles";
const MeasurementsCard = () => {
  const { colors } = useTheme();

  return (
    <View style={{ gap: 10 }}>
      <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
        <Text style={[styles.bigText, { color: colors.text, fontSize: 24 }]}>
          Günün Ölçümleri
        </Text>

        <Text style={[{ color: colors.textSecondary }, styles.detailText]}>
          Detaylar
        </Text>
      </View>
      <View style={styles.measurementsContainer}>
        <View style={styles.measurementsCard}>
          <View
            style={[
              styles.measurementsIconContainer,
              { backgroundColor: colors.measurBackRed },
            ]}
          >
            <FontAwesome5
              name="heartbeat"
              size={24}
              color={colors.measurIconRed}
            />
          </View>
          <Text style={styles.measurementsTitleText}>Tansiyon</Text>
          <Text style={styles.measurementsValueText}>120/80</Text>
          <Text style={{ color: colors.textSecondary }}>2 hours ago</Text>
        </View>

        <View style={styles.measurementsCard}>
          <View
            style={[
              styles.measurementsIconContainer,
              { backgroundColor: colors.measurBackOrange },
            ]}
          >
            <Entypo name="drop" size={24} color={colors.measurIconORange} />
          </View>
          <Text style={styles.measurementsTitleText}>Şeker</Text>
          <Text style={styles.measurementsValueText}>95</Text>
          <Text style={{ color: colors.textSecondary }}>4 hours ago</Text>
        </View>
      </View>
    </View>
  );
};

export default MeasurementsCard;
