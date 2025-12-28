import * as SQLite from 'expo-sqlite';

const DB_NAME = 'medtrack.db';

// Lazy database getter to avoid require cycle
const getDB = async (): Promise<SQLite.SQLiteDatabase> => {
    const { initDB } = await import('./index');
    return initDB();
};

export type PeriodType = 'Günlük' | 'Haftalık' | 'Aylık';

// Helper to get date range based on period
const getDateRange = (period: PeriodType): { startDate: string; endDate: string } => {
    const now = new Date();
    const endDate = new Date(now);
    endDate.setHours(23, 59, 59, 999);

    let startDate = new Date(now);
    startDate.setHours(0, 0, 0, 0);

    switch (period) {
        case 'Günlük':
            // Today only - startDate is already set to beginning of today
            break;
        case 'Haftalık':
            // Last 7 days
            startDate.setDate(startDate.getDate() - 6);
            break;
        case 'Aylık':
            // Last 30 days
            startDate.setDate(startDate.getDate() - 29);
            break;
    }

    return {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
    };
};

export interface BloodPressure {
    id?: number;
    systolic: number;
    diastolic: number;
    pulse?: number;
    measure_time: string;
    note?: string;
}

export const addBloodPressure = async (bp: BloodPressure) => {
    const db = await getDB();
    const result = await db.runAsync(
        `INSERT INTO blood_pressure (systolic, diastolic, pulse, measure_time, note) VALUES (?, ?, ?, ?, ?)`,
        [bp.systolic, bp.diastolic, bp.pulse || null, bp.measure_time, bp.note || '']
    );
    return result.lastInsertRowId;
};

export const getBloodPressures = async (): Promise<BloodPressure[]> => {
    const db = await getDB();
    return await db.getAllAsync<BloodPressure>('SELECT * FROM blood_pressure ORDER BY measure_time DESC');
};

export const getBloodPressuresByPeriod = async (period: PeriodType): Promise<BloodPressure[]> => {
    const db = await getDB();
    const { startDate, endDate } = getDateRange(period);
    return await db.getAllAsync<BloodPressure>(
        'SELECT * FROM blood_pressure WHERE measure_time >= ? AND measure_time <= ? ORDER BY measure_time DESC',
        [startDate, endDate]
    );
};

export const getBloodPressuresByDate = async (date: Date): Promise<BloodPressure[]> => {
    const db = await getDB();
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    return await db.getAllAsync<BloodPressure>(
        'SELECT * FROM blood_pressure WHERE measure_time >= ? AND measure_time <= ? ORDER BY measure_time DESC',
        [startDate.toISOString(), endDate.toISOString()]
    );
};

export interface BloodSugar {
    id?: number;
    level: number;
    type: string;
    measure_time: string;
    note?: string;
}

export const addBloodSugar = async (sugar: BloodSugar) => {
    const db = await getDB();
    const result = await db.runAsync(
        `INSERT INTO blood_sugar (level, type, measure_time, note) VALUES (?, ?, ?, ?)`,
        [sugar.level, sugar.type, sugar.measure_time, sugar.note || '']
    );
    return result.lastInsertRowId;
}

export const getBloodSugars = async (): Promise<BloodSugar[]> => {
    const db = await getDB();
    return await db.getAllAsync<BloodSugar>('SELECT * FROM blood_sugar ORDER BY measure_time DESC');
}

export const getBloodSugarsByPeriod = async (period: PeriodType): Promise<BloodSugar[]> => {
    const db = await getDB();
    const { startDate, endDate } = getDateRange(period);
    return await db.getAllAsync<BloodSugar>(
        'SELECT * FROM blood_sugar WHERE measure_time >= ? AND measure_time <= ? ORDER BY measure_time DESC',
        [startDate, endDate]
    );
}

