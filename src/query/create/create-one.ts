import RocksDB from 'rocksdb';
import { findCollection } from '../../collection/find-collection';
import { putDocument } from '../../rocksdb-wrapper/put';
import { v4 as uuidv4 } from 'uuid';

/**
 * Creates a single document in a specified collection in the database.
 * Automatically generates a unique ID for the document and includes timestamp fields (`createdAt`, `updatedAt`).
 * 
 * @param db - The RocksDB instance to interact with.
 * @param collectionName - The name of the collection where the document will be stored.
 * @param document - The document to store, which should be a valid object.
 * @returns A promise that resolves to the created document with metadata (`id`, `createdAt`, `updatedAt`).
 * @throws An error if the database instance is invalid, the collection does not exist, or the document is invalid.
 */
export async function createOne(
    db: RocksDB,
    collectionName: string,
    document: Record<string, any>
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

        // Validate document
        if (typeof document !== 'object' || document === null || Array.isArray(document)) {
            throw new Error('Document must be a valid non-null object.');
        }
        if (Object.keys(document).length === 0) {
            throw new Error('Document cannot be empty.');
        }

        // Check if the collection exists
        const collectionExists = await findCollection(db, collectionName);
        if (!collectionExists) {
            throw new Error(`Collection "${collectionName}" does not exist.`);
        }

        // Generate a unique ID for the document
        const id = uuidv4();
        const documentKey = `${collectionName}:${id}`;

        // Generate timestamps
        const timestamp = new Date().toISOString();

        // Add generated fields to the document
        const documentWithMetadata = {
            id,
            ...document,
            createdAt: timestamp,
            updatedAt: timestamp,
        };

        // Use the put wrapper to write the document
        await putDocument(db, documentKey, JSON.stringify(documentWithMetadata));

        // Return the complete created document
        return documentWithMetadata;
    } catch (error: any) {
        throw new Error(`createOne error: ${error.message}`);
    }
}
