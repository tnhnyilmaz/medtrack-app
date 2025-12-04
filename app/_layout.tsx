import { ThemeProvider } from '../src/contexts/ThemeContext';
import { DeviceProvider } from '../src/contexts/DeviceContext';
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <DeviceProvider>
        <Stack 
          initialRouteName="index"
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            animationDuration: 300,
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen 
            name="addMedication" 
            options={{
              animation: 'slide_from_bottom',
              presentation: 'modal'
            }} 
          />
        </Stack>
      </DeviceProvider>
    </ThemeProvider>
  );
}
