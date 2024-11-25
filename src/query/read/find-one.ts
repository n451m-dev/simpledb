import RocksDB from 'rocksdb';
import { get } from '../../rocksdb-wrapper/get';
import { findCollection } from '../../collection/find-collection';

/**
 * Finds a document in a specified collection based on field values.
 * Allows selecting specific fields to be returned.
 * 
 * @param db - The RocksDB instance to interact with.
 * @param collectionName - The name of the collection where the document is stored.
 * @param query - An object containing the field values to search for in the document.
 * @param returnFields - An array of field names that should be included in the returned document. If empty, all fields will be returned.
 * @returns A promise that resolves to the found document with the specified fields or null if not found.
 * @throws An error if the database instance is invalid, the collection does not exist, or the query is invalid.
 */
export async function findOne(
    db: RocksDB,
    collectionName: string,
    query: Record<string, any>,
    returnFields: string[] = []
): Promise<Record<string, any> | null> {
    try {
        
        if (!db || typeof db.get !== 'function') {
            throw new Error('Invalid database instance provided.');
        }

        
        if (typeof collectionName !== 'string' || collectionName.trim() === '') {
            throw new Error('Collection name must be a non-empty string.');
        }

       
        if (typeof query !== 'object' || query === null || Array.isArray(query)) {
            throw new Error('Query must be a valid non-null object.');
        }

        
        if (!Array.isArray(returnFields)) {
            throw new Error('Return fields must be an array of strings.');
        }

        
        const collectionExists = await findCollection(db, collectionName);
        if (!collectionExists) {
            throw new Error(`Collection "${collectionName}" does not exist.`);
        }

       
        const queryKey = `${collectionName}:${JSON.stringify(query)}`;

        
        const documentString = await get(db, queryKey);

        if (!documentString) {
            throw new Error('Document not found.');
        }

        
        const document = JSON.parse(documentString);

        
        if (returnFields.length > 0) {
            const filteredDocument: Record<string, any> = {};
            returnFields.forEach((field) => {
                if (field in document) {
                    filteredDocument[field] = document[field];
                }
            });
            return filteredDocument;
        }

        return document;
    } catch (error: any) {
        throw new Error(`Error finding document: ${error.message}`);
    }
}
