import { Ionicons } from "@expo/vector-icons";
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

const AppBar = () => {
  const { colors } = useTheme();
  const { user } = useUser();
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();

  const today = new Date().toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const displayName = user.name || t('profile.defaultUser');
  const photoUri = user.photo || DEFAULT_AVATAR;

  return (
    <View style={styles.header}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <TouchableOpacity
          onPress={() => router.push("/profileScreen")}
          style={styles.imgContainer}
        >
          {user.photo ? (
            <Image
              source={{ uri: photoUri }}
              style={styles.img}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[
                styles.img,
                {
                  backgroundColor: colors.surface,
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              <Ionicons
                name={user.gender === "female" ? "woman" : "man"}
                size={24}
                color={user.gender === "female" ? "#E91E63" : "#2196F3"}
              />
            </View>
          )}
        </TouchableOpacity>
        <View>
          <Text style={[styles.bigText, { color: colors.text }]}>
            {t('home.hello')}, {displayName}
          </Text>
          <Text style={[styles.mediumText, { color: colors.text }]}>
            {t('home.today')}, {today}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default AppBar;
