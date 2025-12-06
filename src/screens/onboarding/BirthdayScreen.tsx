import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { useUser } from "../../contexts/UserContext";

const BirthdayScreen = () => {
  const { colors } = useTheme();
  const { updateUser, user } = useUser();
  const router = useRouter();
  const [date, setDate] = useState(user.birthday || new Date());
  const [showPicker, setShowPicker] = useState(Platform.OS === "ios");

  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  const handleNext = () => {
    updateUser({ birthday: date });
    router.push("/onboarding/photo");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.stepText, { color: colors.primary }]}>
            Step 3 of 4
          </Text>
          <Text style={[styles.title, { color: colors.text }]}>
            When is your birthday?
          </Text>
          <Text style={styles.subtitle}>
            Your age helps us track your health better.
          </Text>
        </View>

        <View style={styles.inputContainer}>
          {Platform.OS === "android" && (
            <TouchableOpacity
              onPress={() => setShowPicker(true)}
              style={[styles.dateButton, { backgroundColor: colors.surface }]}
            >
              <Text style={[styles.dateText, { color: colors.text }]}>
                {date.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          )}

          {showPicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onChange}
              maximumDate={new Date()}
              style={styles.datePicker}
            />
          )}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleNext}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  header: {
    marginTop: 40,
  },
  stepText: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  inputContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  datePicker: {
    width: "100%",
  },
  dateButton: {
    padding: 16,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  dateText: {
    fontSize: 18,
  },
  footer: {
    marginBottom: 20,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default BirthdayScreen;
