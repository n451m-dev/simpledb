import { AbstractLevelDOWN, AbstractIterator } from "abstract-leveldown";
import { LevelUp } from "levelup";

/**
 * Async generator to iterate over a LevelDB iterator.
 * @param iterator - The LevelDB iterator.
 */
export async function* asyncIterator(iterator: AbstractIterator<any, any>): AsyncGenerator<[string, string]> {
    
    try {
        while (true) {
            const result = await new Promise<{ key?: string; value?: string }>((resolve, reject) => {
                iterator.next((err: Error | null, key: string, value: string) => {
                    if (err) return reject(err);
                    resolve({ key, value });
                });
            });

            if (!result.key) break;
            yield [result.key, result.value];
        }
    } catch (err) {
        console.error("Iterator Error:", err);
        throw err;
    } finally {
        iterator.end(() => { });
    }
}
