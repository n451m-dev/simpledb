import levelup from 'levelup';
import leveldown from 'leveldown';
import { resolve } from 'path';

class Database {
    private db: levelup.LevelUp;

    constructor(dbPath: string = './mydb') {
        this.db = levelup(leveldown(resolve(dbPath)));
    }

    // Get a value by key
    async get(key: string): Promise<string | undefined> {
        try {
            return await this.db.get(key);
        } catch (error: any) {
            throw new Error(`Error getting value: ${error.message}`);
        }
    }

    // Put a key-value pair
    async put(key: string, value: string): Promise<void> {
        try {
            await this.db.put(key, value);
        } catch (error: any) {
            throw new Error(`Error putting value: ${error.message}`);
        }
    }

    // Delete a key-value pair
    async delete(key: string): Promise<void> {
        try {
            await this.db.del(key);
        } catch (error: any) {
            throw new Error(`Error deleting value: ${error.message}`);
        }
    }

    // Batch operations
    // async batch(operations: Array<{ type: string; key: string; value?: string }>): Promise<void> {
    //     try {
    //         this.db.batch(operations);
    //     } catch (error: any) {
    //         throw new Error(`Error in batch operation: ${error.message}`);
    //     }
    // }

    // Close the DB connection
    async close(): Promise<void> {
        try {
            await this.db.close();
        } catch (error: any) {
            throw new Error(`Error closing DB: ${error.message}`);
        }
    }
}

const dbInstance = new Database();  // Use default path or specify the DB path
export { dbInstance };
