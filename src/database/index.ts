import * as SQLite from 'expo-sqlite';

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
                    start_date TEXT NOT NULL,
                    schedule_type TEXT DEFAULT 'daily',
                    schedule_days TEXT
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

                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY NOT NULL,
                    name TEXT NOT NULL,
                    email TEXT,
                    birthday TEXT,
                    gender TEXT,
                    photo TEXT,
                    created_at TEXT NOT NULL
                );
            `);

            console.log("Database initialized successfully");

            // Run migrations for existing databases
            try {
                // Check if schedule_type column exists, if not add it
                const tableInfo = await db.getAllAsync<{ name: string }>(
                    "PRAGMA table_info(medicines)"
                );
                const columnNames = tableInfo.map(col => col.name);

                if (!columnNames.includes('schedule_type')) {
                    await db.execAsync(`
                        ALTER TABLE medicines ADD COLUMN schedule_type TEXT DEFAULT 'daily';
                    `);
                    console.log("Added schedule_type column");
                }

                if (!columnNames.includes('schedule_days')) {
                    await db.execAsync(`
                        ALTER TABLE medicines ADD COLUMN schedule_days TEXT;
                    `);
                    console.log("Added schedule_days column");
                }
            } catch (migrationError) {
                console.log("Migration check:", migrationError);
            }

            // Clean up orphaned records (schedules/intake_logs with no matching medicine)
            try {
                await db.runAsync(`
                    DELETE FROM schedules WHERE medicine_id NOT IN (SELECT id FROM medicines)
                `);
                await db.runAsync(`
                    DELETE FROM intake_logs WHERE medicine_id NOT IN (SELECT id FROM medicines)
                `);
                console.log("Cleaned up orphaned records");
            } catch (cleanupError) {
                console.log("Cleanup check:", cleanupError);
            }

            // NOTE: Seed data disabled for production
            // Uncomment below for development/testing only
            // if (!seedingDone) {
            //     seedingDone = true;
            //     seedMeasurementData().catch(err => console.error('Seeding error:', err));
            // }

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