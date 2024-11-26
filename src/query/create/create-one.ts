

import { LevelUp } from 'levelup';
import { findCollection } from '../../collection/find-collection';
import { putDocument } from '../../leveldb-wrapper/put';
import { validateAndPrepareDocument } from '../../helper/validate-and-prepare-document';

/**
 * Creates a single document in a specified collection in the database.
 */
export async function createOne(
    db: LevelUp,
    collectionName: string,
    document: Record<string, any>,
    schema?: Record<string, any>
): Promise<Record<string, any>> {
    try {
        // Validate database instance
        if (!db || typeof db.put !== 'function') {
            throw new Error('Invalid database instance provided.');
        }

        // Validate collection name
        if (typeof collectionName !== 'string' || collectionName.trim() === '') {
            throw new Error('Collection name must be a non-empty string.');
        }

        // Check if the collection exists
        const collectionExists = await findCollection(db, collectionName);
        if (!collectionExists) {
            throw new Error(`Collection "${collectionName}" does not exist.`);
        }

        // Validate and prepare the document
        const preparedDocument = validateAndPrepareDocument(document, schema);

        // Construct the key for this document
        const documentKey = `${collectionName}:${preparedDocument.id}`;

        // Use the put wrapper to write the document
        await putDocument(db, documentKey, JSON.stringify(preparedDocument));

        // Return the prepared document
        return preparedDocument;
    } catch (error: any) {
        throw new Error(`createOne error: ${error.message}`);
    }
}
