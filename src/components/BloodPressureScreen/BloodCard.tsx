import { useTheme } from "@/src/contexts/ThemeContext";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";
import styles from "../../styles/BloodPressureStyle";

type BloodPressureStatus = "low" | "normal" | "elevated" | "high";

interface BloodDataProps {
  id: string | number;
  systolic: number;
  diastolic: number;
  pulse?: number;
  time: string;
  status: BloodPressureStatus;
  note: string;
}

const BloodCard = ({ data }: { data: BloodDataProps }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const statusStyle = useMemo(() => {
    const errorColor = colors.error || "#FF3B30";
    const warningColor = colors.warning || "#FF9500";
    const successColor = colors.success || "#34C759";
    const defaultColor = colors.textSecondary || "#8E8E93";

    if (data.status === "high") {
      return {
        color: errorColor,
        backgroundColor: `${errorColor}20`,
      };
    }

    if (data.status === "elevated" || data.status === "low") {
      return {
        color: warningColor,
        backgroundColor: `${warningColor}20`,
      };
    }

    if (data.status === "normal") {
      return {
        color: successColor,
        backgroundColor: `${successColor}20`,
      };
    }

    return {
      color: defaultColor,
      backgroundColor: `${defaultColor}20`,
    };
  }, [colors.error, colors.success, colors.textSecondary, colors.warning, data.status]);

  const getStatusLabel = (status: BloodPressureStatus) => {
    if (status === "low") return t("bloodPressure.statusLow");
    if (status === "elevated") return t("bloodPressure.statusElevated");
    if (status === "high") return t("bloodPressure.statusHigh");
    return t("bloodPressure.statusNormal");
  };

  return (
    <View
      style={[
        styles.bloodCard,
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
              { backgroundColor: colors.measurBackRed },
            ]}
          >
            <FontAwesome5 name="heartbeat" size={24} color={colors.measurIconRed} />
          </View>

          <View>
            <Text style={[styles.bloodText, { color: colors.text }]}>
              {data.systolic}/{data.diastolic} mmHg
            </Text>
            <View style={[styles.row, { gap: 10, flexWrap: "wrap" }]}>
              <Text style={{ color: colors.textSecondary || "gray" }}>{data.time}</Text>
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
                  {getStatusLabel(data.status)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <Pressable onPress={() => setExpanded((previous) => !previous)} style={{ padding: 5 }}>
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
            gap: 4,
          }}
        >
          {typeof data.pulse === "number" && (
            <Text style={{ color: colors.textSecondary }}>
              {t("bloodPressure.pulse")}: {data.pulse} BPM
            </Text>
          )}

          <Text style={{ fontWeight: "bold", color: colors.text }}>{t("bloodPressure.note")}</Text>
          <Text style={{ color: colors.textSecondary || "gray", fontStyle: "italic" }}>
            {data.note || t("bloodPressure.noNote")}
          </Text>
        </View>
      )}
    </View>
  );
};

export default BloodCard;
