import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { useUser } from "../../contexts/UserContext";

const PhotoScreen = () => {
  const { colors } = useTheme();
  const { updateUser, completeOnboarding, user } = useUser();
  const router = useRouter();
  const [image, setImage] = useState<string | null>(user.photo || null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleFinish = async () => {
    updateUser({ photo: image });
    await completeOnboarding();
    router.replace("/");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.stepText, { color: colors.primary }]}>
            Adım 5 / 5
          </Text>
          <Text style={[styles.title, { color: colors.text }]}>
            Add a profile photo
          </Text>
          <Text style={styles.subtitle}>Help others recognize you.</Text>
        </View>

        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <View
                style={[
                  styles.placeholder,
                  { backgroundColor: colors.surface },
                ]}
              >
                <Ionicons
                  name="camera"
                  size={40}
                  color={colors.textSecondary}
                />
                <Text
                  style={[
                    styles.placeholderText,
                    { color: colors.textSecondary },
                  ]}
                >
                  Tap to add photo
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleFinish}
          >
            <Text style={styles.buttonText}>Finish</Text>
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
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderStyle: "dashed",
    borderRadius: 100,
  },
  placeholderText: {
    marginTop: 10,
    fontWeight: "500",
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

export default PhotoScreen;
