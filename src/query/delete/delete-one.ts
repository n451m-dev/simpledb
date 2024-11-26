import { LevelUp } from 'levelup';
import { findCollection } from '../../collection/find-collection';
import { get } from '../../leveldb-wrapper/get';

/**
 * Deletes a single document from a specified collection based on field values.
 *
 * @param db - The RocksDB instance to interact with.
 * @param collectionName - The name of the collection where the document is stored.
 * @param query - An object containing the field values to identify the document to delete.
 * @returns A promise that resolves to `true` if the document was successfully deleted, or `false` if no matching document was found.
 * @throws An error if the database instance is invalid, the collection does not exist, or the query is invalid.
 */
export async function deleteOne(
    db: LevelUp,
    collectionName: string,
    query: Record<string, any>
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

        // Check if the collection exists
        const collectionExists = await findCollection(db, collectionName);
        if (!collectionExists) {
            throw new Error(`Collection "${collectionName}" does not exist.`);
        }

        // Generate the query key
        const queryKey = `${collectionName}:${JSON.stringify(query)}`;

        // Attempt to get the document to ensure it exists
        const documentString = await get(db, queryKey);
        if (!documentString) {
            return false; // Document not found
        }

        // Delete the document
        await new Promise<void>((resolve, reject) => {
            db.del(queryKey, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        return true; // Document successfully deleted
    } catch (error: any) {
        throw new Error(`Error deleting document: ${error.message}`);
    }
}
