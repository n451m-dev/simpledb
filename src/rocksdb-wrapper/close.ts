import RocksDB from 'rocksdb';

/**
 * Closes the RocksDB instance gracefully.
 * 
 * @param db - The RocksDB instance to close.
 * @returns A promise that resolves when the database is closed.
 * @throws An error if the close operation fails.
 */
export async function closeDB(db: RocksDB): Promise<void> {
    return new Promise((resolve, reject) => {
        db.close((err) => {
            if (err) return reject(new Error(`Failed to close database: ${err.message}`));
            resolve();
        });
    });
}
