import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import DatabaseInterface from "./db-interface";

// Load proto file
const PROTO_PATH = path.join(__dirname, "../../proto", "database.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const proto = grpc.loadPackageDefinition(packageDefinition) as any; // Cast to any to avoid type issues

// Ensure you're accessing the correct service definition
const DatabaseService = proto.database.DatabaseService;

// Initialize the database interface
const dbInterface = new DatabaseInterface();

// Implement the gRPC server methods
const serverImpl = {
    async CreateCollection(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
        try {
            const collectionName = call.request.collectionName;
            await dbInterface.createCollection(collectionName);
            callback(null, { message: "Collection created successfully", success: true });
        } catch (err) {
            callback({ code: grpc.status.INTERNAL, details: "Failed to create collection" }, null);
        }
    },

    async FindCollection(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
        try {
            const collectionName = call.request.collectionName;
            const collection = await dbInterface.findCollection(collectionName);
            callback(null, { collectionName, collection });
        } catch (err) {
            callback({ code: grpc.status.NOT_FOUND, details: "Collection not found" }, null);
        }
    },

    async DeleteCollection(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
        try {
            const collectionName = call.request.collectionName;
            await dbInterface.deleteCollection(collectionName);
            callback(null, { message: "Collection deleted successfully", success: true });
        } catch (err) {
            callback({ code: grpc.status.INTERNAL, details: "Failed to delete collection" }, null);
        }
    },

    async ListCollections(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
        try {
            const collections = await dbInterface.listCollections();
            callback(null, { collections });
        } catch (err) {
            callback({ code: grpc.status.INTERNAL, details: "Failed to list collections" }, null);
        }
    },

    async CreateOne(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
        try {
            const { collectionName, data } = call.request;
            await dbInterface.createOne(collectionName, data);
            callback(null, { message: "Document created successfully", success: true });
        } catch (err) {
            callback({ code: grpc.status.INTERNAL, details: "Failed to create document" }, null);
        }
    },

    async FindOne(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
        try {
            const { collectionName, query } = call.request;
            const document = await dbInterface.findOne(collectionName, query);
            callback(null, { document });
        } catch (err) {
            callback({ code: grpc.status.NOT_FOUND, details: "Document not found" }, null);
        }
    }
};

// Create and start the gRPC server
function startServer() {
    const server = new grpc.Server();
    if (DatabaseService) {
        server.addService(DatabaseService.service, serverImpl);
    } else {
        console.error("DatabaseService not found in the loaded proto");
        return;
    }

    const PORT = "50051";
    server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
        console.log(`Server running on port ${PORT}`);
    });
}

startServer();
