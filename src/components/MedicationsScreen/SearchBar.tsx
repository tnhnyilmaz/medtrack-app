import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { useTranslation } from "react-i18next";
import { TextInput, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import styles from "../../styles/MedicationsScreenStyles";

const SearchBar = ({
  value,
  onSearchChange,
}: {
  value: string;
  onSearchChange: (text: string) => void;
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View
      style={[
        styles.searchBarContainer,
        {
          backgroundColor: colors.surface,
          borderColor: `${colors.border}CC`,
        },
      ]}
    >
      <View style={[styles.searchIconWrap, { backgroundColor: `${colors.primary}14` }]}>
        <Ionicons name="search" size={16} color={colors.primary} />
      </View>

      <TextInput
        value={value}
        placeholder={t("medications.searchPlaceholder")}
        placeholderTextColor={colors.textSecondary}
        onChangeText={onSearchChange}
        style={[styles.inputText, { color: colors.text }]}
      />

      {value.length > 0 ? (
        <TouchableOpacity onPress={() => onSearchChange("")} style={styles.clearButton}>
          <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default SearchBar;
