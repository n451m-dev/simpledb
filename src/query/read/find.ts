import { LevelUp } from 'levelup';
import { findCollection } from '../../collection/find-collection';
import { get } from '../../leveldb-wrapper/get';

/**
 * Finds multiple documents in a specified collection based on field values, including date fields like `createdAt` and `updatedAt`.
 * Supports pagination via `limit` and `offset`, and allows selecting specific fields to be returned for each document.
 *
 * @param db - The RocksDB instance to interact with.
 * @param collectionName - The name of the collection where the documents are stored.
 * @param query - An object containing the field values to search for in the documents.
 * @param returnFields - An array of field names that should be included in the returned documents. If empty, all fields will be returned.
 * @param limit - The number of documents to return (for pagination). Optional, defaults to undefined.
 * @param offset - The starting index of the documents to return (for pagination). Optional, defaults to undefined.
 * @returns A promise that resolves to an array of found documents, each with the specified fields, or an empty array if no documents are found.
 * @throws An error if the database instance is invalid, the collection does not exist, or the query is invalid.
 *         If no `limit` is specified and more than 200 documents are found, an error is thrown asking to use `limit`.
 */
export async function find(
    db: LevelUp,
    collectionName: string,
    query: Record<string, any>,
    returnFields: string[] = [],
    limit?: number,
    offset?: number
): Promise<Record<string, any>[]> {
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

        // Validate returnFields
        if (!Array.isArray(returnFields)) {
            throw new Error('Return fields must be an array of strings.');
        }

        // Validate limit and offset
        if (limit !== undefined && (typeof limit !== 'number' || limit <= 0)) {
            throw new Error('Limit must be a positive number.');
        }
        if (offset !== undefined && (typeof offset !== 'number' || offset < 0)) {
            throw new Error('Offset must be a non-negative number.');
        }

        // Check if the collection exists
        const collectionExists = await findCollection(db, collectionName);
        if (!collectionExists) {
            throw new Error(`Collection "${collectionName}" does not exist.`);
        }

        // Fetch all keys for the collection
        const collectionKeys = await getAllKeys(db, collectionName);
        if (!collectionKeys || collectionKeys.length === 0) {
            return []; // No documents found
        }

        // Enforce limit if no limit provided but too many documents exist
        if (!limit && collectionKeys.length > 200) {
            throw new Error('More than 200 documents found. Please specify a limit.');
        }

        // Fetch matching documents
        const matchingDocuments: Record<string, any>[] = [];
        let documentsReturned = 0;

        for (const key of collectionKeys) {
            const documentString = await get(db, key);
            if (!documentString) continue;

            const document = JSON.parse(documentString);

            // Match the query fields
            const matchesQuery = Object.keys(query).every((field) => {
                if (field === 'createdAt' || field === 'updatedAt') {
                    if (query[field]?.gte && new Date(document[field]) < new Date(query[field].gte)) return false;
                    if (query[field]?.lte && new Date(document[field]) > new Date(query[field].lte)) return false;
                } else {
                    if (document[field] !== query[field]) return false;
                }
                return true;
            });

            if (matchesQuery) {
                if (returnFields.length > 0) {
                    const filteredDocument: Record<string, any> = {};
                    returnFields.forEach((field) => {
                        if (field in document) {
                            filteredDocument[field] = document[field];
                        }
                    });
                    matchingDocuments.push(filteredDocument);
                } else {
                    matchingDocuments.push(document);
                }

                documentsReturned++;
            }

            if (limit && documentsReturned >= limit) break;
        }

        return matchingDocuments.slice(offset || 0, (offset || 0) + (limit || matchingDocuments.length));
    } catch (error: any) {
        throw new Error(`Error finding documents: ${error.message}`);
    }
}

/**
 * Helper function to fetch all keys for a specific collection.
 *
 * @param db - The RocksDB instance to interact with.
 * @param collectionName - The name of the collection.
 * @returns A promise that resolves to an array of keys for the collection.
 */
async function getAllKeys(db: LevelUp, collectionName: string): Promise<string[]> {
    const allKeys: string[] = [];
    const iterator = db.iterator({
        gte: `${collectionName}:`,
        lte: `${collectionName}:\xff`,
    });

    return new Promise((resolve, reject) => {
        const keys: string[] = [];
        iterator.each((err: any, key: { toString: () => string; }, value: any) => {
            if (err) reject(err);
            if (!key) resolve(keys);
            keys.push(key.toString());
        });

        iterator.end((err) => {
            if (err) reject(err);
            resolve(keys);
        });
    });
}
