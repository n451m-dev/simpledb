import { LevelUp } from 'levelup';
import { asyncIterator } from '../helper/collection-iterator';
import { findCollection } from './find-collection';
/**
 * Deletes a collection and its associated data from the database.
 * @param db - The LevelDB instance.
 * @param collectionName - The name of the collection to delete.
 */
export async function truncateCollection(db: LevelUp, collectionName: string) {
    try {

        const iterator = db.iterator({
            gte: `${collectionName}:`,
            lte: `${collectionName}:\xFF`,
        });

        if (!collectionName || typeof collectionName !== 'string') {
            throw new Error('Collection name must be a non-empty string.');
        }

        
        const exists = await findCollection(db, collectionName)
        if (!exists) {
            throw new Error(`Collection "${collectionName}" does not exist.`);
        }

        // Create a batch instance
        const batch = db.batch();

        // Add delete operations to the batch
        for await (const [key, value] of asyncIterator(iterator)) {
            batch.del(key);
        }

        // Commit the batch
        await batch.write();

        return `Collection "${collectionName}" and its documents deleted successfully`;
    } catch (err) {
        console.error("Error deleting collection:", err);
        throw err;
    }
}
