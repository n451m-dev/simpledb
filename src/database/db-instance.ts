import levelup from 'levelup';
import leveldown from 'leveldown';
import { join } from 'path';
import { promises as fs } from 'fs';

export async function getOrCreateDatabase(): Promise<levelup.LevelUp> {
    const dbname: string = 'simpledb';
    const dbPath = join(__dirname, '../../database', dbname);

    try {
        await fs.mkdir(join(__dirname, '../../database'), { recursive: true });
    } catch (err) {
        console.error('Error creating database directory:', err);
        throw err; 
    }

    
    const db = levelup(leveldown(dbPath));

    try {
        await db.open();
        console.log(`Database "${dbname}" connection opened successfully.`);
    } catch (err) {
        console.error('Error opening database:', err);
        throw err; 
    }

    return db; 
}
