import levelup from 'levelup';
import leveldown from 'leveldown';
import { join } from 'path';
import { mkdirSync, existsSync } from 'fs';

let dbInstance: levelup.LevelUp;

export function getOrCreateDatabaseSync(): levelup.LevelUp {
    if (dbInstance) {
        return dbInstance; // Return cached instance
    }

    const dbname: string = 'simpledb';
    const dbPath = join(__dirname, '../../database', dbname);

    // Ensure the directory exists synchronously
    const databaseDir = join(__dirname, '../../database');
    if (!existsSync(databaseDir)) {
        mkdirSync(databaseDir, { recursive: true });
    }

    // Open the database (leveldown doesn't provide a truly synchronous way to "open", so it's assumed here)
    try {
        dbInstance = levelup(leveldown(dbPath));
        console.log(`Database "${dbname}" initialized successfully.`);
    } catch (err) {
        console.error('Error initializing database:', err);
        throw err;
    }

    return dbInstance;
}
