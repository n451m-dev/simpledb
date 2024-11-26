import { LevelUp } from 'levelup';
import { findCollection } from '../../collection/find-collection';

/**
 * Finds a document in a specified collection based on field values.
 * Allows selecting specific fields to be returned.
 *
 * @param db - The LevelUp instance to interact with.
 * @param collectionName - The name of the collection where the document is stored.
 * @param query - An object containing the field values to search for in the document.
 * @param returnFields - An array of field names that should be included in the returned document. If empty, all fields will be returned.
 * @returns A promise that resolves to the found document with the specified fields or null if not found.
 * @throws An error if the database instance is invalid, the collection does not exist, or the query is invalid.
 */
export async function findOne(
    db: LevelUp,
    collectionName: string,
    query: Record<string, any>,
    returnFields: string[] = []
): Promise<Record<string, any> | null> {
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

        // Validate return fields
        if (!Array.isArray(returnFields) || returnFields.some((field) => typeof field !== 'string')) {
            throw new Error('Return fields must be an array of strings.');
        }

        // Check if the collection exists
        const collectionExists = await findCollection(db, collectionName);
        if (!collectionExists) {
            throw new Error(`Collection "${collectionName}" does not exist.`);
        }

        // Serialize query for comparison
        const serializedQuery = JSON.stringify(query);

        // Create an async generator to iterate over documents
        const iterator = db.iterator({
            gte: `${collectionName}:`,
            lte: `${collectionName}:\xff`,
        });

        for await (const [key, value] of asyncIterator(iterator)) {
            const document = JSON.parse(value.toString());
            const documentWithoutKey = Object.fromEntries(
                Object.entries(document).filter(([field]) => field !== 'id')
            );

            if (JSON.stringify(documentWithoutKey) === serializedQuery) {
                if (returnFields.length > 0) {
                    const filteredDocument: Record<string, any> = {};
                    for (const field of returnFields) {
                        if (field in document) {
                            filteredDocument[field] = document[field];
                        }
                    }
                    return filteredDocument;
                }
                return document;
            }
        }

        return null; // No matching document found
    } catch (error: any) {
        throw new Error(`Error finding document: ${error.message}`);
    }
}

/**
 * Async generator to iterate over a LevelDB iterator.
 * @param iterator - The LevelDB iterator.
 */
async function* asyncIterator(iterator: any): AsyncGenerator<[string, string]> {
    while (true) {
        try {
            const [key, value] = await new Promise<[string, string]>((resolve, reject) => {
                iterator.next((err: Error | null, key: string, value: string) => {
                    if (err) return reject(err);
                    if (key === undefined && value === undefined) {
                        iterator.end(() => { });
                        resolve(null as any); // End of iterator
                    } else {
                        resolve([key, value]);
                    }
                });
            });

            if (!key) break; // End of iteration
            yield [key, value];
        } catch (err) {
            iterator.end(() => { });
            break;
        }
    }
}
