import { cancelMedicineNotifications } from '../services/notificationService';
import { initDB } from './index';

export interface Medicine {
    id?: number;
    name: string;
    dosage?: string;
    form?: string;
    frequency: number;
    instruction?: string;
    start_date: string;
    schedule_type?: 'daily' | 'weekly' | 'monthly';
    schedule_days?: string; // JSON array: ["monday","wednesday"] for weekly, ["1","15"] for monthly
}

export interface MedicineWithSchedule extends Medicine {
    schedules: string[];
}

export interface TodayMedication {
    id: number;
    medicine_id: number;
    name: string;
    dosage?: string;
    form?: string;
    instruction?: string;
    schedule_time: string;
    status: 'pending' | 'taken' | 'missed' | 'taken_late';
    taken_time?: string;
    is_late?: boolean;
}

// Day name helpers
const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export const addMedicine = async (medicine: Medicine) => {
    const db = await initDB();
    const result = await db.runAsync(
        `INSERT INTO medicines (name, dosage, form, frequency, instruction, start_date, schedule_type, schedule_days) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            medicine.name,
            medicine.dosage || '',
            medicine.form || '',
            medicine.frequency,
            medicine.instruction || '',
            medicine.start_date,
            medicine.schedule_type || 'daily',
            medicine.schedule_days || null
        ]
    );
    return result.lastInsertRowId;
};

export const getMedicines = async (): Promise<Medicine[]> => {
    const db = await initDB();
    return await db.getAllAsync<Medicine>('SELECT * FROM medicines');
};

export const deleteMedicine = async (id: number) => {
    const db = await initDB();
    // Cancel any scheduled notifications for this medicine
    await cancelMedicineNotifications(id);
    // Delete related records first (FK constraints may not work in SQLite by default)
    await db.runAsync('DELETE FROM intake_logs WHERE medicine_id = ?', [id]);
    await db.runAsync('DELETE FROM schedules WHERE medicine_id = ?', [id]);
    await db.runAsync('DELETE FROM medicines WHERE id = ?', [id]);
};

export const getMedicineById = async (id: number): Promise<Medicine | null> => {
    const db = await initDB();
    return await db.getFirstAsync<Medicine>('SELECT * FROM medicines WHERE id = ?', [id]);
};

export const updateMedicine = async (id: number, medicine: Medicine) => {
    const db = await initDB();
    await db.runAsync(
        `UPDATE medicines SET name = ?, dosage = ?, form = ?, frequency = ?, instruction = ?, schedule_type = ?, schedule_days = ? WHERE id = ?`,
        [
            medicine.name,
            medicine.dosage || '',
            medicine.form || '',
            medicine.frequency,
            medicine.instruction || '',
            medicine.schedule_type || 'daily',
            medicine.schedule_days || null,
            id
        ]
    );
};

export const deleteSchedules = async (medicineId: number) => {
    const db = await initDB();
    await db.runAsync('DELETE FROM schedules WHERE medicine_id = ?', [medicineId]);
};

export const addSchedule = async (medicineId: number, time: string) => {
    const db = await initDB();
    await db.runAsync(
        'INSERT INTO schedules (medicine_id, time) VALUES (?, ?)',
        [medicineId, time]
    );
};

export const getSchedules = async (medicineId: number): Promise<string[]> => {
    const db = await initDB();
    const results = await db.getAllAsync<{ time: string }>(
        'SELECT time FROM schedules WHERE medicine_id = ? ORDER BY time',
        [medicineId]
    );
    return results.map(r => r.time);
};

// Check if medicine should be taken today based on schedule_type and schedule_days
const isMedicineForToday = (medicine: Medicine, today: Date): boolean => {
    const scheduleType = medicine.schedule_type || 'daily';

    if (scheduleType === 'daily') {
        return true;
    }

    if (scheduleType === 'weekly') {
        const todayDayName = DAY_NAMES[today.getDay()];
        const scheduleDays: string[] = medicine.schedule_days ? JSON.parse(medicine.schedule_days) : [];
        return scheduleDays.includes(todayDayName);
    }

    if (scheduleType === 'monthly') {
        const todayDate = today.getDate().toString();
        const scheduleDays: string[] = medicine.schedule_days ? JSON.parse(medicine.schedule_days) : [];
        return scheduleDays.includes(todayDate);
    }

    return false;
};

// Get today's medications with their schedules and intake status
export const getTodaysMedications = async (): Promise<TodayMedication[]> => {
    const db = await initDB();
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD format
    const currentTime = `${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}`;

    // Get all medicines
    const medicines = await db.getAllAsync<Medicine>('SELECT * FROM medicines');

    // Filter medicines that should be taken today
    const todayMedicines = medicines.filter(med => isMedicineForToday(med, today));

    const result: TodayMedication[] = [];

    for (const medicine of todayMedicines) {
        // Get schedules for this medicine
        const schedules = await db.getAllAsync<{ time: string }>(
            'SELECT time FROM schedules WHERE medicine_id = ? ORDER BY time',
            [medicine.id!]
        );

        for (const schedule of schedules) {
            // Check if there's an intake log for today
            const intakeLog = await db.getFirstAsync<{ status: number; taken_time: string }>(
                'SELECT status, taken_time FROM intake_logs WHERE medicine_id = ? AND schedule_time = ? AND log_date = ?',
                [medicine.id!, schedule.time, todayStr]
            );

            let status: 'pending' | 'taken' | 'missed' | 'taken_late' = 'pending';
            let taken_time: string | undefined;
            let is_late = false;

            if (intakeLog) {
                taken_time = intakeLog.taken_time;
                if (intakeLog.status === 1) {
                    // Check if taken after scheduled time
                    if (taken_time && taken_time > schedule.time) {
                        status = 'taken_late';
                        is_late = true;
                    } else {
                        status = 'taken';
                    }
                } else {
                    status = 'missed';
                }
            } else if (schedule.time < currentTime) {
                // If schedule time has passed and no log, mark as missed
                status = 'missed';
            }

            result.push({
                id: medicine.id!,
                medicine_id: medicine.id!,
                name: medicine.name,
                dosage: medicine.dosage,
                form: medicine.form,
                instruction: medicine.instruction,
                schedule_time: schedule.time,
                status,
                taken_time,
                is_late
            });
        }
    }

    // Sort by schedule time
    result.sort((a, b) => a.schedule_time.localeCompare(b.schedule_time));

    return result;
};

// Log medication intake
export const logMedicationIntake = async (
    medicineId: number,
    scheduleTime: string,
    taken: boolean = true
): Promise<void> => {
    const db = await initDB();
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const currentTime = `${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}`;

    // Check if log already exists
    const existingLog = await db.getFirstAsync<{ id: number }>(
        'SELECT id FROM intake_logs WHERE medicine_id = ? AND schedule_time = ? AND log_date = ?',
        [medicineId, scheduleTime, todayStr]
    );

    if (existingLog) {
        // Update existing log
        await db.runAsync(
            'UPDATE intake_logs SET status = ?, taken_time = ? WHERE id = ?',
            [taken ? 1 : 0, taken ? currentTime : null, existingLog.id]
        );
    } else {
        // Insert new log
        await db.runAsync(
            'INSERT INTO intake_logs (medicine_id, schedule_time, taken_time, status, log_date) VALUES (?, ?, ?, ?, ?)',
            [medicineId, scheduleTime, taken ? currentTime : null, taken ? 1 : 0, todayStr]
        );
    }
};

// Toggle medication intake status
export const toggleMedicationIntake = async (
    medicineId: number,
    scheduleTime: string
): Promise<boolean> => {
    const db = await initDB();
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const existingLog = await db.getFirstAsync<{ id: number; status: number }>(
        'SELECT id, status FROM intake_logs WHERE medicine_id = ? AND schedule_time = ? AND log_date = ?',
        [medicineId, scheduleTime, todayStr]
    );

    const newStatus = existingLog ? (existingLog.status === 1 ? false : true) : true;
    await logMedicationIntake(medicineId, scheduleTime, newStatus);

    return newStatus;
};
