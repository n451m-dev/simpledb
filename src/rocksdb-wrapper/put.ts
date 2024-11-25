import RocksDB from 'rocksdb';

/**
 * Inserts or updates a document in RocksDB with the specified key and value.
 * 
 * @param db - The RocksDB instance to interact with.
 * @param key - The unique key for the document to be stored.
 * @param value - The stringified value of the document to store.
 * @returns A promise that resolves when the document is successfully written to the database.
 * @throws An error if the operation fails.
 */
export async function putDocument(db: RocksDB, key: string, value: string): Promise<void> {
    return new Promise((resolve, reject) => {
        db.put(key, value, (err) => {
            if (err) return reject(new Error(`Failed to put key "${key}": ${err.message}`));
            resolve();
        });
    });
}
