import leveldown from 'leveldown';
import levelup, { LevelUp } from 'levelup';

/**
 * Opens a LevelDB database at the specified path.
 *
 * @param path - The file system path where the database is stored.
 * @returns A promise that resolves to the opened database instance.
 */
export async function openDB(path: string): Promise<LevelUp> {
    if (!path || typeof path !== 'string') {
        throw new Error('Invalid path. Path must be a non-empty string.');
    }

    const db = levelup(leveldown(path));
    return new Promise((resolve, reject) => {
        db.open((err) => {
            if (err) return reject(new Error(`Failed to open database at "${path}": ${err.message}`));
            resolve(db);
        });
    });
}
