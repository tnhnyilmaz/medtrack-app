import { seedMedicineData } from "../database/medicineRepository";
import { seedMeasurementData } from "../database/measurementRepository";
import { seedDemoUser } from "../database/userRepository";

/**
 * Seed demo data for showcase builds.
 * All seeders are idempotent (skip when data already exists).
 */
export const seedDemoData = async (): Promise<void> => {
  try {
    await seedDemoUser();
    await seedMedicineData();
    await seedMeasurementData();
  } catch (error) {
    console.error("Demo seed error:", error);
  }
};
