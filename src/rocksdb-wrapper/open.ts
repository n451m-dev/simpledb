import rocksdb from 'rocksdb';

/**
 * Opens a RocksDB database at the specified path.
 * 
 * @param path - The file system path where the RocksDB database is stored.
 * @returns A promise that resolves to the opened RocksDB instance.
 * @throws An error if the database fails to open.
 */
export async function openDB(path: string): Promise<rocksdb> {
    const db = rocksdb(path);
    return new Promise((resolve, reject) => {
        db.open((err: any) => {
            if (err) return reject(new Error(`Failed to open database at path "${path}": ${err.message}`));
            resolve(db);
        });
    });
}
