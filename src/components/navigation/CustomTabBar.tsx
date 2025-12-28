import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";

interface TabItem {
  name: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconOutline: keyof typeof Ionicons.glyphMap;
}

interface ActionMenuItem {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  color: string;
}

// These will be populated dynamically with translations
const getTabs = (t: any): TabItem[] => [
  {
    name: "index",
    label: t('navigation.home'),
    icon: "home",
    iconOutline: "home-outline",
  },
  {
    name: "calendar",
    label: t('navigation.myMedications'),
    icon: "medkit",
    iconOutline: "medkit-outline",
  },
  { name: "add", label: "", icon: "add", iconOutline: "add" },
  {
    name: "reports",
    label: t('navigation.reports'),
    icon: "bar-chart",
    iconOutline: "bar-chart-outline",
  },
  {
    name: "profile",
    label: t('navigation.profile'),
    icon: "person",
    iconOutline: "person-outline",
  },
];

const getActionMenuItems = (t: any): ActionMenuItem[] => [
  {
    label: t('navigation.addMed'),
    icon: "medical",
    route: "/addMedication",
    color: "#4CAF50",
  },
  {
    label: t('navigation.addBP'),
    icon: "heart",
    route: "/bloodPressureScreen?openModal=true",
    color: "#E53935",
  },
  {
    label: t('navigation.addSugar'),
    icon: "water",
    route: "/sugarMeasurementsScreen?openModal=true",
    color: "#FF9800",
  },
];

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [menuVisible, setMenuVisible] = useState(false);

  const tabs = getTabs(t);
  const actionMenuItems = getActionMenuItems(t);

  // Animation values
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const menuScale = useRef(new Animated.Value(0)).current;
  const menuTranslateY = useRef(new Animated.Value(50)).current;
  const buttonRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (menuVisible) {
      // Open animations
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(menuScale, {
          toValue: 1,
          friction: 6,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.spring(menuTranslateY, {
          toValue: 0,
          friction: 6,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(buttonRotation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
    // Close animation is handled in closeMenu function
  }, [menuVisible]);

  const handlePress = (tabName: string, index: number) => {
    if (tabName === "add") {
      setMenuVisible(true);
      return;
    }

    const route = state.routes[index];
    const isFocused = state.index === index;

    if (!isFocused) {
      navigation.navigate(route.name);
    }
  };

  const handleMenuItemPress = (route: string) => {
    setMenuVisible(false);
    setTimeout(() => {
      router.push(route as any);
    }, 150);
  };

  const closeMenu = () => {
    // Animate close first
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(menuScale, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(menuTranslateY, {
        toValue: 50,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(buttonRotation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // After animation completes, hide modal
      setMenuVisible(false);
    });
  };

  const rotateInterpolate = buttonRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  return (
    <>
      {/* Action Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="none"
        onRequestClose={closeMenu}
      >
        <Pressable style={styles.modalOverlay} onPress={closeMenu}>
          <Animated.View
            style={[styles.backdrop, { opacity: backdropOpacity }]}
          />
          <Animated.View
            style={[
              styles.menuContainer,
              {
                backgroundColor: colors.card,
                transform: [
                  { scale: menuScale },
                  { translateY: menuTranslateY },
                ],
                bottom: 100 + insets.bottom,
              },
            ]}
          >
            {actionMenuItems.map((item, index) => (
              <TouchableOpacity
                key={item.route}
                style={[
                  styles.menuItem,
                  index !== actionMenuItems.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border || "rgba(0,0,0,0.1)",
                  },
                ]}
                onPress={() => handleMenuItemPress(item.route)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.menuIconContainer,
                    { backgroundColor: item.color + "20" },
                  ]}
                >
                  <Ionicons name={item.icon} size={24} color={item.color} />
                </View>
                <Text style={[styles.menuItemText, { color: colors.text }]}>
                  {item.label}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            ))}
          </Animated.View>
        </Pressable>
      </Modal>

      {/* Tab Bar */}
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.card,
            paddingBottom: Math.max(insets.bottom, 10),
          },
        ]}
      >
        {tabs.map((tab, index) => {
          // "add" butonu için özel index hesaplama
          const actualIndex = index > 2 ? index - 1 : index;
          const isFocused = tab.name !== "add" && state.index === actualIndex;

          if (tab.name === "add") {
            return (
              <TouchableOpacity
                key={tab.name}
                style={styles.addButtonContainer}
                onPress={() => handlePress(tab.name, index)}
                activeOpacity={0.8}
              >
                <Animated.View
                  style={[
                    styles.addButton,
                    {
                      backgroundColor: colors.secondary,
                      transform: [{ rotate: rotateInterpolate }],
                    },
                  ]}
                >
                  <Ionicons name="add" size={32} color="#FFFFFF" />
                </Animated.View>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabButton}
              onPress={() => handlePress(tab.name, actualIndex)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isFocused ? tab.icon : tab.iconOutline}
                size={24}
                color={isFocused ? colors.secondary : colors.textSecondary}
              />
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isFocused ? colors.secondary : colors.textSecondary,
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    minHeight: 60,
    paddingTop: 10,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: "500",
  },
  addButtonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -30,
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  // Modal and Menu styles
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  menuContainer: {
    position: "absolute",
    width: Dimensions.get("window").width - 40,
    borderRadius: 16,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
  },
});
