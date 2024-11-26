import { LevelUp } from 'levelup';

export async function createCollection(db: LevelUp, collectionName: string): Promise<void> {
    if (!collectionName || typeof collectionName !== 'string') {
        throw new Error('Collection name must be a non-empty string.');
    }

    const collectionKey = `__collection:${collectionName}`;
    const exists = await db.get(collectionKey).catch((err) => (err.notFound ? false : Promise.reject(err)));
    if (exists) {
        throw new Error(`Collection "${collectionName}" already exists.`);
    }

    return db.put(collectionKey, 'exists');
}
