import { LevelUp } from 'levelup';

/**
 * Retrieves the value associated with a key from the database.
 *
 * @param db - The database instance to interact with.
 * @param key - The key to retrieve.
 * @returns A promise that resolves to the value as a string or `null` if not found.
 */
export async function get(db: LevelUp, key: string): Promise<string | null> {
    try {
        
    if (!key || typeof key !== 'string') {
        throw new Error('Invalid key. Key must be a non-empty string.');
    }

    return new Promise((resolve, reject) => {
        db.get(key, (err, value) => {
            if (err) {
                if (err.message.includes('NotFound')) {
                    resolve(null);
                } else {
                    reject(new Error(`Failed to get key "${key}": ${err.message}`));
                }
            } else {
                resolve(value.toString());
            }
        });
    });
    } catch (err) {
        throw err;
    }
}
