import RocksDB from 'rocksdb';

export async function deleteCollection(db: RocksDB, collectionName: string): Promise<void> {
    const collectionKey = `__collection:${collectionName}`;

    return new Promise((resolve, reject) => {
        db.del(collectionKey, (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
}
