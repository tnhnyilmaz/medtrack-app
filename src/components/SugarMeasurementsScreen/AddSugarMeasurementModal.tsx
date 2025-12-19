import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

interface AddSugarMeasurementModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

const AddSugarMeasurementModal: React.FC<AddSugarMeasurementModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const { colors } = useTheme();
  const [measurementTime, setMeasurementTime] = useState<"Now" | "Custom">(
    "Now"
  );
  const [sugarLevel, setSugarLevel] = useState("");
  const [measurementType, setMeasurementType] = useState<"Açlık" | "Tokluk">(
    "Açlık"
  );
  const [note, setNote] = useState("");

  const handleSave = () => {
    const data = {
      level: Number(sugarLevel),
      type: measurementType,
      time:
        measurementTime === "Now"
          ? new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Custom",
      note,
    };
    onSave(data);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setSugarLevel("");
    setMeasurementType("Açlık");
    setNote("");
    setMeasurementTime("Now");
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={localStyles.overlay}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={localStyles.keyboardAvoidingView}
            >
              <View
                style={[
                  localStyles.modalContainer,
                  { backgroundColor: colors.surface },
                ]}
              >
                {/* Header */}
                <View style={localStyles.header}>
                  <Pressable onPress={onClose} style={localStyles.closeButton}>
                    <AntDesign name="close" size={24} color={colors.text} />
                  </Pressable>
                  <Text style={[localStyles.title, { color: colors.text }]}>
                    Şeker Ölçümü Ekle
                  </Text>
                  <View style={{ width: 24 }} />
                </View>

                {/* Measurement Time Toggle */}
                <Text
                  style={[localStyles.label, { color: colors.textSecondary }]}
                >
                  Ölçüm Zamanı
                </Text>
                <View
                  style={[
                    localStyles.toggleContainer,
                    { backgroundColor: colors.background },
                  ]}
                >
                  <Pressable
                    style={[
                      localStyles.toggleButton,
                      measurementTime === "Now" && {
                        backgroundColor: colors.surface,
                        shadowColor: "#000",
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                        elevation: 2,
                      },
                    ]}
                    onPress={() => setMeasurementTime("Now")}
                  >
                    <Text
                      style={{
                        color:
                          measurementTime === "Now"
                            ? colors.text
                            : colors.textSecondary,
                      }}
                    >
                      Şimdi
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      localStyles.toggleButton,
                      measurementTime === "Custom" && {
                        backgroundColor: colors.surface,
                        shadowColor: "#000",
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                        elevation: 2,
                      },
                    ]}
                    onPress={() => setMeasurementTime("Custom")}
                  >
                    <Text
                      style={{
                        color:
                          measurementTime === "Custom"
                            ? colors.text
                            : colors.textSecondary,
                      }}
                    >
                      Özel
                    </Text>
                  </Pressable>
                </View>

                {/* Sugar Level */}
                <View style={localStyles.inputGroup}>
                  <Text
                    style={[localStyles.label, { color: colors.textSecondary }]}
                  >
                    Şeker Seviyesi
                  </Text>
                  <View
                    style={[
                      localStyles.inputWrapper,
                      { borderColor: colors.border },
                    ]}
                  >
                    <TextInput
                      style={[localStyles.input, { color: colors.text }]}
                      placeholder="95"
                      placeholderTextColor={colors.textSecondary}
                      keyboardType="numeric"
                      value={sugarLevel}
                      onChangeText={setSugarLevel}
                    />
                    <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                      mg/dL
                    </Text>
                  </View>
                </View>

                {/* Measurement Type */}
                <Text
                  style={[localStyles.label, { color: colors.textSecondary }]}
                >
                  Ölçüm Türü
                </Text>
                <View
                  style={[
                    localStyles.toggleContainer,
                    { backgroundColor: colors.background },
                  ]}
                >
                  <Pressable
                    style={[
                      localStyles.toggleButton,
                      measurementType === "Açlık" && {
                        backgroundColor: colors.surface,
                        shadowColor: "#000",
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                        elevation: 2,
                      },
                    ]}
                    onPress={() => setMeasurementType("Açlık")}
                  >
                    <Text
                      style={{
                        color:
                          measurementType === "Açlık"
                            ? colors.text
                            : colors.textSecondary,
                      }}
                    >
                      Açlık
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      localStyles.toggleButton,
                      measurementType === "Tokluk" && {
                        backgroundColor: colors.surface,
                        shadowColor: "#000",
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                        elevation: 2,
                      },
                    ]}
                    onPress={() => setMeasurementType("Tokluk")}
                  >
                    <Text
                      style={{
                        color:
                          measurementType === "Tokluk"
                            ? colors.text
                            : colors.textSecondary,
                      }}
                    >
                      Tokluk
                    </Text>
                  </Pressable>
                </View>

                {/* Note */}
                <View style={localStyles.inputGroup}>
                  <Text
                    style={[localStyles.label, { color: colors.textSecondary }]}
                  >
                    Not
                  </Text>
                  <View
                    style={[
                      localStyles.inputWrapper,
                      {
                        borderColor: colors.border,
                        height: 80,
                        alignItems: "flex-start",
                      },
                    ]}
                  >
                    <TextInput
                      style={[
                        localStyles.input,
                        {
                          color: colors.text,
                          height: "100%",
                          textAlignVertical: "top",
                        },
                      ]}
                      placeholder="Not ekle..."
                      placeholderTextColor={colors.textSecondary}
                      multiline
                      value={note}
                      onChangeText={setNote}
                    />
                  </View>
                </View>

                {/* Save Button */}
                <Pressable
                  style={[
                    localStyles.saveButton,
                    { backgroundColor: colors.iconGreen },
                  ]}
                  onPress={handleSave}
                >
                  <Text style={localStyles.saveButtonText}>Ölçümü Kaydet</Text>
                </Pressable>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const localStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  keyboardAvoidingView: {
    width: "100%",
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  closeButton: {
    padding: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "500",
  },
  toggleContainer: {
    flexDirection: "row",
    borderRadius: 8,
    padding: 4,
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  row: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 20,
  },
  halfInput: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  saveButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddSugarMeasurementModal;
