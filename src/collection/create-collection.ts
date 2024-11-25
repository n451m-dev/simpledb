import RocksDB from 'rocksdb';

export async function createCollection(db: RocksDB, collectionName: string): Promise<void> {
    const collectionKey = `__collection:${collectionName}`;

    return new Promise((resolve, reject) => {
        db.put(collectionKey, 'exists', (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
}
