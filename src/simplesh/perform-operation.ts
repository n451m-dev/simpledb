import { parseQuery } from "./parse-query";
import { createCollection, createDocument, deleteCollection, deleteDocument, findAllDocuments, findOneDocument, listCollections, updateOneDocument } from "./make-db-request";

export const performOperation = async (input: string): Promise<any> => {
    try {
        const { collection, method, args, updateData } = parseQuery(input);
        console.log("collection, method, args", collection, method, args);

        // collection related methods
        if (collection == 'collection' && method === 'create') {
            return await createCollection(args);
        } else if (collection == 'collection' && method === 'listCollection') {
            return await listCollections();
        } else if (collection === 'collection' && method === 'delete') {
            return await deleteCollection(args)
            // document related
        } else if (method === 'createOne') {
            return await createDocument(collection, args)
        } else if (method === 'deleteOne') {
            return await deleteDocument(collection, args)
        } else if (method === 'findOne') {
            return await findOneDocument(collection, args)
        } else if (method === 'find') {
            return await findAllDocuments(collection, args)
        } else if(method === 'updateOne'){
            return await updateOneDocument(collection, args, updateData)
        }else{
            throw Error('Incorrect command')
        }
    } catch (err) {
        throw err
    }
};