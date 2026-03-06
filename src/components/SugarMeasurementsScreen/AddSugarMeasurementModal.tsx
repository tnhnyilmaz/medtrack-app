import AntDesign from "@expo/vector-icons/AntDesign";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
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

type SugarType = "fasting" | "postprandial";

interface SugarMeasurementFormData {
  level: number;
  type: SugarType;
  time: string;
  note: string;
}

interface AddSugarMeasurementModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: SugarMeasurementFormData) => void;
}

const AddSugarMeasurementModal: React.FC<AddSugarMeasurementModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [measurementTime, setMeasurementTime] = useState<"now" | "custom">(
    "now"
  );
  const [sugarLevel, setSugarLevel] = useState("");
  const [measurementType, setMeasurementType] = useState<SugarType>("fasting");
  const [note, setNote] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [customDateTime, setCustomDateTime] = useState(new Date());
  const [pickerMode, setPickerMode] = useState<"date" | "time" | null>(null);

  const resetForm = () => {
    setSugarLevel("");
    setMeasurementType("fasting");
    setNote("");
    setValidationError(null);
    setMeasurementTime("now");
    setCustomDateTime(new Date());
    setPickerMode(null);
  };

  const closeModal = () => {
    onClose();
    resetForm();
  };

  const formatDate = (value: Date) =>
    value.toLocaleDateString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

  const formatClock = (value: Date) =>
    value.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });

  const handlePickerChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    const activeMode = pickerMode;

    if (Platform.OS === "android") {
      setPickerMode(null);
    }

    if (event.type === "dismissed" || !selectedDate || !activeMode) {
      return;
    }

    setCustomDateTime((current) => {
      const next = new Date(current);

      if (activeMode === "date") {
        next.setFullYear(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate()
        );
      } else {
        next.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0, 0);
      }

      return next;
    });

    if (Platform.OS === "ios") {
      setPickerMode(null);
    }
  };

  const handleSave = () => {
    const parsedLevel = Number.parseInt(sugarLevel, 10);

    if (!Number.isFinite(parsedLevel)) {
      setValidationError(t("sugar.errors.requiredLevel"));
      return;
    }

    if (parsedLevel < 20 || parsedLevel > 600) {
      setValidationError(t("sugar.errors.invalidLevel"));
      return;
    }

    setValidationError(null);

    const timestamp =
      measurementTime === "now" ? new Date().toISOString() : customDateTime.toISOString();

    onSave({
      level: parsedLevel,
      type: measurementType,
      time: timestamp,
      note: note.trim(),
    });

    closeModal();
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={closeModal}
    >
      <TouchableWithoutFeedback onPress={closeModal}>
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
                <View style={localStyles.header}>
                  <Pressable onPress={closeModal} style={localStyles.closeButton}>
                    <AntDesign name="close" size={24} color={colors.text} />
                  </Pressable>
                  <Text style={[localStyles.title, { color: colors.text }]}>
                    {t("sugar.addTitle")}
                  </Text>
                  <View style={{ width: 24 }} />
                </View>

                <Text style={[localStyles.label, { color: colors.textSecondary }]}>
                  {t("sugar.measurementTime")}
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
                      measurementTime === "now" && {
                        backgroundColor: colors.surface,
                        shadowColor: "#000",
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                        elevation: 2,
                      },
                    ]}
                    onPress={() => setMeasurementTime("now")}
                  >
                    <Text
                      style={{
                        color:
                          measurementTime === "now"
                            ? colors.text
                            : colors.textSecondary,
                      }}
                    >
                      {t("sugar.now")}
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      localStyles.toggleButton,
                      measurementTime === "custom" && {
                        backgroundColor: colors.surface,
                        shadowColor: "#000",
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                        elevation: 2,
                      },
                    ]}
                    onPress={() => setMeasurementTime("custom")}
                  >
                    <Text
                      style={{
                        color:
                          measurementTime === "custom"
                            ? colors.text
                            : colors.textSecondary,
                      }}
                    >
                      {t("sugar.custom")}
                    </Text>
                  </Pressable>
                </View>

                {measurementTime === "custom" && (
                  <View style={localStyles.customTimeContainer}>
                    <Pressable
                      onPress={() => setPickerMode("date")}
                      style={[
                        localStyles.customTimeButton,
                        { borderColor: colors.border, backgroundColor: colors.background },
                      ]}
                    >
                      <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                        {t("sugar.customDate")}
                      </Text>
                      <Text style={{ color: colors.text, fontWeight: "600" }}>
                        {formatDate(customDateTime)}
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={() => setPickerMode("time")}
                      style={[
                        localStyles.customTimeButton,
                        { borderColor: colors.border, backgroundColor: colors.background },
                      ]}
                    >
                      <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                        {t("sugar.customHour")}
                      </Text>
                      <Text style={{ color: colors.text, fontWeight: "600" }}>
                        {formatClock(customDateTime)}
                      </Text>
                    </Pressable>
                  </View>
                )}

                <View style={localStyles.inputGroup}>
                  <Text style={[localStyles.label, { color: colors.textSecondary }]}>
                    {t("sugar.sugarLevel")}
                  </Text>
                  <View
                    style={[localStyles.inputWrapper, { borderColor: colors.border }]}
                  >
                    <TextInput
                      style={[localStyles.input, { color: colors.text }]}
                      placeholder="95"
                      placeholderTextColor={colors.textSecondary}
                      keyboardType="number-pad"
                      value={sugarLevel}
                      onChangeText={setSugarLevel}
                    />
                    <Text style={{ color: colors.textSecondary, fontSize: 12 }}>mg/dL</Text>
                  </View>
                </View>

                <Text style={[localStyles.label, { color: colors.textSecondary }]}>
                  {t("sugar.measurementType")}
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
                      measurementType === "fasting" && {
                        backgroundColor: colors.surface,
                        shadowColor: "#000",
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                        elevation: 2,
                      },
                    ]}
                    onPress={() => setMeasurementType("fasting")}
                  >
                    <Text
                      style={{
                        color:
                          measurementType === "fasting"
                            ? colors.text
                            : colors.textSecondary,
                      }}
                    >
                      {t("sugar.fasting")}
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      localStyles.toggleButton,
                      measurementType === "postprandial" && {
                        backgroundColor: colors.surface,
                        shadowColor: "#000",
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                        elevation: 2,
                      },
                    ]}
                    onPress={() => setMeasurementType("postprandial")}
                  >
                    <Text
                      style={{
                        color:
                          measurementType === "postprandial"
                            ? colors.text
                            : colors.textSecondary,
                      }}
                    >
                      {t("sugar.postprandial")}
                    </Text>
                  </Pressable>
                </View>

                <View style={localStyles.inputGroup}>
                  <Text style={[localStyles.label, { color: colors.textSecondary }]}>
                    {t("sugar.note")}
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
                      placeholder={t("sugar.notePlaceholder")}
                      placeholderTextColor={colors.textSecondary}
                      multiline
                      value={note}
                      onChangeText={setNote}
                    />
                  </View>
                </View>

                {validationError && (
                  <Text style={[localStyles.errorText, { color: colors.error }]}>
                    {validationError}
                  </Text>
                )}

                <Pressable
                  style={[localStyles.saveButton, { backgroundColor: colors.iconGreen }]}
                  onPress={handleSave}
                >
                  <Text style={localStyles.saveButtonText}>
                    {t("sugar.saveMeasurement")}
                  </Text>
                </Pressable>

                {pickerMode && (
                  <DateTimePicker
                    value={customDateTime}
                    mode={pickerMode}
                    is24Hour
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={handlePickerChange}
                  />
                )}
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
  customTimeContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  customTimeButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
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
  errorText: {
    marginTop: -4,
    marginBottom: 10,
    fontSize: 13,
    fontWeight: "500",
  },
  saveButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 4,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddSugarMeasurementModal;
