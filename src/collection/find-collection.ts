import { LevelUp } from 'levelup';

export async function findCollection(db: LevelUp, collectionName: string): Promise<boolean> {
    try {
        
    
    if (!collectionName || typeof collectionName !== 'string') {
        throw new Error('Collection name must be a non-empty string.');
    }

    const collectionKey = `__collection:${collectionName}`;
    try {
        await db.get(collectionKey);
        return true;
    } catch (err: any) {
        if (err.notFound) return false;
        throw err;
    }
    } catch (err) {
        throw err;
    }
}
