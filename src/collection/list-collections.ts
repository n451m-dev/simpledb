import RocksDB from 'rocksdb';

export async function listCollections(db: RocksDB): Promise<string[]> {
    const collections: string[] = [];

    return new Promise((resolve, reject) => {
        const iterator = db.iterator({ gte: '__collection:', lte: '__collection;' });

        iterator.each((err: any, key: { toString: () => string; }) => {
            if (err) return reject(err);
            if (key) {
                const collectionName = key.toString().split(':')[1];
                collections.push(collectionName);
            }
        });

        iterator.end((err) => {
            if (err) return reject(err);
            resolve(collections);
        });
    });
}
