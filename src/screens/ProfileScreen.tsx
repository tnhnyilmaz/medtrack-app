import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../contexts/ThemeContext";

const ProfileScreen = () => {
  const { colors } = useTheme();
  const router = useRouter();

  const menuItems = [
    {
      icon: <Ionicons name="settings-outline" size={24} color="#4A90E2" />,
      title: "Account Settings",
      onPress: () => console.log("Account Settings"),
    },
    {
      icon: <Ionicons name="notifications-outline" size={24} color="#50E3C2" />,
      title: "Notifications",
      onPress: () => console.log("Notifications"),
    },
    {
      icon: <Ionicons name="help-circle-outline" size={24} color="#4A90E2" />,
      title: "Help & Support",
      onPress: () => console.log("Help & Support"),
    },
  ];

  const infoItems = [
    {
      icon: <MaterialIcons name="cake" size={24} color="#4A90E2" />,
      label: "Date of Birth",
      value: "August 15, 1985",
    },
    {
      icon: <Feather name="calendar" size={24} color="#4A90E2" />,
      label: "Member Since",
      value: "January 10, 2022",
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Profile
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: "https://thumbs.dreamstime.com/b/unknown-man-profile-avatar-vector-male-office-icon-potrait-175425661.jpg",
              }}
              style={styles.avatar}
            />
            <View style={styles.editIconContainer}>
              <MaterialIcons name="edit" size={16} color="#fff" />
            </View>
          </View>
          <Text style={[styles.nameText, { color: colors.text }]}>
            Alex Doe
          </Text>
          <Text style={styles.emailText}>alex.doe@example.com</Text>
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
                  style={[styles.menuIconBox, { backgroundColor: "#F0F4FF" }]}
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

        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
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
    paddingBottom: 30,
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
    backgroundColor: "#4A90E2",
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
