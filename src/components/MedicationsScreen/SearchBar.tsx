import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { TextInput, View } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import styles from "../../styles/MedicationsScreenStyles";
const SearchBar = ({ onSearchChange }: { onSearchChange: (text: string) => void }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.searchBarContainer, { backgroundColor: colors.surface }]}>
      <Ionicons name="search" size={20} color={colors.textSecondary} />
      <TextInput
        placeholder="İlaç ara..."
        placeholderTextColor={colors.textSecondary}
        onChangeText={onSearchChange}
        style={[{color: colors.text}, styles.inputText]}
      />
    </View>
  );
};

export default SearchBar;
