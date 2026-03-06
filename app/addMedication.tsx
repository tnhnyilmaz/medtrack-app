import MedClock from "@/src/components/AddMedicationScreen/MedClock";
import MedDose from "@/src/components/AddMedicationScreen/MedDose";
import MedForm from "@/src/components/AddMedicationScreen/MedForm";
import MedName from "@/src/components/AddMedicationScreen/MedName";
import MedTime from "@/src/components/AddMedicationScreen/MedTime";
import { ScheduleType, useMedicationForm, WEEK_DAYS } from "@/src/hooks/useMedicationForm";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../src/contexts/ThemeContext";
import styles from "../src/styles/AddMedicationStyles";

const weekDayLabels: Record<string, string> = {
  monday: "Pzt",
  tuesday: "Sal",
  wednesday: "Car",
  thursday: "Per",
  friday: "Cum",
  saturday: "Cmt",
  sunday: "Paz",
};

const AddMedicationScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const {
    medName,
    setMedName,
    durationValue,
    setDurationValue,
    durationType,
    setDurationType,
    frequency,
    setFrequency,
    timeInputs,
    setTimeInputs,
    showTimePicker,
    setShowTimePicker,
    tempHour,
    setTempHour,
    tempMinute,
    setTempMinute,
    withFood,
    setWithFood,
    medicineForm,
    setMedicineForm,
    dosageAmount,
    setDosageAmount,
    dosageUnit,
    setDosageUnit,
    scheduleType,
    setScheduleType,
    selectedWeekDays,
    toggleWeekDay,
    selectedMonthDays,
    toggleMonthDay,
    openTimePicker,
    confirmTime,
    validateAndSave,
  } = useMedicationForm(id as string);

  const frequencyCount = Number.parseInt(frequency, 10) || 0;

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={["top", "bottom"]}>
      <View style={styles.ambientLayer} pointerEvents="none">
        <View style={[styles.ambientCircleTop, { backgroundColor: `${colors.primary}18` }]} />
        <View style={[styles.ambientCircleBottom, { backgroundColor: `${colors.secondary}12` }]} />
      </View>

      <View style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={[
              styles.iconButton,
              { backgroundColor: colors.surface, borderColor: `${colors.border}CC` },
            ]}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={19} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.headerTextWrap}>
            <Text style={[styles.title, { color: colors.text }]}>
              {id ? t("addMedicationScreen.editTitle") : t("addMedicationScreen.title")}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {t("addMedicationScreen.howOften")}
            </Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
          <View
            style={[
              styles.sectionCard,
              {
                backgroundColor: colors.surface,
                borderColor: `${colors.border}CC`,
                shadowColor: colors.shadow,
              },
            ]}
          >
            <MedName medName={medName} setMedName={setMedName} />
          </View>

          <View
            style={[
              styles.sectionCard,
              {
                backgroundColor: colors.surface,
                borderColor: `${colors.border}CC`,
                shadowColor: colors.shadow,
              },
            ]}
          >
            <MedForm
              medicineForm={medicineForm}
              setMedicineForm={setMedicineForm}
              dosageAmount={dosageAmount}
              setDosageAmount={setDosageAmount}
              dosageUnit={dosageUnit}
              setDosageUnit={setDosageUnit}
            />
          </View>

          <View
            style={[
              styles.sectionCard,
              {
                backgroundColor: colors.surface,
                borderColor: `${colors.border}CC`,
                shadowColor: colors.shadow,
              },
            ]}
          >
            <MedTime
              durationValue={durationValue}
              setDurationValue={setDurationValue}
              durationType={durationType}
              setDurationType={setDurationType}
            />
          </View>

          <View
            style={[
              styles.sectionCard,
              {
                backgroundColor: colors.surface,
                borderColor: `${colors.border}CC`,
                shadowColor: colors.shadow,
              },
            ]}
          >
            <Text style={[styles.label, { color: colors.text }]}>{t("addMedicationScreen.howOften")}</Text>

            <View style={styles.chipWrap}>
              {(["daily", "weekly", "monthly"] as ScheduleType[]).map((type) => {
                const selected = scheduleType === type;

                return (
                  <TouchableOpacity
                    key={type}
                    onPress={() => setScheduleType(type)}
                    style={[
                      styles.durationButton,
                      {
                        backgroundColor: selected ? colors.secondary : colors.surface,
                        borderColor: selected ? colors.secondary : `${colors.border}CC`,
                      },
                    ]}
                  >
                    <Text style={[styles.durationButtonText, { color: selected ? "white" : colors.text }]}>
                      {type === "daily"
                        ? t("addMedicationScreen.daily")
                        : type === "weekly"
                          ? t("addMedicationScreen.weekly")
                          : t("addMedicationScreen.monthly")}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {scheduleType === "weekly" && (
              <View style={{ marginTop: 12 }}>
                <Text style={[styles.label, { color: colors.text }]}>{t("addMedicationScreen.whichDays")}</Text>
                <View style={styles.chipWrap}>
                  {WEEK_DAYS.map((day) => {
                    const selected = selectedWeekDays.includes(day.key);

                    return (
                      <TouchableOpacity
                        key={day.key}
                        onPress={() => toggleWeekDay(day.key)}
                        style={[
                          styles.weekDayChip,
                          {
                            backgroundColor: selected ? colors.secondary : colors.surface,
                            borderColor: selected ? colors.secondary : `${colors.border}CC`,
                          },
                        ]}
                      >
                        <Text style={[styles.weekDayText, { color: selected ? "white" : colors.text }]}>
                          {weekDayLabels[day.key] || day.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {scheduleType === "monthly" && (
              <View style={{ marginTop: 12 }}>
                <Text style={[styles.label, { color: colors.text }]}>{t("addMedicationScreen.whichDaysOfMonth")}</Text>
                <View style={styles.chipWrap}>
                  {Array.from({ length: 31 }, (_, i) => (i + 1).toString()).map((day) => {
                    const selected = selectedMonthDays.includes(day);

                    return (
                      <TouchableOpacity
                        key={day}
                        onPress={() => toggleMonthDay(day)}
                        style={[
                          styles.monthDayChip,
                          {
                            backgroundColor: selected ? colors.secondary : colors.surface,
                            borderColor: selected ? colors.secondary : `${colors.border}CC`,
                          },
                        ]}
                      >
                        <Text style={[styles.monthDayText, { color: selected ? "white" : colors.text }]}>
                          {day}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}
          </View>

          <View
            style={[
              styles.sectionCard,
              {
                backgroundColor: colors.surface,
                borderColor: `${colors.border}CC`,
                shadowColor: colors.shadow,
              },
            ]}
          >
            <MedDose
              frequency={frequency}
              timeInputs={timeInputs}
              setFrequency={setFrequency}
              setTimeInputs={setTimeInputs}
            />
          </View>

          {frequencyCount > 1 && (
            <View
              style={[
                styles.sectionCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: `${colors.border}CC`,
                  shadowColor: colors.shadow,
                },
              ]}
            >
              <MedClock timeInputs={timeInputs} openTimePicker={openTimePicker} />
            </View>
          )}

          {frequencyCount === 1 && (
            <View
              style={[
                styles.sectionCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: `${colors.border}CC`,
                  shadowColor: colors.shadow,
                },
              ]}
            >
              <Text style={[styles.label, { color: colors.text }]}>{t("addMedicationScreen.time")}</Text>
              <TouchableOpacity
                onPress={() => openTimePicker(0)}
                style={[
                  styles.timeButton,
                  {
                    backgroundColor: colors.surface,
                    borderColor: `${colors.border}CC`,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.timeButtonText,
                    { color: timeInputs[0] ? colors.text : colors.textSecondary },
                  ]}
                >
                  {timeInputs[0] || t("addMedicationScreen.selectTime")}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View
            style={[
              styles.sectionCard,
              {
                backgroundColor: colors.surface,
                borderColor: `${colors.border}CC`,
                shadowColor: colors.shadow,
              },
            ]}
          >
            <Text style={[styles.label, { color: colors.text }]}>{t("addMedicationScreen.emptyOrFull")}</Text>

            <View style={styles.foodRow}>
              <TouchableOpacity
                onPress={() => setWithFood("ac")}
                style={[
                  styles.foodButton,
                  {
                    backgroundColor: withFood === "ac" ? colors.secondary : colors.surface,
                    borderColor: withFood === "ac" ? colors.secondary : `${colors.border}CC`,
                  },
                ]}
              >
                <Ionicons
                  name="sunny-outline"
                  size={16}
                  color={withFood === "ac" ? "#fff" : colors.textSecondary}
                />
                <Text style={[styles.foodButtonText, { color: withFood === "ac" ? "white" : colors.text }]}>
                  {t("addMedicationScreen.empty")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setWithFood("tok")}
                style={[
                  styles.foodButton,
                  {
                    backgroundColor: withFood === "tok" ? colors.secondary : colors.surface,
                    borderColor: withFood === "tok" ? colors.secondary : `${colors.border}CC`,
                  },
                ]}
              >
                <Ionicons
                  name="restaurant-outline"
                  size={16}
                  color={withFood === "tok" ? "#fff" : colors.textSecondary}
                />
                <Text style={[styles.foodButtonText, { color: withFood === "tok" ? "white" : colors.text }]}>
                  {t("addMedicationScreen.full")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <Modal visible={showTimePicker} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContainer,
                { backgroundColor: colors.surface, borderColor: `${colors.border}CC` },
              ]}
            >
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {t("addMedicationScreen.selectTimeTitle")}
              </Text>

              <View style={styles.timePickerRow}>
                <View style={styles.timePickerColumn}>
                  <Text style={[styles.timePickerLabel, { color: colors.textSecondary }]}>
                    {t("addMedicationScreen.hour")}
                  </Text>
                  <ScrollView style={styles.timePickerScroll} showsVerticalScrollIndicator={false}>
                    {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0")).map((hour) => (
                      <TouchableOpacity
                        key={hour}
                        onPress={() => setTempHour(hour)}
                        style={[
                          styles.timePickerItem,
                          {
                            backgroundColor: tempHour === hour ? colors.secondary : `${colors.surfaceVariant}`,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.timePickerItemText,
                            { color: tempHour === hour ? "white" : colors.text },
                          ]}
                        >
                          {hour}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <Text style={[styles.timeSeparator, { color: colors.text }]}>:</Text>

                <View style={styles.timePickerColumn}>
                  <Text style={[styles.timePickerLabel, { color: colors.textSecondary }]}>
                    {t("addMedicationScreen.minute")}
                  </Text>
                  <ScrollView style={styles.timePickerScroll} showsVerticalScrollIndicator={false}>
                    {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0")).map((minute) => (
                      <TouchableOpacity
                        key={minute}
                        onPress={() => setTempMinute(minute)}
                        style={[
                          styles.timePickerItem,
                          {
                            backgroundColor:
                              tempMinute === minute ? colors.secondary : `${colors.surfaceVariant}`,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.timePickerItemText,
                            { color: tempMinute === minute ? "white" : colors.text },
                          ]}
                        >
                          {minute}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>

              <View style={styles.modalButtonRow}>
                <TouchableOpacity
                  onPress={() => setShowTimePicker(false)}
                  style={[styles.modalButton, { backgroundColor: colors.textSecondary }]}
                >
                  <Text style={styles.modalButtonText}>{t("addMedicationScreen.cancel")}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={confirmTime}
                  style={[styles.modalButton, { backgroundColor: colors.secondary }]}
                >
                  <Text style={styles.modalButtonText}>{t("addMedicationScreen.ok")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <View style={[styles.saveBar, { backgroundColor: `${colors.background}F2`, borderTopColor: `${colors.border}AA` }]}>
          <TouchableOpacity onPress={validateAndSave} style={styles.saveButtonWrap} activeOpacity={0.9}>
            <LinearGradient
              colors={[colors.secondary, colors.iconGreen] as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.saveButton}
            >
              <Ionicons name={id ? "save-outline" : "checkmark-circle-outline"} size={19} color="#fff" />
              <Text style={styles.saveButtonText}>
                {id ? t("addMedicationScreen.update") : t("addMedicationScreen.save")}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AddMedicationScreen;
