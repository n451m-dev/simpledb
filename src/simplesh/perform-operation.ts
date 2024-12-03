import { parseQuery } from "./parse-query";
import { DatabaseInterface } from "../database/db-interface";

// Create a singleton instance of the DatabaseInterface
const dbInterface = new DatabaseInterface();

export const performOperation = async (input: string): Promise<any> => {
    try {
        const { collection, method, args } = parseQuery(input);

        // Collection-related methods
        if (collection === "collection" && method === "create") {
            return await dbInterface.createCollection(args?.collectionName || "");
        } else if (collection === "collection" && method === "listCollection") {
            return await dbInterface.listCollections();
        } else if (collection === "collection" && method === "delete") {
            return await dbInterface.deleteCollection(args?.collectionName || "");
        } else if (collection === "collection" && method === "truncate") {
            return await dbInterface.truncateCollection(args?.collectionName || "");
        }

        // Document-related methods
        if (method === "createOne") {
            return await dbInterface.createOne(collection, args || {});
        } else if (method === "deleteOne") {
            return await dbInterface.deleteOne(collection, args || {});
        } else if (method === "findOne") {
            return await dbInterface.findOne(collection, args || {});
        } else if (method === "find") {
            return await dbInterface.find(collection, args?.query || {}, args?.options || []);
        } else {
            throw new Error("Incorrect Command");
        }
    } catch (err) {
        throw err;
    }
};
