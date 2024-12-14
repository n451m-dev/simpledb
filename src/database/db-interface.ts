// collection related
import { createCollection } from "../collection/create-collection";
import { findCollection } from "../collection/find-collection";
import { deleteCollection } from "../collection/delete-collection";
import { listCollections } from "../collection/list-collections";
import { truncateCollection } from "../collection/truncate-collection";

// query
import { createOne } from "../query/create/create-one";
import { deleteOne } from "../query/delete/delete-one";
import { findOne } from "../query/read/find-one";
import { find } from "../query/read/find";

import { getOrCreateDatabaseSync } from "./db-instance";
import { LevelUp } from "levelup";

export class DatabaseInterface {
    private db: LevelUp;

    constructor() {
        this.db = getOrCreateDatabaseSync();
        try {
            this.db.open();
        } catch (err) {
            throw err;
        }
    }

    async createCollection(collectionName: string) {
        try {
            return await createCollection(this.db, collectionName);
        } catch (err) {
            throw err;
        }
    }

    async findCollection(collectionName: string) {
        try {
            return await findCollection(this.db, collectionName);
        } catch (err) {
            throw err;
        }
    }

    async deleteCollection(collectionName: string) {
        try {
            return await deleteCollection(this.db, collectionName);
        } catch (err) {
            throw err;
        }
    }

    async listCollections() {
        try {
            return await listCollections(this.db);
        } catch (err) {
            throw err;
        }
    }

    async truncateCollection(collectionName: string) {
        try {
            return await truncateCollection(this.db, collectionName);
        } catch (err) {
            throw err;
        }
    }

    async createOne(collectionName: string, data: Record<string, any>) {
        try {
            return await createOne(this.db, collectionName, data);
        } catch (err) {
            throw err;
        }
    }

    async deleteOne(collectionName: string, query: Record<string, any>) {
        try {
            return await deleteOne(this.db, collectionName, query);
        } catch (err) {
            throw err;
        }
    }

    async findOne(collectionName: string, query: Record<string, any>) {
        try {
            return await findOne(this.db, collectionName, query);
        } catch (err) {
            throw err;
        }
    }

    async find(collectionName: string, query: Record<string, any> = {}, options: string[] = []): Promise<any[]> {
        try {
            return await find(this.db, collectionName, query, options);
        } catch (err) {
            throw err;
        }
    }

}
