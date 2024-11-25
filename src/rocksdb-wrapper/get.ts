import RocksDB from 'rocksdb';

/**
 * Retrieves the value associated with a key from RocksDB.
 * 
 * @param db - The RocksDB instance to interact with.
 * @param key - The key whose value needs to be retrieved.
 * @returns A promise that resolves to the value as a string or `null` if the key is not found.
 * @throws An error if the retrieval operation fails for reasons other than the key not being found.
 */
export async function get(db: RocksDB, key: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
        db.get(key, (err, value) => {
            if (err) {
                if (err.message.includes('NotFound')) {
                    resolve(null);
                } else {
                    reject(new Error(`Failed to get key "${key}": ${err.message}`));
                }
            } else {
                resolve(value?.toString() || null);
            }
        });
    });
}
