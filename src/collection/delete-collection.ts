import { LevelUp } from 'levelup';

/**
 * Async generator to iterate over a LevelDB iterator.
 * @param iterator - The LevelDB iterator.
 */
async function* asyncIterator(iterator: any): AsyncGenerator<string> {
    try {
        while (true) {
            const result = await new Promise<{ key?: string }>((resolve, reject) => {
                iterator.next((err: Error | null, key: string) => {
                    if (err) return reject(err);
                    resolve({ key });
                });
            });

            if (!result.key) break; // End of iteration
            yield result.key;
        }
    } catch (err) {
        console.error("Iterator Error:", err);
        throw err; // Re-throw the error for outer handling
    } finally {
        iterator.end(() => { });
    }
}

/**
 * Deletes a collection and its associated data from the database.
 * @param db - The LevelDB instance.
 * @param collectionName - The name of the collection to delete.
 */
export async function deleteCollection(db: LevelUp, collectionName: string) {
    try {
        if (!collectionName || typeof collectionName !== 'string') {
            throw new Error('Collection name must be a non-empty string.');
        }

        const collectionKey = `__collection:${collectionName}`;
        const exists = await db.get(collectionKey).catch((err) => (err.notFound ? false : Promise.reject(err)));
        if (!exists) {
            throw new Error(`Collection "${collectionName}" does not exist.`);
        }

        const iterator = db.iterator({
            gte: `${collectionName}:`,
            lte: `${collectionName}:\xFF`,
        });

        // Create a batch instance
        const batch = db.batch();

        // Add delete operations to the batch
        for await (const [key, value] of asyncIterator(iterator)) {
            batch.del(key);
        }

        // Delete the collection metadata
        batch.del(collectionKey);

        // Commit the batch
        await batch.write();

        return `Collection "${collectionName}" and its documents deleted successfully`;
    } catch (err) {
        console.error("Error deleting collection:", err);
        throw err;
    }
}
