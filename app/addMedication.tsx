import MedClock from "@/src/components/AddMedicationScreen/MedClock";
import MedDose from "@/src/components/AddMedicationScreen/MedDose";
import MedForm from "@/src/components/AddMedicationScreen/MedForm";
import MedName from "@/src/components/AddMedicationScreen/MedName";
import MedTime from "@/src/components/AddMedicationScreen/MedTime";
import { ScheduleType, useMedicationForm, WEEK_DAYS } from "@/src/hooks/useMedicationForm";
import { useLocalSearchParams } from "expo-router";
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

const AddMedicationScreen = () => {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const {
    medName, setMedName,
    durationValue, setDurationValue,
    durationType, setDurationType,
    frequency, setFrequency,
    timeInputs, setTimeInputs,
    showTimePicker, setShowTimePicker,
    tempHour, setTempHour,
    tempMinute, setTempMinute,
    withFood, setWithFood,
    medicineForm, setMedicineForm,
    dosageAmount, setDosageAmount,
    dosageUnit, setDosageUnit,
    scheduleType, setScheduleType,
    selectedWeekDays, toggleWeekDay,
    selectedMonthDays, toggleMonthDay,
    openTimePicker,
    confirmTime,
    validateAndSave,
  } = useMedicationForm(id as string);

  return (
    <SafeAreaView style={[{ backgroundColor: colors.background }, { flex: 1 }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>
          {id ? t('addMedicationScreen.editTitle') : t('addMedicationScreen.title')}
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.scrollContainer}>
            <MedName medName={medName} setMedName={setMedName} />
            <MedForm
              medicineForm={medicineForm}
              setMedicineForm={setMedicineForm}
              dosageAmount={dosageAmount}
              setDosageAmount={setDosageAmount}
              dosageUnit={dosageUnit}
              setDosageUnit={setDosageUnit}
            />
            <MedTime
              durationValue={durationValue}
              setDurationValue={setDurationValue}
              durationType={durationType}
              setDurationType={setDurationType}
            />

            {/* Schedule Type Selection */}
            <View>
              <Text style={[styles.label, { color: colors.text }]}>
                {t('addMedicationScreen.howOften')}
              </Text>
              <View style={styles.durationRow}>
                {(["daily", "weekly", "monthly"] as ScheduleType[]).map(
                  (type) => (
                    <TouchableOpacity
                      key={type}
                      onPress={() => setScheduleType(type)}
                      style={[
                        styles.durationButton,
                        {
                          backgroundColor:
                            scheduleType === type
                              ? colors.secondary
                              : colors.surface,
                          borderColor:
                            scheduleType === type
                              ? colors.secondary
                              : "#E5E5E5"
                        }
                      ]}
                    >
                      <Text
                        style={{
                          color: scheduleType === type ? "white" : colors.text,
                          fontSize: 14,
                          fontWeight: "500",
                        }}
                      >
                        {type === "daily"
                          ? t('addMedicationScreen.daily')
                          : type === "weekly"
                            ? t('addMedicationScreen.weekly')
                            : t('addMedicationScreen.monthly')}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>

            {/* Weekly Day Selection */}
            {scheduleType === "weekly" && (
              <View>
                <Text style={[styles.label, { color: colors.text }]}>
                  {t('addMedicationScreen.whichDays')}
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {WEEK_DAYS.map((day) => (
                    <TouchableOpacity
                      key={day.key}
                      onPress={() => toggleWeekDay(day.key)}
                      style={{
                        backgroundColor: selectedWeekDays.includes(day.key)
                          ? colors.secondary
                          : colors.surface,
                        borderRadius: 10,
                        paddingVertical: 10,
                        paddingHorizontal: 16,
                        borderWidth: 1,
                        borderColor: selectedWeekDays.includes(day.key)
                          ? colors.secondary
                          : "#E5E5E5",
                      }}
                    >
                      <Text
                        style={{
                          color: selectedWeekDays.includes(day.key)
                            ? "white"
                            : colors.text,
                          fontSize: 14,
                          fontWeight: "500",
                        }}
                      >
                        {day.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Monthly Day Selection */}
            {scheduleType === "monthly" && (
              <View>
                <Text style={[styles.label, { color: colors.text }]}>
                  {t('addMedicationScreen.whichDaysOfMonth')}
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                  {Array.from({ length: 31 }, (_, i) => (i + 1).toString()).map(
                    (day) => (
                      <TouchableOpacity
                        key={day}
                        onPress={() => toggleMonthDay(day)}
                        style={{
                          backgroundColor: selectedMonthDays.includes(day)
                            ? colors.secondary
                            : colors.surface,
                          borderRadius: 8,
                          width: 40,
                          height: 40,
                          alignItems: "center",
                          justifyContent: "center",
                          borderWidth: 1,
                          borderColor: selectedMonthDays.includes(day)
                            ? colors.secondary
                            : "#E5E5E5",
                        }}
                      >
                        <Text
                          style={{
                            color: selectedMonthDays.includes(day)
                              ? "white"
                              : colors.text,
                            fontSize: 14,
                            fontWeight: "500",
                          }}
                        >
                          {day}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>
              </View>
            )}

            <MedDose
              frequency={frequency}
              setFrequency={setFrequency}
              setTimeInputs={setTimeInputs}
            />

            {parseInt(frequency) > 1 && (
              <MedClock
                timeInputs={timeInputs}
                openTimePicker={openTimePicker}
              />
            )}

            {parseInt(frequency) === 1 && (
              <View>
                <Text style={[styles.label, { color: colors.text }]}>
                  {t('addMedicationScreen.time')}
                </Text>
                <TouchableOpacity
                  onPress={() => openTimePicker(0)}
                  style={[styles.textInput, { backgroundColor: colors.surface }]}
                >
                  <Text
                    style={{
                      color: timeInputs[0] ? colors.text : colors.textSecondary,
                      fontSize: 16,
                    }}
                  >
                    {timeInputs[0] || t('addMedicationScreen.selectTime')}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <View>
              <Text style={[styles.label, { color: colors.text }]}>
                {t('addMedicationScreen.emptyOrFull')}
              </Text>
              <View style={styles.foodRow}>
                <TouchableOpacity
                  onPress={() => setWithFood("aç")}
                  style={[
                    styles.foodButton,
                    {
                      backgroundColor:
                        withFood === "aç" ? colors.secondary : colors.surface,
                    }
                  ]}
                >
                  <Text
                    style={[
                      styles.foodButtonText,
                      { color: withFood === "aç" ? "white" : colors.text }
                    ]}
                  >
                    {t('addMedicationScreen.empty')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setWithFood("tok")}
                  style={[
                    styles.foodButton,
                    {
                      backgroundColor:
                        withFood === "tok" ? colors.secondary : colors.surface,
                    }
                  ]}
                >
                  <Text
                    style={[
                      styles.foodButtonText,
                      { color: withFood === "tok" ? "white" : colors.text }
                    ]}
                  >
                    {t('addMedicationScreen.full')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        <Modal visible={showTimePicker} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContainer, { backgroundColor: colors.surface }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {t('addMedicationScreen.selectTimeTitle')}
              </Text>

              <View style={styles.timePickerRow}>
                <View style={styles.timePickerColumn}>
                  <Text style={[styles.timePickerLabel, { color: colors.text }]}>
                    {t('addMedicationScreen.hour')}
                  </Text>
                  <ScrollView
                    style={styles.timePickerScroll}
                    showsVerticalScrollIndicator={false}
                  >
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, "0");
                      return (
                        <TouchableOpacity
                          key={i}
                          onPress={() => setTempHour(hour)}
                          style={[
                            styles.timePickerItem,
                            {
                              backgroundColor:
                                tempHour === hour
                                  ? colors.secondary
                                  : "transparent",
                            }
                          ]}
                        >
                          <Text
                            style={[
                              styles.timePickerItemText,
                              { color: tempHour === hour ? "white" : colors.text }
                            ]}
                          >
                            {hour}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>

                <Text style={[styles.timeSeparator, { color: colors.text }]}>
                  :
                </Text>

                <View style={styles.timePickerColumn}>
                  <Text style={[styles.timePickerLabel, { color: colors.text }]}>
                    {t('addMedicationScreen.minute')}
                  </Text>
                  <ScrollView
                    style={styles.timePickerScroll}
                    showsVerticalScrollIndicator={false}
                  >
                    {Array.from({ length: 60 }, (_, i) => {
                      const minute = i.toString().padStart(2, "0");
                      return (
                        <TouchableOpacity
                          key={i}
                          onPress={() => setTempMinute(minute)}
                          style={[
                            styles.timePickerItem,
                            {
                              backgroundColor:
                                tempMinute === minute
                                  ? colors.secondary
                                  : "transparent",
                            }
                          ]}
                        >
                          <Text
                            style={[
                              styles.timePickerItemText,
                              { color: tempMinute === minute ? "white" : colors.text }
                            ]}
                          >
                            {minute}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              </View>

              <View style={styles.modalButtonRow}>
                <TouchableOpacity
                  onPress={() => setShowTimePicker(false)}
                  style={[styles.modalButton, { backgroundColor: colors.textSecondary }]}
                >
                  <Text style={styles.modalButtonText}>{t('addMedicationScreen.cancel')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={confirmTime}
                  style={[styles.modalButton, { backgroundColor: colors.secondary }]}
                >
                  <Text style={styles.modalButtonText}>{t('addMedicationScreen.ok')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <TouchableOpacity
          onPress={validateAndSave}
          style={[styles.saveButton, { backgroundColor: colors.secondary }]}
        >
          <Text style={styles.saveButtonText}>
            {id ? t('addMedicationScreen.update') : t('addMedicationScreen.save')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddMedicationScreen;
