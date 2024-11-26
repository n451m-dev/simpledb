import level from 'level';
import fs from 'fs';
import path from 'path';

/**
 * Back up the LevelDB database by copying it to another location.
 * @param dbPath - The path to the LevelDB database.
 * @param backupPath - The location to store the backup.
 */
export const backupDB = async (dbPath: string, backupPath: string): Promise<void> => {
    try {
        // Copy the entire LevelDB directory
        if (!fs.existsSync(dbPath)) {
            throw new Error(`Database path does not exist: ${dbPath}`);
        }

        const backupDir = path.join(backupPath, `backup_${Date.now()}`);
        fs.mkdirSync(backupDir, { recursive: true });

        // Use a simple file copy or a LevelDB-specific backup strategy
        // (Note: This is a basic file copy. Consider using a LevelDB-specific backup mechanism in production)
        fs.cpSync(dbPath, backupDir, { recursive: true });
        console.log(`Backup created at ${backupDir}`);
    } catch (error: any) {
        console.error(`Error backing up database: ${error.message}`);
        throw new Error('Database backup failed');
    }
};

/**
 * Compact the LevelDB database to reduce space and optimize performance.
 * @param db - The LevelDB instance.
 */
export const compactDB = async (db: level.LevelDB): Promise<void> => {
    try {
        // Compact the database to reclaim space and optimize performance
        await db.compact();
        console.log('Database compacted successfully.');
    } catch (error: any) {
        console.error(`Error compacting the database: ${error.message}`);
        throw new Error('Database compaction failed');
    }
};
