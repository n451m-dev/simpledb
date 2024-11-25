import rocksdb from 'rocksdb';

/**
 * Deletes a document from RocksDB using its key.
 * 
 * @param db - The RocksDB instance to interact with.
 * @param key - The key of the document to delete.
 * @returns A promise that resolves when the document is deleted.
 */
export async function deleteDocument(db: rocksdb, key: string): Promise<void> {
    return new Promise((resolve, reject) => {
        db.del(key, (err) => {
            if (err) return reject(new Error(`Failed to delete key "${key}": ${err.message}`));
            resolve();
        });
    });
}
