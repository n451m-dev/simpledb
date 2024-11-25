import rocksdb from 'rocksdb';

/**
 * Performs a batch of operations (put or delete) on RocksDB.
 * 
 * @param db - The RocksDB instance to interact with.
 * @param operations - An array of operations to perform. Each operation can be a "put" or "del".
 * @returns A promise that resolves when all operations in the batch are successfully completed.
 * @throws An error if the batch operation fails.
 */
export async function batch(
    db: rocksdb,
    operations: { type: 'put' | 'del'; key: string; value?: string }[]
): Promise<void> {
    return new Promise((resolve, reject) => {
        const batch = db.batch();
        operations.forEach((op) => {
            if (op.type === 'put' && op.value !== undefined) {
                batch.put(op.key, op.value);
            } else if (op.type === 'del') {
                batch.del(op.key);
            }
        });
        batch.write((err) => {
            if (err) return reject(new Error(`Batch operation failed: ${err.message}`));
            resolve();
        });
    });
}
