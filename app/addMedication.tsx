import MedClock from "@/src/components/AddMedicationScreen/MedClock";
import MedDose from "@/src/components/AddMedicationScreen/MedDose";
import MedForm from "@/src/components/AddMedicationScreen/MedForm";
import MedName from "@/src/components/AddMedicationScreen/MedName";
import MedTime from "@/src/components/AddMedicationScreen/MedTime";
import {
  addMedicine,
  addSchedule,
  deleteSchedules,
  getMedicineById,
  getSchedules,
  updateMedicine,
} from "@/src/database/medicineRepository";
import { scheduleMedicineReminders } from "@/src/services/notificationService";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../src/contexts/ThemeContext";
import styles from "../src/styles/AddMedicationStyles";

type ScheduleType = "daily" | "weekly" | "monthly";

const WEEK_DAYS = [
  { key: "monday", label: "Pzt" },
  { key: "tuesday", label: "Sal" },
  { key: "wednesday", label: "Çar" },
  { key: "thursday", label: "Per" },
  { key: "friday", label: "Cum" },
  { key: "saturday", label: "Cmt" },
  { key: "sunday", label: "Paz" },
];

const AddMedicationScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const [medName, setMedName] = useState("");
  const [durationValue, setDurationValue] = useState("");
  const [durationType, setDurationType] = useState("");
  const [frequency, setFrequency] = useState("");
  const [timeInputs, setTimeInputs] = useState<string[]>([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(0);
  const [tempHour, setTempHour] = useState("08");
  const [tempMinute, setTempMinute] = useState("00");
  const [withFood, setWithFood] = useState("");
  const [medicineForm, setMedicineForm] = useState("");
  const [dosage, setDosage] = useState("");

  // New schedule fields
  const [scheduleType, setScheduleType] = useState<ScheduleType>("daily");
  const [selectedWeekDays, setSelectedWeekDays] = useState<string[]>([]);
  const [selectedMonthDays, setSelectedMonthDays] = useState<string[]>([]);

  const updateTimeInput = (index: number, value: string) => {
    const newTimes = [...timeInputs];
    newTimes[index] = value;
    setTimeInputs(newTimes);
  };

  useEffect(() => {
    if (id) {
      loadMedicineData(Number(id));
    }
  }, [id]);

  const loadMedicineData = async (medId: number) => {
    try {
      const medicine = await getMedicineById(medId);
      if (medicine) {
        setMedName(medicine.name);
        setFrequency(medicine.frequency.toString());
        setWithFood(medicine.instruction || "");
        setMedicineForm(medicine.form || "");
        setDosage(medicine.dosage || "");
        setScheduleType(medicine.schedule_type || "daily");

        if (medicine.schedule_days) {
          const days = JSON.parse(medicine.schedule_days);
          if (medicine.schedule_type === "weekly") {
            setSelectedWeekDays(days);
          } else if (medicine.schedule_type === "monthly") {
            setSelectedMonthDays(days);
          }
        }

        if (medicine.form) {
          setDurationType(medicine.form);
          setDurationValue("1");
        }

        const schedules = await getSchedules(medId);
        setTimeInputs(schedules);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Hata", "İlaç bilgileri yüklenemedi.");
    }
  };

  const openTimePicker = (index: number) => {
    setSelectedTimeIndex(index);
    const currentTime = timeInputs[index];
    if (currentTime) {
      const [hour, minute] = currentTime.split(":");
      setTempHour(hour);
      setTempMinute(minute);
    }
    setShowTimePicker(true);
  };

  const confirmTime = () => {
    const timeString = `${tempHour}:${tempMinute}`;
    updateTimeInput(selectedTimeIndex, timeString);
    setShowTimePicker(false);
  };

  const toggleWeekDay = (day: string) => {
    setSelectedWeekDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleMonthDay = (day: string) => {
    setSelectedMonthDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const getScheduleDays = (): string | null => {
    if (scheduleType === "weekly" && selectedWeekDays.length > 0) {
      return JSON.stringify(selectedWeekDays);
    }
    if (scheduleType === "monthly" && selectedMonthDays.length > 0) {
      return JSON.stringify(selectedMonthDays);
    }
    return null;
  };

  const validateAndSave = async () => {
    if (!medName.trim()) {
      Alert.alert("Uyarı", "Lütfen ilaç adını girin.");
      return;
    }
    if (!durationValue.trim() || !durationType) {
      Alert.alert("Uyarı", "Lütfen kullanım süresini ve süre tipini seçin.");
      return;
    }
    if (!frequency.trim()) {
      Alert.alert("Uyarı", "Lütfen günlük kullanım sıklığını girin.");
      return;
    }
    if (parseInt(frequency) >= 1) {
      const emptyTimes = timeInputs.filter((time) => !time.trim());
      if (emptyTimes.length > 0) {
        Alert.alert("Uyarı", "Lütfen tüm saat bilgilerini girin.");
        return;
      }
    }
    if (!withFood) {
      Alert.alert("Uyarı", "Lütfen aç/tok durumunu seçin.");
      return;
    }
    if (scheduleType === "weekly" && selectedWeekDays.length === 0) {
      Alert.alert("Uyarı", "Lütfen en az bir gün seçin.");
      return;
    }
    if (scheduleType === "monthly" && selectedMonthDays.length === 0) {
      Alert.alert("Uyarı", "Lütfen ayın hangi günlerinde alınacağını seçin.");
      return;
    }

    try {
      let targetId = Number(id);
      if (id) {
        await updateMedicine(targetId, {
          id: targetId,
          name: medName,
          dosage: dosage,
          form: medicineForm,
          frequency: parseInt(frequency),
          instruction: withFood,
          start_date: new Date().toISOString(),
          schedule_type: scheduleType,
          schedule_days: getScheduleDays() || undefined,
        });
        await deleteSchedules(targetId);
      } else {
        targetId = await addMedicine({
          name: medName,
          dosage: dosage,
          form: medicineForm,
          frequency: parseInt(frequency),
          instruction: withFood,
          start_date: new Date().toISOString(),
          schedule_type: scheduleType,
          schedule_days: getScheduleDays() || undefined,
        });
      }

      // Save Schedules
      const savedTimes: string[] = [];
      if (parseInt(frequency) === 1) {
        if (timeInputs[0]) {
          await addSchedule(targetId, timeInputs[0]);
          savedTimes.push(timeInputs[0]);
        }
      } else {
        for (const time of timeInputs) {
          if (time) {
            await addSchedule(targetId, time);
            savedTimes.push(time);
          }
        }
      }

      // Schedule notifications for medication reminders
      if (savedTimes.length > 0) {
        const scheduleDaysArray =
          scheduleType === "weekly"
            ? selectedWeekDays
            : scheduleType === "monthly"
            ? selectedMonthDays
            : undefined;

        await scheduleMedicineReminders(
          targetId,
          medName,
          savedTimes,
          scheduleType,
          scheduleDaysArray
        );
      }

      Alert.alert(
        "Başarılı",
        id ? "İlaç güncellendi!" : "İlaç başarıyla kaydedildi!",
        [{ text: "Tamam", onPress: () => router.back() }]
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Hata", "İlaç kaydedilirken bir sorun oluştu.");
    }
  };

  return (
    <SafeAreaView style={[{ backgroundColor: colors.background }, { flex: 1 }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>
          {id ? "İlacı Düzenle" : "İlaç Ekle"}
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ gap: 20 }}>
            <MedName medName={medName} setMedName={setMedName} />
            <MedForm
              medicineForm={medicineForm}
              setMedicineForm={setMedicineForm}
              dosage={dosage}
              setDosage={setDosage}
            />
            <MedTime
              durationValue={durationValue}
              setDurationValue={setDurationValue}
              durationType={durationType}
              setDurationType={setDurationType}
            />

            {/* Schedule Type Selection */}
            <View>
              <Text
                style={{ color: colors.text, fontSize: 16, marginBottom: 8 }}
              >
                Ne Sıklıkla?
              </Text>
              <View style={{ flexDirection: "row", gap: 10 }}>
                {(["daily", "weekly", "monthly"] as ScheduleType[]).map(
                  (type) => (
                    <TouchableOpacity
                      key={type}
                      onPress={() => setScheduleType(type)}
                      style={{
                        flex: 1,
                        backgroundColor:
                          scheduleType === type
                            ? colors.secondary
                            : colors.surface,
                        borderRadius: 10,
                        padding: 12,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: scheduleType === type ? "white" : colors.text,
                          fontSize: 14,
                          fontWeight: "500",
                        }}
                      >
                        {type === "daily"
                          ? "Her Gün"
                          : type === "weekly"
                          ? "Haftalık"
                          : "Aylık"}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>

            {/* Weekly Day Selection */}
            {scheduleType === "weekly" && (
              <View>
                <Text
                  style={{ color: colors.text, fontSize: 16, marginBottom: 8 }}
                >
                  Hangi Günler?
                </Text>
                <View
                  style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}
                >
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
                <Text
                  style={{ color: colors.text, fontSize: 16, marginBottom: 8 }}
                >
                  Ayın Hangi Günleri?
                </Text>
                <View
                  style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}
                >
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
                <Text
                  style={{ color: colors.text, fontSize: 16, marginBottom: 8 }}
                >
                  Saat
                </Text>
                <TouchableOpacity
                  onPress={() => openTimePicker(0)}
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: 10,
                    padding: 15,
                    borderWidth: 1,
                    borderColor: "#E5E5E5",
                  }}
                >
                  <Text
                    style={{
                      color: timeInputs[0] ? colors.text : colors.textSecondary,
                      fontSize: 16,
                    }}
                  >
                    {timeInputs[0] || "Saat seçin"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <View>
              <Text
                style={{ color: colors.text, fontSize: 16, marginBottom: 8 }}
              >
                Aç mı Tok mu?
              </Text>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <TouchableOpacity
                  onPress={() => setWithFood("aç")}
                  style={{
                    flex: 1,
                    backgroundColor:
                      withFood === "aç" ? colors.secondary : colors.surface,
                    borderRadius: 10,
                    padding: 15,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: withFood === "aç" ? "white" : colors.text,
                      fontSize: 16,
                    }}
                  >
                    Aç
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setWithFood("tok")}
                  style={{
                    flex: 1,
                    backgroundColor:
                      withFood === "tok" ? colors.secondary : colors.surface,
                    borderRadius: 10,
                    padding: 15,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: withFood === "tok" ? "white" : colors.text,
                      fontSize: 16,
                    }}
                  >
                    Tok
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        <Modal visible={showTimePicker} transparent animationType="slide">
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 20,
                padding: 20,
                width: "80%",
              }}
            >
              <Text
                style={{
                  color: colors.text,
                  fontSize: 18,
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: 20,
                }}
              >
                Saat Seçin
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <View style={{ alignItems: "center" }}>
                  <Text style={{ color: colors.text, marginBottom: 10 }}>
                    Saat
                  </Text>
                  <ScrollView
                    style={{ height: 120 }}
                    showsVerticalScrollIndicator={false}
                  >
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, "0");
                      return (
                        <TouchableOpacity
                          key={i}
                          onPress={() => setTempHour(hour)}
                          style={{
                            padding: 10,
                            backgroundColor:
                              tempHour === hour
                                ? colors.secondary
                                : "transparent",
                            borderRadius: 5,
                            marginVertical: 2,
                          }}
                        >
                          <Text
                            style={{
                              color: tempHour === hour ? "white" : colors.text,
                              textAlign: "center",
                            }}
                          >
                            {hour}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>

                <Text
                  style={{
                    color: colors.text,
                    fontSize: 24,
                    marginHorizontal: 20,
                  }}
                >
                  :
                </Text>

                <View style={{ alignItems: "center" }}>
                  <Text style={{ color: colors.text, marginBottom: 10 }}>
                    Dakika
                  </Text>
                  <ScrollView
                    style={{ height: 120 }}
                    showsVerticalScrollIndicator={false}
                  >
                    {Array.from({ length: 60 }, (_, i) => {
                      const minute = i.toString().padStart(2, "0");
                      return (
                        <TouchableOpacity
                          key={i}
                          onPress={() => setTempMinute(minute)}
                          style={{
                            padding: 10,
                            backgroundColor:
                              tempMinute === minute
                                ? colors.secondary
                                : "transparent",
                            borderRadius: 5,
                            marginVertical: 2,
                          }}
                        >
                          <Text
                            style={{
                              color:
                                tempMinute === minute ? "white" : colors.text,
                              textAlign: "center",
                            }}
                          >
                            {minute}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              </View>

              <View style={{ flexDirection: "row", gap: 10 }}>
                <TouchableOpacity
                  onPress={() => setShowTimePicker(false)}
                  style={{
                    flex: 1,
                    backgroundColor: colors.textSecondary,
                    borderRadius: 10,
                    padding: 15,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "white", fontSize: 16 }}>İptal</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={confirmTime}
                  style={{
                    flex: 1,
                    backgroundColor: colors.secondary,
                    borderRadius: 10,
                    padding: 15,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "white", fontSize: 16 }}>Tamam</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <TouchableOpacity
          onPress={validateAndSave}
          style={{
            backgroundColor: colors.secondary,
            borderRadius: 10,
            padding: 18,
            alignItems: "center",
            marginVertical: 10,
          }}
        >
          <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
            {id ? "İlacı Güncelle" : "İlacı Kaydet"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddMedicationScreen;
