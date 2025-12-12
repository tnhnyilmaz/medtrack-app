import * as SQLite from 'expo-sqlite';
import { seedMeasurementData } from './measurementRepository';

const DB_NAME = 'medtrack.db';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;
let seedingDone = false;

export const initDB = async () => {
    if (dbPromise) {
        return dbPromise;
    }

    dbPromise = (async () => {
        try {
            const db = await SQLite.openDatabaseAsync(DB_NAME);

            // Create all tables in a single execAsync call
            await db.execAsync(`
                CREATE TABLE IF NOT EXISTS medicines (
                    id INTEGER PRIMARY KEY NOT NULL,
                    name TEXT NOT NULL,
                    dosage TEXT,
                    form TEXT,
                    frequency INTEGER,
                    instruction TEXT,
                    start_date TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS schedules (
                    id INTEGER PRIMARY KEY NOT NULL,
                    medicine_id INTEGER NOT NULL,
                    time TEXT NOT NULL,
                    FOREIGN KEY (medicine_id) REFERENCES medicines (id) ON DELETE CASCADE
                );

                CREATE TABLE IF NOT EXISTS intake_logs (
                    id INTEGER PRIMARY KEY NOT NULL,
                    medicine_id INTEGER NOT NULL,
                    schedule_time TEXT NOT NULL,
                    taken_time TEXT,
                    status INTEGER DEFAULT 0,
                    log_date TEXT NOT NULL,
                    FOREIGN KEY (medicine_id) REFERENCES medicines (id) ON DELETE CASCADE
                );

                CREATE TABLE IF NOT EXISTS blood_pressure (
                    id INTEGER PRIMARY KEY NOT NULL,
                    systolic INTEGER NOT NULL,
                    diastolic INTEGER NOT NULL,
                    pulse INTEGER,
                    measure_time TEXT NOT NULL,
                    note TEXT
                );

                CREATE TABLE IF NOT EXISTS blood_sugar (
                    id INTEGER PRIMARY KEY NOT NULL,
                    level INTEGER NOT NULL,
                    type TEXT NOT NULL,
                    measure_time TEXT NOT NULL,
                    note TEXT
                );
            `);

            console.log("Database initialized successfully");

            // Seed sample measurement data (only runs if no data exists)
            if (!seedingDone) {
                seedingDone = true;
                // Run seeding in background to not block DB init
                seedMeasurementData().catch(err => console.error('Seeding error:', err));
            }

            return db;
        } catch (error) {
            console.error("DB Init Error:", error);
            // Reset promise on error to allow retry
            dbPromise = null;
            throw error;
        }
    })();

    return dbPromise;
};