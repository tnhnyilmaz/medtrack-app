import { UserProvider } from "@/src/contexts/UserContext";
import { seedDemoData } from "@/src/services/demoDataService";
import { requestNotificationPermissions } from "@/src/services/notificationService";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DeviceProvider } from "../src/contexts/DeviceContext";
import { LanguageProvider } from "../src/contexts/LanguageContext";
import { ThemeProvider } from "../src/contexts/ThemeContext";

export default function RootLayout() {
  // Request notification permissions on app start
  useEffect(() => {
    requestNotificationPermissions();
    seedDemoData();
  }, []);

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <ThemeProvider>
          <UserProvider>
            <DeviceProvider>
              <Stack
                initialRouteName="(tabs)"
                screenOptions={{
                  headerShown: false,
                  animation: "slide_from_right",
                  animationDuration: 300,
                }}
              >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="addMedication"
                  options={{
                    animation: "slide_from_bottom",
                    presentation: "modal",
                  }}
                />
                <Stack.Screen
                  name="addMeasurement"
                  options={{
                    animation: "slide_from_bottom",
                    presentation: "modal",
                  }}
                />
                <Stack.Screen
                  name="bloodPressureScreen"
                  options={{
                    animation: "slide_from_right",
                  }}
                />
                <Stack.Screen
                  name="sugarMeasurementsScreen"
                  options={{
                    animation: "slide_from_right",
                  }}
                />
                <Stack.Screen
                  name="medicationsScreen"
                  options={{
                    animation: "slide_from_right",
                  }}
                />
              </Stack>
            </DeviceProvider>
          </UserProvider>
        </ThemeProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

