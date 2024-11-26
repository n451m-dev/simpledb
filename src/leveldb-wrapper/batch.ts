import { LevelUp } from 'levelup';

/**
 * Performs a batch of operations (put or delete) on the database.
 *
 * @param db - The database instance to interact with.
 * @param operations - An array of operations to perform. Each operation must specify `type`, `key`, and optionally `value`.
 * @returns A promise that resolves when the batch operation completes.
 */
export async function batch(
    db: LevelUp,
    operations: { type: 'put' | 'del'; key: string; value?: string }[]
): Promise<void> {
    if (!Array.isArray(operations) || operations.length === 0) {
        throw new Error('Invalid operations. Provide a non-empty array of operations.');
    }

    const batch = db.batch();
    operations.forEach((op) => {
        if (!op.key || typeof op.key !== 'string') {
            throw new Error('Invalid operation key. Each operation must have a non-empty string key.');
        }

        if (op.type === 'put') {
            if (typeof op.value !== 'string') {
                throw new Error('Invalid operation value. Put operations must have a string value.');
            }
            batch.put(op.key, op.value);
        } else if (op.type === 'del') {
            batch.del(op.key);
        } else {
            throw new Error(`Invalid operation type "${op.type}". Use "put" or "del".`);
        }
    });

    return new Promise((resolve, reject) => {
        batch.write((err) => {
            if (err) return reject(new Error(`Batch operation failed: ${err.message}`));
            resolve();
        });
    });
}
