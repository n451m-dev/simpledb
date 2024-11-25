import RocksDB from 'rocksdb';

export async function truncateCollection(db: RocksDB, collectionName: string): Promise<void> {
    return new Promise((resolve, reject) => {
        // Prefix key pattern for documents in the collection
        const collectionPrefix = `${collectionName}:`;

        // Create an iterator to scan for all document keys in the collection
        const iterator = db.iterator({ gte: collectionPrefix, lte: `${collectionPrefix}\xff` });

        iterator.each((err: any, key: RocksDB.Bytes) => {
            if (err) {
                iterator.end(() => reject(err));
            }
            if (key) {
                // Delete the document by its key
                db.del(key, (delErr) => {
                    if (delErr) {
                        iterator.end(() => reject(delErr));
                    }
                });
            }
        });

        iterator.end(() => {
            resolve(); // After scanning and deleting all document keys
        });
    });
}
