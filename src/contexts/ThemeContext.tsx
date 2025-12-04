import { Colors } from '../constants/Colors';
import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';

type ThemeContextType = {
  colors: typeof Colors.light;
  toggleTheme: () => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemTheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemTheme === 'dark');
  
  const toggleTheme = () => setIsDark(!isDark);
  
  const colors = Colors[isDark ? 'dark' : 'light'];
  
  return (
    <ThemeContext.Provider value={{ colors, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}