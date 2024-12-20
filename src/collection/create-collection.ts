import * as levelup from 'levelup';

export async function createCollection(db: levelup.LevelUp, collectionName: string): Promise<void> {
    try {
    if (!collectionName || typeof collectionName !== 'string') {
        throw new Error('Collection name must be a non-empty string.');
    }

    const collectionKey = `__collection:${collectionName}`;
    const exists = await db.get(collectionKey).catch((err) => (err.notFound ? false : Promise.reject(err)));
    if (exists) {
        throw new Error(`Collection "${collectionName}" already exists.`);
    }

    return db.put(collectionKey, 'exists');
    } catch (err) {
        throw err;
    }
}
