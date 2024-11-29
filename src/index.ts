import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import { DatabaseInterface } from "./database/db-interface";
import { ReflectionService } from '@grpc/reflection';
// Load proto file
const PROTO_PATH = path.join(__dirname, "proto", "database.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const proto = grpc.loadPackageDefinition(packageDefinition) as any; // Cast to avoid type issues
// Create the reflection implementation based on your gRPC package and add it to your server
const reflection = new ReflectionService(packageDefinition);
// Ensure you're accessing the correct service definition
const DatabaseService = proto.database.DatabaseService;

// Initialize the database interface
const dbInterface = new DatabaseInterface();

// Implement the gRPC server methods
const serverImpl = {
    async Connect(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
        try {
            // Simulate a connection or any database check
            console.log("Attempting to connect to the database...");
            const connectionMessage = "Successfully connected to the database!";
            callback(null, { message: connectionMessage });
        } catch (err) {
            callback({ code: grpc.status.INTERNAL, details: "Failed to connect to the database" }, null);
        }
    },

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
   
    // ReflectionService.enableReflection(server, DatabaseService.service);
    if (DatabaseService) {
        server.addService(DatabaseService.service, serverImpl);
        reflection.addToServer(server);
    } else {
        console.error("DatabaseService not found in the loaded proto");
        return;
    }

    const PORT = "50051";
    server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
        console.log(`Server running on port ${PORT}`);
        // server.start();
    });
}

startServer();
