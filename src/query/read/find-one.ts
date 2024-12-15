import { LevelUp } from 'levelup';
import { findCollection } from '../../collection/find-collection';

/**
 * Finds a document in a specified collection based on field values.
 *
 * @param db - The LevelUp instance to interact with.
 * @param collectionName - The name of the collection where the document is stored.
 * @param query - An object containing the field values to search for in the document.
 * @returns A promise that resolves to the found document or null if not found.
 * @throws An error if the database instance is invalid, the collection does not exist, or the query is invalid.
 */
export async function findOne(
    db: LevelUp,
    collectionName: string,
    query: Record<string, any>
): Promise<Record<string, any> | null> {
    if (!db || typeof db.get !== 'function') {
        throw new Error('Invalid database instance provided.');
    }

    if (typeof collectionName !== 'string' || collectionName.trim() === '') {
        throw new Error('Collection name must be a non-empty string.');
    }

    if (typeof query !== 'object' || query === null || Array.isArray(query)) {
        throw new Error('Query must be a valid non-null object.');
    }

    const collectionExists = await findCollection(db, collectionName);
    if (!collectionExists) {
        throw new Error(`Collection "${collectionName}" does not exist.`);
    }

    const iterator = db.iterator({
        gte: `${collectionName}:`,
        lte: `${collectionName}:\xff`,
    });

    try {
        for await (const [key, value] of asyncIterator(iterator)) {
            const document = JSON.parse(value.toString());

            // Compare query fields with document fields
            const isMatch = Object.entries(query).every(
                ([queryKey, queryValue]) => document[queryKey] === queryValue
            );

            if (isMatch) {
                return document;
            }
        }
    } finally {
        iterator.end(() => { });
    }

    return null;
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
