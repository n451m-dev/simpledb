import { parseQuery } from "./parse-query";
import { createCollection, deleteCollection, listCollections, createDocument, deleteDocument, findOneDocument, findAllDocuments } from "./make-db-request";

export const performOperation = async (input: string): Promise<any> => {
    try {
        const { collection, method, args } = parseQuery(input);

        // Handling collection-related methods
        switch (`${collection}-${method}`) {
            case 'collection-create':
                return await createCollection(args);
            case 'collection-listCollection':
                return await listCollections();
            case 'collection-delete':
                return await deleteCollection(args);
            case 'document-createOne':
                return await createDocument(collection, args);
            case 'document-deleteOne':
                return await deleteDocument(collection, args);
            case 'document-findOne':
                return await findOneDocument(collection, args);
            case 'document-find':
                return await findAllDocuments(collection, args);
            default:
                throw Error('Incorrect Command');
        }

    } catch (err) {
        throw err;
    }
};
