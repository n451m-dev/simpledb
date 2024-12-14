import { LevelUp } from 'levelup';

export async function deleteCollection(db: LevelUp, collectionName: string) {
    try {
        
  
    if (!collectionName || typeof collectionName !== 'string') {
        throw new Error('Collection name must be a non-empty string.');
    }

    const collectionKey = `__collection:${collectionName}`;
    const exists = await db.get(collectionKey).catch((err) => (err.notFound ? false : Promise.reject(err)));
    if (!exists) {
        throw new Error(`Collection "${collectionName}" does not exist.`);
    }
   
    await db.del(collectionKey);

        return `Collection "${collectionName}" deleted successfully`

    } catch (err) {
        throw err;
    }
}
