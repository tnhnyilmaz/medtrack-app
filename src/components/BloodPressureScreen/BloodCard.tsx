import { useTheme } from "@/src/contexts/ThemeContext";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import styles from "../../styles/BloodPressureStyle";

interface BloodDataProps {
  id: string | number; // DÜZELTME 1: Sayı da gelebilir
  systolic: number;
  diastolic: number;
  time: string;
  status: string;
  note: string;
}

const BloodCard = ({ data }: { data: BloodDataProps }) => {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);
  // --- RENK BELİRLEME FONKSİYONU ---
  const getStatusStyle = (status: string) => {
    // Varsayılan Renkler (Theme'den gelmezse diye fallback)
    const errorColor = colors.error || "#FF3B30"; // Kırmızı
    const warningColor = colors.warning || "#FF9500"; // Turuncu
    const successColor = colors.success || "#34C759"; // Yeşil
    const defaultColor = colors.textSecondary || "#8E8E93"; // Gri

    // Not: Hex kodunun sonuna '20' ekleyerek %15-20 opaklık sağlıyoruz.
    // Eğer theme renklerin 'rgb' formatındaysa bu çalışmayabilir, hex olmalı.
    switch (status) {
      case "Yüksek":
      case "Hafif Yüksek":
        return {
          color: errorColor,
          backgroundColor: `${errorColor}20`, // %20 opak kırmızı arka plan
        };
      case "Düşük":
        return {
          color: warningColor,
          backgroundColor: `${warningColor}20`, // %20 opak turuncu arka plan
        };
      case "Normal":
        return {
          color: successColor,
          backgroundColor: `${successColor}20`, // %20 opak yeşil arka plan
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
        styles.bloodCard,
        {
          backgroundColor: colors.surface,
          flexDirection: "column",
          alignItems: "stretch",
        },
      ]}
    >
      {/* --- ÜST KISIM --- */}
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
            <FontAwesome5
              name="heartbeat"
              size={24}
              color={colors.measurIconRed}
            />
          </View>
          <View>
            <Text style={styles.bloodText}>
              {data.systolic}/{data.diastolic} mmHg
            </Text>
            <View style={[styles.row, { gap: 10 }]}>
              <Text style={{ color: colors.textSecondary || "gray" }}>
                {data.time} -
              </Text>
              <View
                style={{
                  backgroundColor: statusStyle.backgroundColor,
                  paddingHorizontal: 8, // Sağdan soldan boşluk
                  paddingVertical: 2, // Yukarıdan aşağıdan boşluk
                  borderRadius: 6, // Köşeleri yuvarlatma
                }}
              >
                <Text
                  style={{
                    color: statusStyle.color,
                    fontWeight: "600",
                    fontSize: 12, // Status yazısını biraz küçülttük daha kibar durması için
                  }}
                >
                  {data.status}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Sağ Taraf: Ok İkonu */}
        <Pressable
          onPress={() => setExpanded(!expanded)}
          style={{ padding: 5 }}
        >
          <Entypo
            name={expanded ? "chevron-small-up" : "chevron-small-down"}
            size={24}
            color={colors.text} // DÜZELTME 2: Tema rengine bağlandı
          />
        </Pressable>
      </View>

      {/* --- ALT KISIM (Not Alanı) --- */}
      {expanded && (
        <View
          style={{
            marginTop: 10,
            paddingTop: 10,
            borderTopWidth: 1,
            borderTopColor: colors.border || "#eee", // Kenarlık rengini de temaya bağlayabilirsin
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

export default BloodCard;
