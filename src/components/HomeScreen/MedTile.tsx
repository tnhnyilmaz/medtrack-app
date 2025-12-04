import { useTheme } from "@/src/contexts/ThemeContext";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Text, View } from "react-native";
import styles from "../../styles/HomeScreenStyles";

const MedTile = ({med}: {med: {name: string; time: string; status: string}}) => {
  const { colors } = useTheme();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "taken":
        return <Entypo name="check" size={24} color="white" />;
      case "missed":
        return <MaterialIcons name="close" size={24} color="white" />;
      case "future":
        return <MaterialIcons name="schedule" size={24} color={"white"} />;
      default:
        return <MaterialIcons name="schedule" size={24} color="white" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "taken":
        return colors.success;
      case "missed":
        return colors.error;
      case "future":
        return colors.gray;
      default:
        return colors.textSecondary;
    }
  };
  return (
    <View style={{ paddingVertical: 10 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              height: 50,
              width: 50,
              backgroundColor: colors.lowSuccess,
              borderRadius: 5,
              marginRight: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialIcons name="medication" size={20} color={colors.success} />
          </View>
          <View>
            <Text
              style={[
                styles.contextTitle,
                { color: colors.text, fontSize: 16 },
              ]}
            >
              {med.name}
            </Text>
            <Text
              style={[styles.subContextTitle, { color: colors.textSecondary }]}
            >
              {med.time}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.medCheckContainer,
            { backgroundColor: getStatusColor(med.status) },
          ]}
        >
          {getStatusIcon(med.status)}
        </View>
      </View>
      <View
        style={{
          backgroundColor: colors.divider,
          height: 1,
          borderRadius: 5,
          marginTop: 10,
        }}
      ></View>
    </View>
  );
};

export default MedTile;
