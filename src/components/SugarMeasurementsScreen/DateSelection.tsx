import { useLanguage } from "@/src/contexts/LanguageContext";
import { useTheme } from "@/src/contexts/ThemeContext";
import Entypo from "@expo/vector-icons/Entypo";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import styles from "../../styles/SugarMeasurementsStyle";

interface DateSelectionProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

const DateSelection = ({ date, onDateChange }: DateSelectionProps) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { colors } = useTheme();
  const { language } = useLanguage();

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
    onDateChange(newDate);
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
  return (
    <View style={styles.dateSelection}>
      <TouchableOpacity onPress={goToPrevDate}>
        <Entypo name="chevron-small-left" size={24} color={colors.text} />
      </TouchableOpacity>

      <TouchableOpacity onPress={handleDatePress}>
        <Text
          style={[
            { fontSize: 16, fontWeight: "bold", padding: 10 },
            { color: colors.text },
          ]}
        >
          {formatDate(date)}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={goToNextDate}>
        <Entypo name="chevron-small-right" size={24} color={colors.text} />
      </TouchableOpacity>
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
