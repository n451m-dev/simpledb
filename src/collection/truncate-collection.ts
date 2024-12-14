import { LevelUp } from 'levelup';

export async function truncateCollection(db: LevelUp, collectionName: string): Promise<void> {
    try {
        
    if (!collectionName || typeof collectionName !== 'string') {
        throw new Error('Collection name must be a non-empty string.');
    }

    const collectionKey = `__collection:${collectionName}`;
    const exists = await db.get(collectionKey).catch((err) => (err.notFound ? false : Promise.reject(err)));
    if (!exists) {
        throw new Error(`Collection "${collectionName}" does not exist.`);
    }

    return new Promise((resolve, reject) => {
        const collectionPrefix = `${collectionName}:`;
        const iterator = db.iterator({ gte: collectionPrefix, lte: `${collectionPrefix}\xff` });

        const processNext = () => {
            iterator.next((err, key) => {
                if (err) {
                    iterator.end(() => reject(err));
                    return;
                }
                if (key) {
                    db.del(key, (delErr) => {
                        if (delErr) {
                            iterator.end(() => reject(delErr));
                            return;
                        }
                        processNext();
                    });
                } else {
                    iterator.end((endErr) => {
                        if (endErr) return reject(endErr);
                        resolve();
                    });
                }
            });
        };
        processNext();
    });
    } catch (err) {
        throw err;
    }
}
