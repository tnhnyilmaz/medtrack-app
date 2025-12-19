import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../contexts/ThemeContext";
import { useUser } from "../contexts/UserContext";

const DEFAULT_AVATAR =
  "https://thumbs.dreamstime.com/b/unknown-man-profile-avatar-vector-male-office-icon-potrait-175425661.jpg";

const ProfileScreen = () => {
  const { colors, toggleTheme, isDark } = useTheme();
  const { user, updateUserPhoto } = useUser();
  const router = useRouter();

  const formatBirthday = (date: Date | null) => {
    if (!date) return "Belirtilmedi";
    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getGenderDisplay = (gender: "male" | "female" | null) => {
    if (!gender) return "Belirtilmedi";
    return gender === "male" ? "Erkek" : "Kadın";
  };

  const displayName = user.name || "Kullanıcı";
  const displayEmail = user.email || "email@example.com";
  const photoUri = user.photo || DEFAULT_AVATAR;

  const handlePickPhoto = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Galeriye erişim izni gerekli!");
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

  const menuItems = [
    {
      icon: <Ionicons name="settings-outline" size={24} color="#4CAF50" />,
      title: "Hesap Ayarları",
      onPress: () => console.log("Account Settings"),
    },
    {
      icon: <Ionicons name="notifications-outline" size={24} color="#50E3C2" />,
      title: "Bildirimler",
      onPress: () => console.log("Notifications"),
    },
    {
      icon: <Ionicons name="help-circle-outline" size={24} color="#4CAF50" />,
      title: "Yardım & Destek",
      onPress: () => console.log("Help & Support"),
    },
  ];

  const infoItems = [
    {
      icon: <MaterialIcons name="cake" size={24} color="#4CAF50" />,
      label: "Doğum Tarihi",
      value: formatBirthday(user.birthday),
    },
    {
      icon: (
        <Ionicons
          name={user.gender === "female" ? "woman" : "man"}
          size={24}
          color={user.gender === "female" ? "#E91E63" : "#4CAF50"}
        />
      ),
      label: "Cinsiyet",
      value: getGenderDisplay(user.gender),
    },
    {
      icon: <Feather name="mail" size={24} color="#4CAF50" />,
      label: "E-posta",
      value: displayEmail,
    },
  ];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Profil</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={handlePickPhoto} activeOpacity={0.8}>
            <View style={styles.avatarContainer}>
              {user.photo ? (
                <Image source={{ uri: photoUri }} style={styles.avatar} />
              ) : (
                <View
                  style={[
                    styles.avatar,
                    {
                      backgroundColor: colors.surface,
                      justifyContent: "center",
                      alignItems: "center",
                    },
                  ]}
                >
                  <Ionicons
                    name={user.gender === "female" ? "woman" : "man"}
                    size={40}
                    color={user.gender === "female" ? "#E91E63" : "#4CAF50"}
                  />
                </View>
              )}
              <View style={styles.editIconContainer}>
                <MaterialIcons name="edit" size={16} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>
          <Text style={[styles.nameText, { color: colors.text }]}>
            {displayName}
          </Text>
          <Text style={styles.emailText}>{displayEmail}</Text>
        </View>

        <View style={styles.infoSection}>
          {infoItems.map((item, index) => (
            <View
              key={index}
              style={[styles.infoCard, { backgroundColor: colors.surface }]}
            >
              <View style={styles.infoIcon}>{item.icon}</View>
              <View>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {item.value}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, { backgroundColor: colors.surface }]}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <View
                  style={[styles.menuIconBox, { backgroundColor: "#E8F5E9" }]}
                >
                  {item.icon}
                </View>
                <Text style={[styles.menuItemText, { color: colors.text }]}>
                  {item.title}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Theme Switch */}
        <View
          style={[styles.themeSection, { backgroundColor: colors.surface }]}
        >
          <View style={styles.menuItemLeft}>
            <View
              style={[
                styles.menuIconBox,
                { backgroundColor: isDark ? "#2C2C2E" : "#FFF3E0" },
              ]}
            >
              <Ionicons
                name={isDark ? "moon" : "sunny"}
                size={24}
                color={isDark ? "#FFD60A" : "#FF9500"}
              />
            </View>
            <Text style={[styles.menuItemText, { color: colors.text }]}>
              {isDark ? "Karanlık Tema" : "Aydınlık Tema"}
            </Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: "#E5E5EA", true: "#34C759" }}
            thumbColor="#FFFFFF"
          />
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  profileSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatarContainer: {
    marginBottom: 15,
    position: "relative",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#fff",
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#4CAF50",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  emailText: {
    fontSize: 16,
    color: "#666",
  },
  infoSection: {
    marginBottom: 20,
    gap: 15,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  infoIcon: {
    marginRight: 15,
    width: 40,
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 12,
    color: "#999",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  menuSection: {
    marginBottom: 25,
    gap: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "500",
  },
  themeSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 15,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  logoutButton: {
    width: "100%",
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#FF6B6B",
    alignItems: "center",
    backgroundColor: "#FFF5F5",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6B6B",
  },
});

export default ProfileScreen;
