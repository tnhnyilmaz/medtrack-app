import { initDB } from './index';

export interface Medicine {
    id?: number;
    name: string;
    dosage?: string;
    form?: string;
    frequency: number;
    instruction?: string;
    start_date: string;
}

export const addMedicine = async (medicine: Medicine) => {
    const db = await initDB();
    const result = await db.runAsync(
        `INSERT INTO medicines (name, dosage, form, frequency, instruction, start_date) VALUES (?, ?, ?, ?, ?, ?)`,
        [medicine.name, medicine.dosage || '', medicine.form || '', medicine.frequency, medicine.instruction || '', medicine.start_date]
    );
    return result.lastInsertRowId;
};

export const getMedicines = async (): Promise<Medicine[]> => {
    const db = await initDB();
    return await db.getAllAsync<Medicine>('SELECT * FROM medicines');
};

export const deleteMedicine = async (id: number) => {
    const db = await initDB();
    await db.runAsync('DELETE FROM medicines WHERE id = ?', [id]);
};

export const getMedicineById = async (id: number): Promise<Medicine | null> => {
    const db = await initDB();
    return await db.getFirstAsync<Medicine>('SELECT * FROM medicines WHERE id = ?', [id]);
};

export const updateMedicine = async (id: number, medicine: Medicine) => {
    const db = await initDB();
    await db.runAsync(
        `UPDATE medicines SET name = ?, dosage = ?, form = ?, frequency = ?, instruction = ? WHERE id = ?`,
        [medicine.name, medicine.dosage || '', medicine.form || '', medicine.frequency, medicine.instruction || '', id]
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
