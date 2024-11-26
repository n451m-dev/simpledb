import { LevelUp } from 'levelup';

/**
 * Closes the database instance gracefully.
 *
 * @param db - The database instance to close.
 * @returns A promise that resolves when the database is closed.
 */
export async function closeDB(db: LevelUp): Promise<void> {
    return new Promise((resolve, reject) => {
        db.close((err) => {
            if (err) return reject(new Error(`Failed to close database: ${err.message}`));
            resolve();
        });
    });
}
