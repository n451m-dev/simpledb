/**
 * Validates and prepares a document before inserting it into the database.
 * Adds metadata like `id`, `createdAt`, and `updatedAt` automatically.
 * 
 * @param document - The input document.
 * @param schema - (Optional) A schema for validating required fields or defaults.
 * @returns The validated and prepared document.
 * @throws An error if validation fails.
 */
import { v4 as uuidv4 } from 'uuid';

export function validateAndPrepareDocument(
    document: Record<string, any>,
    // schema?: Record<string, any>
): Record<string, any> {
    try {
        
   
    if (typeof document !== 'object' || document === null || Array.isArray(document)) {
        throw new Error('Document must be a valid non-null object.');
    }
    if (Object.keys(document).length === 0) {
        throw new Error('Document cannot be empty.');
    }

    // Example: Validate schema (optional)
    // if (schema) {
    //     for (const key in schema) {
    //         if (schema[key].required && !(key in document)) {
    //             throw new Error(`Missing required field: ${key}`);
    //         }
    //         if (!(key in document) && 'default' in schema[key]) {
    //             document[key] = schema[key].default;
    //         }
    //     }
    // }

    // Add metadata
    const id = uuidv4();
    const timestamp = new Date().toISOString();
    return {
        id,
        ...document,
        createdAt: timestamp,
        updatedAt: timestamp,
    };
    } catch (err) {
        throw err;
    }
}
