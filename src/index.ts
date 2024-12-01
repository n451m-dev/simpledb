import express from "express";
import { Request, Response } from "express";
import { DatabaseInterface } from "./database/db-interface";

const app = express();
const PORT = 50051;

// Middleware to parse JSON requests
app.use(express.json());

// Initialize the database interface
const dbInterface = new DatabaseInterface();

// Routes

// Connect endpoint
app.post("/connect", async (req: Request, res: Response) => {
    try {
        console.log("Attempting to connect to the database...");
        const connectionMessage = "Successfully connected to the database!";
        res.status(200).json({ message: connectionMessage });
    } catch (err) {
        res.status(500).json({ error: "Failed to connect to the database" });
    }
});

// Create Collection
app.post("/collection", async (req, res) => {
    try {
        const { collectionName } = req.body;
        await dbInterface.createCollection(collectionName);
        res.status(200).json({ message: "Collection created successfully", success: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to create collection" });
    }
});

// Find Collection
app.get("/collection/:collectionName", async (req, res) => {
    try {
        const { collectionName } = req.params;
        const collection = await dbInterface.findCollection(collectionName);
        res.status(200).json({ collectionName, collection });
    } catch (err) {
        res.status(404).json({ error: "Collection not found" });
    }
});

// Delete Collection
app.delete("/collection/:collectionName", async (req, res) => {
    try {
        const { collectionName } = req.params;
        await dbInterface.deleteCollection(collectionName);
        res.status(200).json({ message: "Collection deleted successfully", success: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete collection" });
    }
});

// List Collections
app.get("/collections", async (req, res) => {
    try {
        const collections = await dbInterface.listCollections();
        res.status(200).json({ collections });
    } catch (err) {
        res.status(500).json({ error: "Failed to list collections" });
    }
});

// Create Document
app.post("/document", async (req, res) => {
    try {
        const { collectionName, data } = req.body;
        await dbInterface.createOne(collectionName, data);
        res.status(200).json({ message: "Document created successfully", success: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to create document" });
    }
});

// Delete Document
app.delete("/document", async (req, res) => {
    try {
        const { collectionName, query } = req.body;
        const deleted = await dbInterface.deleteOne(collectionName, query);
        res.status(200).json({ deleted });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete document" });
    }
});

// Find Document
app.post("/document/find-one", async (req, res) => {
    try {
        const { collectionName, query } = req.body;
        const document = await dbInterface.findOne(collectionName, query);
        res.status(200).json({ document });
    } catch (err) {
        res.status(404).json({ error: "Document not found" });
    }
});

// Find Documents
app.post("/documents", async (req, res) => {
    try {
        const { collectionName, query, options } = req.body;
        const documents = await dbInterface.find(collectionName, query || {}, options || []);
        res.status(200).json({ documents });
    } catch (err) {
        res.status(500).json({ error: "Error finding documents" });
    }
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
