import { useLanguage } from "@/src/contexts/LanguageContext";
import { useTheme } from "@/src/contexts/ThemeContext";
import Entypo from "@expo/vector-icons/Entypo";
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import styles from "../../styles/BloodPressureStyle";
interface DateSelectionProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

const DateSelection = ({ date, onDateChange }: DateSelectionProps) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { colors } = useTheme();
  const { language } = useLanguage();
  const { t } = useTranslation();


  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return date.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', options);
  };

  const goToPrevDate = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 1);
    onDateChange(newDate);
  };

  const goToNextDate = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    if (newDate <= todayStart) {
      onDateChange(newDate);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      onDateChange(selectedDate);
    }
  };

  const handleDatePress = () => {
    setShowDatePicker(true);
  };

  const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const isNextDisabled = dateStart >= todayStart;

  return (
    <View
      style={[
        styles.dateSelectionContainer,
        {
          backgroundColor: colors.surface,
          borderColor: `${colors.border}CC`,
        },
      ]}
    >
      <View style={styles.dateSelection}>
        <TouchableOpacity
          onPress={goToPrevDate}
          style={[styles.dateNavButton, { backgroundColor: `${colors.primary}14` }]}
        >
          <Entypo name="chevron-small-left" size={22} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDatePress} style={styles.dateTextWrap}>
          <Text style={[styles.dateText, { color: colors.text }]}>{formatDate(date)}</Text>
          <Text style={[styles.dateHint, { color: colors.textSecondary }]}>
            {t("bloodPressure.customDate")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={goToNextDate}
          style={[
            styles.dateNavButton,
            { backgroundColor: isNextDisabled ? `${colors.border}66` : `${colors.primary}14` },
          ]}
          disabled={isNextDisabled}
        >
          <Entypo
            name="chevron-small-right"
            size={22}
            color={isNextDisabled ? colors.textSecondary : colors.primary}
          />
        </TouchableOpacity>
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

export default DateSelection;
