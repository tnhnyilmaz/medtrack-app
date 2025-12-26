import {
    addMedicine,
    addSchedule,
    deleteSchedules,
    getMedicineById,
    getSchedules,
    updateMedicine,
} from "@/src/database/medicineRepository";
import { scheduleMedicineReminders } from "@/src/services/notificationService";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export type ScheduleType = "daily" | "weekly" | "monthly";

export const WEEK_DAYS = [
    { key: "monday", label: "Pzt" },
    { key: "tuesday", label: "Sal" },
    { key: "wednesday", label: "Çar" },
    { key: "thursday", label: "Per" },
    { key: "friday", label: "Cum" },
    { key: "saturday", label: "Cmt" },
    { key: "sunday", label: "Paz" },
];

export const useMedicationForm = (id?: string) => {
    const router = useRouter();
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

    const [scheduleType, setScheduleType] = useState<ScheduleType>("daily");
    const [selectedWeekDays, setSelectedWeekDays] = useState<string[]>([]);
    const [selectedMonthDays, setSelectedMonthDays] = useState<string[]>([]);

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

    const updateTimeInput = (index: number, value: string) => {
        const newTimes = [...timeInputs];
        newTimes[index] = value;
        setTimeInputs(newTimes);
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

    return {
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
        selectedTimeIndex,
        tempHour,
        setTempHour,
        tempMinute,
        setTempMinute,
        withFood,
        setWithFood,
        medicineForm,
        setMedicineForm,
        dosage,
        setDosage,
        scheduleType,
        setScheduleType,
        selectedWeekDays,
        toggleWeekDay,
        selectedMonthDays,
        toggleMonthDay,
        openTimePicker,
        confirmTime,
        validateAndSave,
    };
};
