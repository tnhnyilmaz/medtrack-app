import { useTheme } from "@/src/contexts/ThemeContext";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";
import styles from "../../styles/SugarMeasurementsStyle";

type SugarType = "fasting" | "postprandial";
type SugarStatus = "low" | "normal" | "high" | "veryHigh";

interface SugarDataProps {
  id: string | number;
  level: number;
  time: string;
  status: SugarStatus;
  note: string;
  type: SugarType;
}

const SugarCard = ({ data }: { data: SugarDataProps }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const statusStyle = useMemo(() => {
    const errorColor = colors.error || "#FF3B30";
    const warningColor = colors.warning || "#FF9500";
    const successColor = colors.success || "#34C759";
    const defaultColor = colors.textSecondary || "#8E8E93";

    if (data.status === "high" || data.status === "veryHigh") {
      return {
        color: errorColor,
        backgroundColor: `${errorColor}20`,
      };
    }

    if (data.status === "low") {
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

  const getTypeLabel = (type: SugarType) => {
    if (type === "fasting") return t("sugar.fasting");
    return t("sugar.postprandial");
  };

  const getStatusLabel = (status: SugarStatus) => {
    if (status === "low") return t("sugar.statusLow");
    if (status === "high") return t("sugar.statusHigh");
    if (status === "veryHigh") return t("sugar.statusVeryHigh");
    return t("sugar.statusNormal");
  };

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
              { backgroundColor: colors.measurBackOrange },
            ]}
          >
            <FontAwesome5 name="tint" size={24} color={colors.measurIconORange} />
          </View>

          <View>
            <Text style={[styles.sugarText, { color: colors.text }]}>
              {data.level} mg/dL
            </Text>
            <View style={[styles.row, { gap: 10, flexWrap: "wrap" }]}>
              <Text style={{ color: colors.textSecondary || "gray" }}>
                {data.time} - {getTypeLabel(data.type)}
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
          }}
        >
          <Text style={{ fontWeight: "bold", color: colors.text, marginBottom: 2 }}>
            {t("sugar.note")}
          </Text>
          <Text style={{ color: colors.textSecondary || "gray", fontStyle: "italic" }}>
            {data.note || t("sugar.noNote")}
          </Text>
        </View>
      )}
    </View>
  );
};

export default SugarCard;
