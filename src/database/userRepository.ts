import { initDB } from './index';

export interface User {
    id?: number;
    name: string;
    email: string;
    birthday: string | null;
    gender: 'male' | 'female' | null;
    photo: string | null;
    created_at?: string;
}

/**
 * Save or update user in database
 * Since we only have one user, we always update id=1 or insert new
 */
export const saveUser = async (user: Omit<User, 'id' | 'created_at'>): Promise<number> => {
    const db = await initDB();
    const now = new Date().toISOString();

    // Check if user exists
    const existingUser = await db.getFirstAsync<{ id: number }>('SELECT id FROM users WHERE id = 1');

    if (existingUser) {
        // Update existing user
        await db.runAsync(
            `UPDATE users SET name = ?, email = ?, birthday = ?, gender = ?, photo = ? WHERE id = 1`,
            [user.name, user.email, user.birthday, user.gender, user.photo]
        );
        return 1;
    } else {
        // Insert new user
        const result = await db.runAsync(
            `INSERT INTO users (name, email, birthday, gender, photo, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
            [user.name, user.email, user.birthday, user.gender, user.photo, now]
        );
        return result.lastInsertRowId;
    }
};

/**
 * Get the current user from database
 */
export const getUser = async (): Promise<User | null> => {
    const db = await initDB();
    const user = await db.getFirstAsync<User>('SELECT * FROM users WHERE id = 1');
    return user || null;
};

/**
 * Check if a user exists in the database
 */
export const userExists = async (): Promise<boolean> => {
    const db = await initDB();
    const user = await db.getFirstAsync<{ id: number }>('SELECT id FROM users WHERE id = 1');
    return user !== null;
};

/**
 * Clear user data (for reset/logout)
 */
export const clearUser = async (): Promise<void> => {
    const db = await initDB();
    await db.runAsync('DELETE FROM users WHERE id = 1');
};