export const getBloodSugarsByDate = async (date: Date): Promise<BloodSugar[]> => {
    const db = await getDB();
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    return await db.getAllAsync<BloodSugar>(
        'SELECT * FROM blood_sugar WHERE measure_time >= ? AND measure_time <= ? ORDER BY measure_time DESC',
        [startDate.toISOString(), endDate.toISOString()]
    );
}

// Get the latest blood pressure measurement
export const getLatestBloodPressure = async (): Promise<BloodPressure | null> => {
    const db = await getDB();
    const result = await db.getFirstAsync<BloodPressure>(
        'SELECT * FROM blood_pressure ORDER BY measure_time DESC LIMIT 1'
    );
    return result || null;
};

// Get the latest blood sugar measurement
export const getLatestBloodSugar = async (): Promise<BloodSugar | null> => {
    const db = await getDB();
    const result = await db.getFirstAsync<BloodSugar>(
        'SELECT * FROM blood_sugar ORDER BY measure_time DESC LIMIT 1'
    );
    return result || null;
};

// Clear all measurement data (useful before seeding)
export const clearMeasurementData = async () => {
    const db = await getDB();
    await db.runAsync('DELETE FROM blood_pressure');
    await db.runAsync('DELETE FROM blood_sugar');
    console.log('Measurement data cleared');
};

// Seed sample data for testing Daily/Weekly/Monthly views
export const seedMeasurementData = async () => {
    const db = await getDB();

    // Check if data already exists
    const existingBP = await db.getAllAsync<{ count: number }>('SELECT COUNT(*) as count FROM blood_pressure');
    if (existingBP[0].count > 0) {
        console.log('Seed data already exists, skipping...');
        return;
    }

    const now = new Date();
    const notes = [
        'Sabah kahvaltıdan önce ölçüldü.',
        'Öğle yemeğinden sonra.',
        'Akşam yemeğinden 2 saat sonra.',
        'Yürüyüş sonrası.',
        'Uyumadan önce kontrol.',
        'İlaç aldıktan sonra.',
    ];

    // Generate data for the last 30 days
    for (let daysAgo = 0; daysAgo < 30; daysAgo++) {
        const date = new Date(now);
        date.setDate(date.getDate() - daysAgo);

        // Add 2-4 blood pressure measurements per day
        const bpCount = Math.floor(Math.random() * 3) + 2;
        for (let i = 0; i < bpCount; i++) {
            const hour = [8, 12, 18, 22][i % 4];
            const measureDate = new Date(date);
            measureDate.setHours(hour, Math.floor(Math.random() * 60), 0, 0);

            const systolic = 110 + Math.floor(Math.random() * 40); // 110-150
            const diastolic = 65 + Math.floor(Math.random() * 30); // 65-95
            const pulse = 60 + Math.floor(Math.random() * 30); // 60-90

            await db.runAsync(
                `INSERT INTO blood_pressure (systolic, diastolic, pulse, measure_time, note) VALUES (?, ?, ?, ?, ?)`,
                [systolic, diastolic, pulse, measureDate.toISOString(), notes[Math.floor(Math.random() * notes.length)]]
            );
        }

        // Add 2-3 blood sugar measurements per day
        const sugarCount = Math.floor(Math.random() * 2) + 2;
        for (let i = 0; i < sugarCount; i++) {
            const hour = [7, 13, 20][i % 3];
            const measureDate = new Date(date);
            measureDate.setHours(hour, Math.floor(Math.random() * 60), 0, 0);

            const type = i === 0 ? 'Açlık' : 'Tokluk';
            const level = type === 'Açlık'
                ? 70 + Math.floor(Math.random() * 60) // 70-130 for fasting
                : 90 + Math.floor(Math.random() * 80); // 90-170 for postprandial

            await db.runAsync(
                `INSERT INTO blood_sugar (level, type, measure_time, note) VALUES (?, ?, ?, ?)`,
                [level, type, measureDate.toISOString(), notes[Math.floor(Math.random() * notes.length)]]
            );
        }
    }

    console.log('Seed data created successfully - 30 days of measurements');
};
