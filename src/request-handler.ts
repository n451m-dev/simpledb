import { DatabaseInterface } from "./database/db-interface";

const dbInterface = new DatabaseInterface();

// Helper function to parse JSON body
const parseJSON = async (stream: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        let body = "";
        stream.on("data", (chunk: string) => (body += chunk));
        stream.on("end", () => {
            try {
                resolve(JSON.parse(body));
            } catch (err) {
                reject(err);
            }
        });
    });
};

// Request handler function
export const requestHandler = async (stream: any, method: string, urlpath: string) => {
    if (method !== "POST") {
        stream.respond({ 'content-type': 'application/json', ':status': 405 });
        stream.end(JSON.stringify({ error: "Method Not Allowed. Use POST only." }));
        return;
    }

    try {
        if (urlpath === "/connect") {
            console.log("Attempting to connect to the database...");
            const connectionMessage = "Successfully connected to the database!";
            stream.respond({ 'content-type': 'application/json', ':status': 200 });
            stream.end(JSON.stringify({ message: connectionMessage }));
        } else if (urlpath === "/collection/create") {
            const { collectionName } = await parseJSON(stream);
            await dbInterface.createCollection(collectionName);
            stream.respond({ 'content-type': 'application/json', ':status': 200 });
            stream.end(JSON.stringify({ message: "Collection created successfully", success: true }));
        } else if (urlpath === "/collection/find") {
            const { collectionName } = await parseJSON(stream);
            const collection = await dbInterface.findCollection(collectionName);
            stream.respond({ 'content-type': 'application/json', ':status': 200 });
            stream.end(JSON.stringify({ collectionName, collection }));
        } else if (urlpath === "/collection/delete") {
            const { collectionName } = await parseJSON(stream);
            await dbInterface.deleteCollection(collectionName);
            stream.respond({ 'content-type': 'application/json', ':status': 200 });
            stream.end(JSON.stringify({ message: "Collection deleted successfully", success: true }));
        } else if (urlpath === "/collections/list") {
            const collections = await dbInterface.listCollections();
            stream.respond({ 'content-type': 'application/json', ':status': 200 });
            stream.end(JSON.stringify({ collections }));
        } else if (urlpath === "/document/create") {
            const { collectionName, data } = await parseJSON(stream);
            console.log("collectionName, data", collectionName, typeof data);
            await dbInterface.createOne(collectionName, data);
            stream.respond({ 'content-type': 'application/json', ':status': 200 });
            stream.end(JSON.stringify({ message: "Document created successfully", success: true }));
        } else if (urlpath === "/document/delete") {
            const { collectionName, query } = await parseJSON(stream);
            const deleted = await dbInterface.deleteOne(collectionName, query);
            stream.respond({ 'content-type': 'application/json', ':status': 200 });
            stream.end(JSON.stringify({ deleted }));
        } else if (urlpath === "/document/find-one") {
            const { collectionName, query } = await parseJSON(stream);
            const document = await dbInterface.findOne(collectionName, query);
            stream.respond({ 'content-type': 'application/json', ':status': 200 });
            stream.end(JSON.stringify({ document }));
        } else if (urlpath === "/documents/find") {
            const { collectionName, query, options } = await parseJSON(stream);
            const documents = await dbInterface.find(collectionName, query || {}, options || []);
            stream.respond({ 'content-type': 'application/json', ':status': 200 });
            stream.end(JSON.stringify({ documents }));
        } else {
            stream.respond({ 'content-type': 'application/json', ':status': 404 });
            stream.end(JSON.stringify({ error: "Route not found" }));
        }
    } catch (err) {
        stream.respond({ 'content-type': 'application/json', ':status': 500 });
        stream.end(JSON.stringify({ error: err.message || "Internal Server Error" }));
    }
};
