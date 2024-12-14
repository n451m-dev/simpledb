import { LevelUp } from 'levelup';

/**
 * Inserts or updates a document in the database with the specified key and value.
 *
 * @param db - The database instance to interact with.
 * @param key - The unique key for the document.
 * @param value - The stringified value of the document.
 * @returns A promise that resolves when the operation completes.
 */
export async function putDocument(db: LevelUp, key: string, value: string): Promise<void> {
    try {
    if (!key || typeof key !== 'string') {
        throw new Error('Invalid key. Key must be a non-empty string.');
    }

    if (!value || typeof value !== 'string') {
        throw new Error('Invalid value. Value must be a non-empty string.');
    }

    return new Promise((resolve, reject) => {
        db.put(key, value, (err) => {
            if (err) return reject(new Error(`Failed to put key "${key}": ${err.message}`));
            resolve();
        });
    });

    } catch (err) {
        throw err;
    }
}
