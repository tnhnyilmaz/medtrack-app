import { useTheme } from "@/src/contexts/ThemeContext";
import Entypo from "@expo/vector-icons/Entypo";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import styles from "../../styles/SugarMeasurementsStyle";

const DateSelection = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { colors } = useTheme();

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return date.toLocaleDateString("tr-TR", options);
  };

  const goToPrevDate = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const goToNextDate = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const onDateChange = (event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleDatePress = () => {
    setShowDatePicker(true);
  };
  return (
    <View style={styles.dateSelection}>
      <TouchableOpacity onPress={goToPrevDate}>
        <Entypo name="chevron-small-left" size={24} color="black" />
      </TouchableOpacity>

      <TouchableOpacity onPress={handleDatePress}>
        <Text
          style={[
            { fontSize: 16, fontWeight: "bold", padding: 10 },
            { color: colors.text },
          ]}
        >
          {formatDate(selectedDate)}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={goToNextDate}>
        <Entypo name="chevron-small-right" size={24} color="black" />
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onDateChange}
        />
      )}
    </View>
  );
};

export default DateSelection;
