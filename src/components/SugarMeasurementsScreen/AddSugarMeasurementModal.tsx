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
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
  const insets = useSafeAreaInsets();
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
      statusBarTranslucent
    >
      <View style={localStyles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={closeModal} />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
          style={localStyles.keyboardAvoidingView}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
              style={[
                localStyles.modalContainer,
                {
                  backgroundColor: colors.surface,
                  borderColor: `${colors.border}A8`,
                },
              ]}
            >
              <View
                style={[
                  localStyles.sheetHandle,
                  { backgroundColor: `${colors.textSecondary}4A` },
                ]}
              />

              <View style={localStyles.header}>
                <View style={localStyles.titleWrap}>
                  <Text style={[localStyles.title, { color: colors.text }]}>
                    {t("sugar.addTitle")}
                  </Text>
                  <Text style={[localStyles.subtitle, { color: colors.textSecondary }]}>
                    {t("sugar.measurementTime")}
                  </Text>
                </View>
                <Pressable
                  onPress={closeModal}
                  style={[
                    localStyles.closeButton,
                    {
                      backgroundColor: colors.background,
                      borderColor: `${colors.border}A8`,
                    },
                  ]}
                >
                  <AntDesign name="close" size={20} color={colors.text} />
                </Pressable>
              </View>

              <ScrollView
                style={localStyles.scrollView}
                contentContainerStyle={localStyles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <View
                  style={[
                    localStyles.sectionCard,
                    {
                      backgroundColor: colors.background,
                      borderColor: `${colors.border}AA`,
                    },
                  ]}
                >
                  <Text style={[localStyles.label, { color: colors.textSecondary }]}>
                    {t("sugar.measurementTime")}
                  </Text>
                  <View style={[localStyles.toggleContainer, { borderColor: `${colors.border}AA` }]}>
                    <Pressable
                      style={[
                        localStyles.toggleButton,
                        {
                          borderColor: `${colors.border}AA`,
                          backgroundColor: colors.surface,
                        },
                        measurementTime === "now" && {
                          backgroundColor: `${colors.primary}1A`,
                          borderColor: `${colors.primary}66`,
                        },
                      ]}
                      onPress={() => setMeasurementTime("now")}
                    >
                      <Text
                        style={[
                          localStyles.toggleText,
                          {
                            color:
                              measurementTime === "now"
                                ? colors.primary
                                : colors.textSecondary,
                          },
                        ]}
                      >
                        {t("sugar.now")}
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[
                        localStyles.toggleButton,
                        {
                          borderColor: `${colors.border}AA`,
                          backgroundColor: colors.surface,
                        },
                        measurementTime === "custom" && {
                          backgroundColor: `${colors.primary}1A`,
                          borderColor: `${colors.primary}66`,
                        },
                      ]}
                      onPress={() => setMeasurementTime("custom")}
                    >
                      <Text
                        style={[
                          localStyles.toggleText,
                          {
                            color:
                              measurementTime === "custom"
                                ? colors.primary
                                : colors.textSecondary,
                          },
                        ]}
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
                          { borderColor: `${colors.border}B5`, backgroundColor: colors.surface },
                        ]}
                      >
                        <Text style={[localStyles.timeCaption, { color: colors.textSecondary }]}>
                          {t("sugar.customDate")}
                        </Text>
                        <Text style={[localStyles.timeValue, { color: colors.text }]}>
                          {formatDate(customDateTime)}
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={() => setPickerMode("time")}
                        style={[
                          localStyles.customTimeButton,
                          { borderColor: `${colors.border}B5`, backgroundColor: colors.surface },
                        ]}
                      >
                        <Text style={[localStyles.timeCaption, { color: colors.textSecondary }]}>
                          {t("sugar.customHour")}
                        </Text>
                        <Text style={[localStyles.timeValue, { color: colors.text }]}>
                          {formatClock(customDateTime)}
                        </Text>
                      </Pressable>
                    </View>
                  )}
                </View>

                <View
                  style={[
                    localStyles.sectionCard,
                    {
                      backgroundColor: colors.background,
                      borderColor: `${colors.border}AA`,
                    },
                  ]}
                >
                  <View style={localStyles.inputGroup}>
                    <Text style={[localStyles.label, { color: colors.textSecondary }]}>
                      {t("sugar.sugarLevel")}
                    </Text>
                    <View
                      style={[
                        localStyles.inputWrapper,
                        {
                          borderColor: `${colors.border}B8`,
                          backgroundColor: colors.surface,
                        },
                      ]}
                    >
                      <TextInput
                        style={[localStyles.input, { color: colors.text }]}
                        placeholder="95"
                        placeholderTextColor={colors.textSecondary}
                        keyboardType="number-pad"
                        returnKeyType="done"
                        maxLength={3}
                        value={sugarLevel}
                        onChangeText={setSugarLevel}
                      />
                      <Text style={[localStyles.unitText, { color: colors.textSecondary }]}>
                        mg/dL
                      </Text>
                    </View>
                  </View>

                  <View style={localStyles.inputGroup}>
                    <Text style={[localStyles.label, { color: colors.textSecondary }]}>
                      {t("sugar.measurementType")}
                    </Text>
                    <View
                      style={[localStyles.toggleContainer, { borderColor: `${colors.border}AA` }]}
                    >
                      <Pressable
                        style={[
                          localStyles.toggleButton,
                          {
                            borderColor: `${colors.border}AA`,
                            backgroundColor: colors.surface,
                          },
                          measurementType === "fasting" && {
                            backgroundColor: `${colors.primary}1A`,
                            borderColor: `${colors.primary}66`,
                          },
                        ]}
                        onPress={() => setMeasurementType("fasting")}
                      >
                        <Text
                          style={[
                            localStyles.toggleText,
                            {
                              color:
                                measurementType === "fasting"
                                  ? colors.primary
                                  : colors.textSecondary,
                            },
                          ]}
                        >
                          {t("sugar.fasting")}
                        </Text>
                      </Pressable>
                      <Pressable
                        style={[
                          localStyles.toggleButton,
                          {
                            borderColor: `${colors.border}AA`,
                            backgroundColor: colors.surface,
                          },
                          measurementType === "postprandial" && {
                            backgroundColor: `${colors.primary}1A`,
                            borderColor: `${colors.primary}66`,
                          },
                        ]}
                        onPress={() => setMeasurementType("postprandial")}
                      >
                        <Text
                          style={[
                            localStyles.toggleText,
                            {
                              color:
                                measurementType === "postprandial"
                                  ? colors.primary
                                  : colors.textSecondary,
                            },
                          ]}
                        >
                          {t("sugar.postprandial")}
                        </Text>
                      </Pressable>
                    </View>
                  </View>

                  <View style={localStyles.inputGroup}>
                    <Text style={[localStyles.label, { color: colors.textSecondary }]}>
                      {t("sugar.note")}
                    </Text>
                    <View
                      style={[
                        localStyles.noteWrapper,
                        {
                          borderColor: `${colors.border}B8`,
                          backgroundColor: colors.surface,
                        },
                      ]}
                    >
                      <TextInput
                        style={[localStyles.noteInput, { color: colors.text }]}
                        placeholder={t("sugar.notePlaceholder")}
                        placeholderTextColor={colors.textSecondary}
                        multiline
                        value={note}
                        onChangeText={setNote}
                      />
                    </View>
                  </View>
                </View>
              </ScrollView>

              <View
                style={[
                  localStyles.footer,
                  {
                    borderTopColor: `${colors.border}A8`,
                    paddingBottom: Math.max(insets.bottom, 12),
                  },
                ]}
              >
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
              </View>

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
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const localStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  keyboardAvoidingView: {
    width: "100%",
    justifyContent: "flex-end",
  },
  modalContainer: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    width: "100%",
    height: "88%",
    maxHeight: "92%",
    overflow: "hidden",
  },
  sheetHandle: {
    alignSelf: "center",
    width: 52,
    height: 5,
    borderRadius: 99,
    marginTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 12,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titleWrap: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 4,
    paddingBottom: 12,
    gap: 12,
  },
  sectionCard: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "700",
  },
  toggleContainer: {
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    marginBottom: 10,
  },
  toggleButton: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  toggleText: {
    fontSize: 13,
    fontWeight: "700",
  },
  customTimeContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 2,
  },
  customTimeButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  timeCaption: {
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 15,
    fontWeight: "700",
  },
  inputGroup: {
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 54,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    paddingVertical: 0,
  },
  unitText: {
    fontSize: 12,
    fontWeight: "700",
  },
  noteWrapper: {
    borderWidth: 1,
    borderRadius: 14,
    minHeight: 92,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  noteInput: {
    fontSize: 15,
    fontWeight: "500",
    textAlignVertical: "top",
    minHeight: 74,
  },
  footer: {
    borderTopWidth: 1,
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  errorText: {
    marginBottom: 8,
    fontSize: 13,
    fontWeight: "600",
  },
  saveButton: {
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
});

export default AddSugarMeasurementModal;
