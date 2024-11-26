import { LevelUp } from 'levelup';

/**
 * Deletes a document from the database using its key.
 *
 * @param db - The database instance to interact with.
 * @param key - The key of the document to delete.
 * @returns A promise that resolves when the document is deleted.
 */
export async function deleteDocument(db: LevelUp, key: string): Promise<void> {
    if (!key || typeof key !== 'string') {
        throw new Error('Invalid key. Key must be a non-empty string.');
    }

    return new Promise((resolve, reject) => {
        db.del(key, (err) => {
            if (err) return reject(new Error(`Failed to delete key "${key}": ${err.message}`));
            resolve();
        });
    });
}
