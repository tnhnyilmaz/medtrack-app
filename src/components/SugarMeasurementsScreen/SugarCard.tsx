import { useTheme } from "@/src/contexts/ThemeContext";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import styles from "../../styles/SugarMeasurementsStyle";

interface SugarDataProps {
  id: string | number;
  level: number;
  time: string;
  status: string;
  note: string;
  type: string; // Açlık/Tokluk
}

const SugarCard = ({ data }: { data: SugarDataProps }) => {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);

  const getStatusStyle = (status: string) => {
    const errorColor = colors.error || "#FF3B30";
    const warningColor = colors.warning || "#FF9500";
    const successColor = colors.success || "#34C759";
    const defaultColor = colors.textSecondary || "#8E8E93";

    switch (status) {
      case "Yüksek":
      case "Çok Yüksek":
        return {
          color: errorColor,
          backgroundColor: `${errorColor}20`,
        };
      case "Düşük":
        return {
          color: warningColor,
          backgroundColor: `${warningColor}20`,
        };
      case "Normal":
        return {
          color: successColor,
          backgroundColor: `${successColor}20`,
        };
      default:
        return {
          color: defaultColor,
          backgroundColor: `${defaultColor}20`,
        };
    }
  };

  const statusStyle = getStatusStyle(data.status);
  return (
    <View
      style={[
        styles.sugarCard,
        {
          backgroundColor: colors.surface,
          flexDirection: "column",
          alignItems: "stretch",
        },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: colors.measurBackRed }, // Or maybe a different color for sugar?
            ]}
          >
            <FontAwesome5
              name="tint" // Using tint (drop) icon for blood sugar
              size={24}
              color={colors.measurIconRed}
            />
          </View>
          <View>
            <Text style={styles.sugarText}>{data.level} mg/dL</Text>
            <View style={[styles.row, { gap: 10 }]}>
              <Text style={{ color: colors.textSecondary || "gray" }}>
                {data.time} - {data.type}
              </Text>
              <View
                style={{
                  backgroundColor: statusStyle.backgroundColor,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 6,
                }}
              >
                <Text
                  style={{
                    color: statusStyle.color,
                    fontWeight: "600",
                    fontSize: 12,
                  }}
                >
                  {data.status}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <Pressable
          onPress={() => setExpanded(!expanded)}
          style={{ padding: 5 }}
        >
          <Entypo
            name={expanded ? "chevron-small-up" : "chevron-small-down"}
            size={24}
            color={colors.text}
          />
        </Pressable>
      </View>

      {expanded && (
        <View
          style={{
            marginTop: 10,
            paddingTop: 10,
            borderTopWidth: 1,
            borderTopColor: colors.border || "#eee",
          }}
        >
          <Text
            style={{ fontWeight: "bold", color: colors.text, marginBottom: 2 }}
          >
            Not:
          </Text>
          <Text
            style={{
              color: colors.textSecondary || "gray",
              fontStyle: "italic",
            }}
          >
            {data.note}
          </Text>
        </View>
      )}
    </View>
  );
};

export default SugarCard;
