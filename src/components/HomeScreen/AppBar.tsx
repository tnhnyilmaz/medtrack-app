import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useUser } from "../../contexts/UserContext";
import styles from "../../styles/HomeScreenStyles";

const DEFAULT_AVATAR =
  "https://thumbs.dreamstime.com/b/unknown-man-profile-avatar-vector-male-office-icon-potrait-175425661.jpg";

const capitalizeFirst = (value: string) =>
  value.length > 0 ? value.charAt(0).toUpperCase() + value.slice(1) : value;

const AppBar = () => {
  const { colors } = useTheme();
  const { user } = useUser();
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const locale = language === "tr" ? "tr-TR" : "en-US";

  const now = new Date();
  const weekdayLabel = capitalizeFirst(
    now.toLocaleDateString(locale, { weekday: "long" })
  );
  const fullDateLabel = now.toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const dayLabel = now.toLocaleDateString(locale, { day: "2-digit" });
  const todayLabel = language === "tr" ? "Bugun" : "Today";

  const displayName = user.name || t("profile.defaultUser");
  const photoUri = user.photo || DEFAULT_AVATAR;

  return (
    <LinearGradient
      colors={[
        `${colors.secondary}9E`,
        `${colors.iconGreen}7A`,
        `${colors.secondary}5E`,
      ] as [string, string, string]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.headerCard}
    >
      <View style={[styles.headerOrbLarge, { backgroundColor: `${colors.surface}22` }]} />
      <View style={[styles.headerOrbSmall, { backgroundColor: `${colors.surface}2E` }]} />

      <View style={styles.headerContent}>
        <View
          style={[
            styles.headerMainRow,
            {
              backgroundColor: `${colors.greenHome}44`,
              borderColor: `${colors.success}75`,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => router.push("/profileScreen")}
            style={styles.avatarButton}
            activeOpacity={0.85}
          >
            {user.photo ? (
              <Image source={{ uri: photoUri }} style={styles.avatarImage} resizeMode="cover" />
            ) : (
              <View
                style={[
                  styles.avatarFallback,
                  {
                    backgroundColor:
                      user.gender === "female"
                        ? "rgba(233, 30, 99, 0.16)"
                        : colors.iconBackBlue,
                  },
                ]}
              >
                <Ionicons
                  name={user.gender === "female" ? "woman" : "man"}
                  size={22}
                  color={user.gender === "female" ? "#E91E63" : "#2196F3"}
                />
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.headerIdentity}>
            <Text style={[styles.helloText, { color: colors.textSecondary }]}>
              {t("home.hello")}
            </Text>
            <Text style={[styles.nameText, { color: colors.text }]} numberOfLines={1}>
              {displayName}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.headerActionButton, { backgroundColor: colors.iconBackGreen }]}
            onPress={() => router.push("/profileScreen")}
            activeOpacity={0.8}
          >
            <Ionicons name="person-outline" size={19} color={colors.iconGreen} />
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.dateBanner,
            {
              backgroundColor: `${colors.greenHome}44`,
              borderColor: `${colors.success}75`,
            },
          ]}
        >
          <View style={[styles.dateDayBadge, { backgroundColor: colors.iconBackGreen }]}>
            <Text style={[styles.dateDayText, { color: colors.iconGreen }]}>{dayLabel}</Text>
          </View>

          <View style={styles.dateBannerContent}>
            <Text style={[styles.dateTagText, { color: colors.iconGreen }]} numberOfLines={1}>
              {todayLabel}
            </Text>
            <Text style={[styles.dateWeekdayText, { color: colors.text }]} numberOfLines={1}>
              {weekdayLabel}
            </Text>
            <Text
              style={[styles.dateFullText, { color: colors.textSecondary }]}
              numberOfLines={1}
            >
              {fullDateLabel}
            </Text>
          </View>

          <View style={[styles.dateIconBadge, { backgroundColor: colors.iconBackBlue }]}>
            <Ionicons name="calendar-clear-outline" size={18} color={colors.primary} />
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

export default AppBar;
