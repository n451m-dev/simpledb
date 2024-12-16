import { LevelUp } from 'levelup';
import { findCollection } from '../../collection/find-collection';

/**
 * Updates a single document in a specified collection based on field values.
 *
 * @param db - The RocksDB instance to interact with.
 * @param collectionName - The name of the collection where the document is stored.
 * @param query - An object containing the field values to identify the document to update.
 * @param updateData - An object containing the fields to update and their new values.
 * @returns A promise that resolves to `true` if the document was successfully updated, or `false` if no matching document was found.
 * @throws An error if the database instance is invalid, the collection does not exist, or the query is invalid.
 */
export async function updateOne(
    db: LevelUp,
    collectionName: string,
    query: Record<string, any>,
    updateData: Record<string, any>
): Promise<boolean> {
    try {
        // Validate database instance
        if (!db || typeof db.get !== 'function') {
            throw new Error('Invalid database instance provided.');
        }

        // Validate collection name
        if (typeof collectionName !== 'string' || collectionName.trim() === '') {
            throw new Error('Collection name must be a non-empty string.');
        }

        // Validate query
        if (typeof query !== 'object' || query === null || Array.isArray(query)) {
            throw new Error('Query must be a valid non-null object.');
        }

        // Validate update data
        if (typeof updateData !== 'object' || updateData === null || Array.isArray(updateData)) {
            throw new Error('Update data must be a valid non-null object.');
        }

        // Check if the collection exists
        const collectionExists = await findCollection(db, collectionName);
        if (!collectionExists) {
            throw new Error(`Collection "${collectionName}" does not exist.`);
        }

        // Create an iterator for the collection
        const iterator = db.iterator({
            gte: `${collectionName}:`,
            lte: `${collectionName}:\xff`,
        });

        let documentUpdated = false;

        try {
            for await (const [key, value] of asyncIterator(iterator)) {
                const document = JSON.parse(value.toString());

                // Compare query fields with document fields
                const isMatch = Object.entries(query).every(
                    ([queryKey, queryValue]) => document[queryKey] === queryValue
                );

                if (isMatch) {
                    documentUpdated = true;

                    // Merge update data into the existing document
                    const updatedDocument = { ...document, ...updateData, updatedAt: new Date().toISOString(), };

                    // Save the updated document
                    await new Promise<void>((resolve, reject) => {
                        db.put(key, JSON.stringify(updatedDocument), (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    });

                    break; // Stop after the document is updated
                }
            }
        } finally {
            iterator.end(() => { });
        }

        return documentUpdated; // Return whether a document was updated
    } catch (err: any) {
        throw err;
    }
}

/**
 * Async generator to iterate over a LevelDB iterator.
 * @param iterator - The LevelDB iterator.
 */
async function* asyncIterator(iterator: any): AsyncGenerator<[string, string]> {
    try {
        while (true) {
            const result = await new Promise<{ key?: string; value?: string }>((resolve, reject) => {
                iterator.next((err: Error | null, key: string, value: string) => {
                    if (err) return reject(err);
                    resolve({ key, value });
                });
            });

            if (!result.key) break; // End of iteration
            yield [result.key, result.value];
        }
    } catch (err) {
        console.error("Iterator Error:", err);
        throw err; // Re-throw the error for outer handling
    } finally {
        iterator.end(() => { });
    }
}
