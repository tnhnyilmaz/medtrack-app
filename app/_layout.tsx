import { Stack } from "expo-router";
import { DeviceProvider } from '../src/contexts/DeviceContext';
import { ThemeProvider } from '../src/contexts/ThemeContext';

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
          <Stack.Screen 
            name="bloodPressureScreen" 
            options={{
              animation: 'slide_from_right',
            }} 
          />
        </Stack>
      </DeviceProvider>
    </ThemeProvider>
  );
}
