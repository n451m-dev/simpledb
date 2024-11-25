import RocksDB from 'rocksdb';

export async function findCollection(db: RocksDB, collectionName: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const collectionKey = `__collection:${collectionName}`;
        db.get(collectionKey, (err, value) => {
            if (err && err.message.includes('NotFound')) {
                return resolve(false);
            }
            if (err) {
                return reject(err);
            }
            resolve(true);
        });
    });
}
