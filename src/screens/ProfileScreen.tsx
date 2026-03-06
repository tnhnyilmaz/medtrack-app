import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Animated,
  Easing,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import { useUser } from "../contexts/UserContext";

const DEFAULT_AVATAR =
  "https://thumbs.dreamstime.com/b/unknown-man-profile-avatar-vector-male-office-icon-potrait-175425661.jpg";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

type ProfileInfoItem = {
  icon: IoniconName;
  label: string;
  value: string;
  tint: string;
};

type ProfileSettingItem = {
  icon: IoniconName;
  title: string;
  tint: string;
  iconColor: string;
  onPress: () => void | Promise<void>;
};

const ProfileScreen = () => {
  const { colors, toggleTheme, isDark } = useTheme();
  const { user, updateUserPhoto, resetOnboarding } = useUser();
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();
  const router = useRouter();

  const revealAnim = useRef(new Animated.Value(0)).current;
  const cardScales = useRef([
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
  ]).current;

  useFocusEffect(
    useCallback(() => {
      revealAnim.setValue(0);
      Animated.timing(revealAnim, {
        toValue: 1,
        duration: 560,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }, [revealAnim])
  );

  const formatBirthday = (date: Date | null) => {
    if (!date) return t("profile.unspecified");
    return date.toLocaleDateString(language === "tr" ? "tr-TR" : "en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getGenderDisplay = (gender: "male" | "female" | null) => {
    if (!gender) return t("profile.unspecified");
    return gender === "male" ? t("profile.male") : t("profile.female");
  };

  const displayName = user.name || t("profile.defaultUser");
  const displayEmail = user.email || "email@example.com";
  const photoUri = user.photo || DEFAULT_AVATAR;

  const handlePickPhoto = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(t("profile.galleryPermission"));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await updateUserPhoto(result.assets[0].uri);
    }
  };

  const handleOpenSupport = async () => {
    const supportEmail = "mailto:yilmaz.tunahaz@gmail.com";
    const canOpen = await Linking.canOpenURL(supportEmail);
    if (canOpen) {
      await Linking.openURL(supportEmail);
    }
  };

  const handleLogout = () => {
    Alert.alert(t("profile.logout"), displayName, [
      { text: t("medications.cancel"), style: "cancel" },
      {
        text: t("profile.logout"),
        style: "destructive",
        onPress: async () => {
          await resetOnboarding();
          router.replace("/(tabs)/profile");
        },
      },
    ]);
  };

  const animateCardScale = (index: number, toValue: number) => {
    Animated.spring(cardScales[index], {
      toValue,
      speed: 26,
      bounciness: 4,
      useNativeDriver: true,
    }).start();
  };

  const infoItems: ProfileInfoItem[] = [
    {
      icon: "calendar-outline",
      label: t("profile.birthday"),
      value: formatBirthday(user.birthday),
      tint: colors.success,
    },
    {
      icon: user.gender === "female" ? "female-outline" : "male-outline",
      label: t("profile.gender"),
      value: getGenderDisplay(user.gender),
      tint: user.gender === "female" ? "#E91E63" : colors.primary,
    },
    {
      icon: "mail-outline",
      label: t("profile.email"),
      value: displayEmail,
      tint: colors.info,
    },
  ];

  const settingsItems: ProfileSettingItem[] = [
    {
      icon: "person-circle-outline",
      title: t("profile.accountSettings"),
      tint: `${colors.primary}22`,
      iconColor: colors.primary,
      onPress: () => router.push("/onboarding/name"),
    },
    {
      icon: "notifications-outline",
      title: t("profile.notifications"),
      tint: `${colors.warning}22`,
      iconColor: colors.warning,
      onPress: () => Linking.openSettings(),
    },
    {
      icon: "help-circle-outline",
      title: t("profile.helpSupport"),
      tint: `${colors.info}22`,
      iconColor: colors.info,
      onPress: handleOpenSupport,
    },
  ];

  const heroRevealStyle = {
    opacity: revealAnim,
    transform: [
      {
        translateY: revealAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [18, 0],
        }),
      },
    ],
  };

  const detailRevealStyle = {
    opacity: revealAnim.interpolate({
      inputRange: [0.15, 1],
      outputRange: [0, 1],
      extrapolate: "clamp",
    }),
    transform: [
      {
        translateY: revealAnim.interpolate({
          inputRange: [0.15, 1],
          outputRange: [14, 0],
          extrapolate: "clamp",
        }),
      },
    ],
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={styles.ambientLayer} pointerEvents="none">
        <View style={[styles.ambientTop, { backgroundColor: `${colors.primary}18` }]} />
        <View style={[styles.ambientBottom, { backgroundColor: `${colors.secondary}12` }]} />
      </View>

      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t("profile.title")}</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={heroRevealStyle}>
          <View
            style={[
              styles.heroCard,
              {
                backgroundColor: colors.surface,
                borderColor: `${colors.border}CC`,
                shadowColor: colors.shadow,
              },
            ]}
          >
            <View style={styles.heroMainRow}>
              <Pressable style={styles.avatarContainer} onPress={handlePickPhoto}>
                {user.photo ? (
                  <Image source={{ uri: photoUri }} style={styles.avatar} resizeMode="cover" />
                ) : (
                  <View style={[styles.avatar, styles.avatarFallback, { backgroundColor: colors.background }]}>
                    <Ionicons
                      name={user.gender === "female" ? "female" : "male"}
                      size={38}
                      color={user.gender === "female" ? "#E91E63" : colors.primary}
                    />
                  </View>
                )}
                <View style={[styles.avatarEditBadge, { backgroundColor: colors.primary }]}>
                  <MaterialIcons name="edit" size={15} color="#fff" />
                </View>
              </Pressable>

              <View style={styles.heroTextWrap}>
                <Text style={[styles.heroName, { color: colors.text }]} numberOfLines={1}>
                  {displayName}
                </Text>
                <Text style={[styles.heroEmail, { color: colors.textSecondary }]} numberOfLines={1}>
                  {displayEmail}
                </Text>
                <Text style={[styles.heroMeta, { color: colors.textSecondary }]} numberOfLines={1}>
                  {`${getGenderDisplay(user.gender)} - ${formatBirthday(user.birthday)}`}
                </Text>
              </View>

              <Pressable
                onPress={handlePickPhoto}
                style={[
                  styles.heroActionButton,
                  {
                    backgroundColor: colors.background,
                    borderColor: `${colors.border}CC`,
                  },
                ]}
              >
                <Ionicons name="camera-outline" size={18} color={colors.primary} />
              </Pressable>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={detailRevealStyle}>
          <View style={styles.infoGrid}>
            {infoItems.map((item) => (
              <View
                key={item.label}
                style={[
                  styles.infoCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: `${colors.border}CC`,
                    shadowColor: colors.shadow,
                  },
                ]}
              >
                <View style={[styles.infoIconWrap, { backgroundColor: `${item.tint}1F` }]}>
                  <Ionicons name={item.icon} size={18} color={item.tint} />
                </View>
                <View style={styles.infoTextWrap}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                    {item.label}
                  </Text>
                  <Text style={[styles.infoValue, { color: colors.text }]} numberOfLines={1}>
                    {item.value}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        <Animated.View style={detailRevealStyle}>
          <View style={styles.cardsColumn}>
            {settingsItems.map((item, index) => (
              <Animated.View
                key={item.title}
                style={{
                  transform: [{ scale: cardScales[index] }],
                }}
              >
                <Pressable
                  style={[
                    styles.settingCard,
                    {
                      backgroundColor: colors.surface,
                      borderColor: `${colors.border}CC`,
                    },
                  ]}
                  onPress={item.onPress}
                  onPressIn={() => animateCardScale(index, 0.98)}
                  onPressOut={() => animateCardScale(index, 1)}
                >
                  <View style={styles.settingLeft}>
                    <View style={[styles.settingIconWrap, { backgroundColor: item.tint }]}>
                      <Ionicons name={item.icon} size={20} color={item.iconColor} />
                    </View>
                    <Text style={[styles.settingText, { color: colors.text }]}>{item.title}</Text>
                  </View>

                  <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                </Pressable>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        <Animated.View style={detailRevealStyle}>
          <View
            style={[
              styles.preferenceCard,
              {
                backgroundColor: colors.surface,
                borderColor: `${colors.border}CC`,
              },
            ]}
          >
            <View style={styles.preferenceHeader}>
              <View style={[styles.preferenceIconWrap, { backgroundColor: isDark ? "#2C2C2E" : "#FFF3E0" }]}>
                <Ionicons
                  name={isDark ? "moon" : "sunny"}
                  size={22}
                  color={isDark ? "#FFD60A" : "#FF9500"}
                />
              </View>
              <View style={styles.preferenceTextWrap}>
                <Text style={[styles.preferenceTitle, { color: colors.text }]}>
                  {isDark ? t("profile.darkTheme") : t("profile.lightTheme")}
                </Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: "#E5E5EA", true: colors.secondary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </Animated.View>

        <Animated.View style={detailRevealStyle}>
          <View
            style={[
              styles.preferenceCard,
              {
                backgroundColor: colors.surface,
                borderColor: `${colors.border}CC`,
              },
            ]}
          >
            <View style={styles.preferenceHeader}>
              <View style={[styles.preferenceIconWrap, { backgroundColor: `${colors.info}1E` }]}>
                <Ionicons name="language" size={22} color={colors.info} />
              </View>
              <View style={styles.preferenceTextWrap}>
                <Text style={[styles.preferenceTitle, { color: colors.text }]}>
                  {t("profile.selectLanguage")}
                </Text>
                <Text style={[styles.preferenceSubtext, { color: colors.textSecondary }]}>
                  {t("profile.language")}
                </Text>
              </View>
            </View>

            <View style={styles.languageRow}>
              <Pressable
                onPress={() => changeLanguage("tr")}
                style={[
                  styles.languageChip,
                  {
                    borderColor: `${colors.info}AA`,
                    backgroundColor: language === "tr" ? colors.info : "transparent",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.languageChipText,
                    { color: language === "tr" ? "#fff" : colors.info },
                  ]}
                >
                  TR
                </Text>
              </Pressable>

              <Pressable
                onPress={() => changeLanguage("en")}
                style={[
                  styles.languageChip,
                  {
                    borderColor: `${colors.info}AA`,
                    backgroundColor: language === "en" ? colors.info : "transparent",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.languageChipText,
                    { color: language === "en" ? "#fff" : colors.info },
                  ]}
                >
                  EN
                </Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>

        <Pressable
          style={[
            styles.logoutButton,
            {
              borderColor: `${colors.error}99`,
              backgroundColor: `${colors.error}16`,
            },
          ]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={18} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>{t("profile.logout")}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  ambientLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  ambientTop: {
    position: "absolute",
    top: -100,
    right: -100,
    width: 240,
    height: 240,
    borderRadius: 120,
  },
  ambientBottom: {
    position: "absolute",
    bottom: 150,
    left: -110,
    width: 260,
    height: 260,
    borderRadius: 130,
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: -0.4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 28,
    gap: 12,
  },
  heroCard: {
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  heroMainRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  avatarFallback: {
    justifyContent: "center",
    alignItems: "center",
  },
  avatarEditBadge: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  heroTextWrap: {
    flex: 1,
    paddingRight: 10,
  },
  heroName: {
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -0.3,
  },
  heroEmail: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: "600",
  },
  heroMeta: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
  },
  heroActionButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  infoGrid: {
    gap: 8,
  },
  infoCard: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  infoIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  infoTextWrap: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
  infoValue: {
    marginTop: 1,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: -0.15,
  },
  cardsColumn: {
    gap: 8,
  },
  settingCard: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: 8,
  },
  settingIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  settingText: {
    fontSize: 15,
    fontWeight: "700",
  },
  preferenceCard: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  preferenceHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  preferenceIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  preferenceTextWrap: {
    flex: 1,
  },
  preferenceTitle: {
    fontSize: 15,
    fontWeight: "800",
  },
  preferenceSubtext: {
    marginTop: 1,
    fontSize: 12,
    fontWeight: "600",
  },
  languageRow: {
    marginTop: 12,
    flexDirection: "row",
    gap: 8,
  },
  languageChip: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  languageChipText: {
    fontSize: 13,
    fontWeight: "800",
  },
  logoutButton: {
    marginTop: 6,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "800",
  },
});

export default ProfileScreen;
