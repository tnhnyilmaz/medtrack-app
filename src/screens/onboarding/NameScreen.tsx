import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { useUser } from "../../contexts/UserContext";

const NameScreen = () => {
  const { colors } = useTheme();
  const { updateUser, user } = useUser();
  const router = useRouter();
  const [name, setName] = useState(user.name || "");

  const handleNext = () => {
    if (name.trim()) {
      updateUser({ name });
      router.push("/onboarding/email");
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.stepText, { color: colors.primary }]}>
              Step 1 of 4
            </Text>
            <Text style={[styles.title, { color: colors.text }]}>
              What is your name?
            </Text>
            <Text style={styles.subtitle}>Let us know how to address you.</Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.surface, color: colors.text },
              ]}
              placeholder="Your Name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
              autoFocus
            />
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: name.trim() ? colors.primary : "#ccc" },
              ]}
              onPress={handleNext}
              disabled={!name.trim()}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  },
  input: {
    padding: 16,
    borderRadius: 12,
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#E0E0E0",
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

export default NameScreen;
