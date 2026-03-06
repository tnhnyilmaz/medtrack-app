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
          borderColor: `${colors.border}B8`,
          shadowColor: colors.shadow,
        },
      ]}
    >
      <View style={styles.cardTopRow}>
        <View style={styles.cardLeft}>
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
            <View style={styles.cardMetaRow}>
              <Text style={[styles.cardMetaText, { color: colors.textSecondary }]}>
                {data.time} - {getTypeLabel(data.type)}
              </Text>
              <View
                style={[styles.statusPill, { backgroundColor: statusStyle.backgroundColor }]}
              >
                <Text
                  style={[styles.statusText, { color: statusStyle.color }]}
                >
                  {getStatusLabel(data.status)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <Pressable
          onPress={() => setExpanded((previous) => !previous)}
          style={[styles.expandButton, { backgroundColor: `${colors.primary}12` }]}
        >
          <Entypo
            name={expanded ? "chevron-small-up" : "chevron-small-down"}
            size={22}
            color={colors.primary}
          />
        </Pressable>
      </View>

      {expanded && (
        <View
          style={[styles.detailWrap, { borderTopColor: colors.border }]}
        >
          <Text style={[styles.detailLabel, { color: colors.text }]}>
            {t("sugar.note")}
          </Text>
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>
            {data.note || t("sugar.noNote")}
          </Text>
        </View>
      )}
    </View>
  );
};

export default SugarCard;
