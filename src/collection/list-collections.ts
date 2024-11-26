import { LevelUp } from 'levelup';

export async function listCollections(db: LevelUp): Promise<string[]> {
    const collections: string[] = [];
    return new Promise((resolve, reject) => {
        const iterator = db.iterator({ gte: '__collection:', lte: '__collection;\xff' });

        const processNext = () => {
            iterator.next((err, key) => {
                if (err) {
                    iterator.end(() => reject(err));
                    return;
                }
                if (key) {
                    const collectionName = key.toString().split(':')[1];
                    if (collectionName) collections.push(collectionName);
                    processNext();
                } else {
                    iterator.end((endErr) => {
                        if (endErr) return reject(endErr);
                        resolve(collections);
                    });
                }
            });
        };
        processNext();
    });
}
