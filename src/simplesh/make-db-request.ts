import http2 from 'http2';

// Server address
const serverUrl = 'https://localhost:50051';

// Helper function to make HTTP/2 requests
function makeRequest(path: string, method: string, body: any = {}) {
    return new Promise((resolve, reject) => {
        const client = http2.connect(serverUrl, {
            rejectUnauthorized: false, // For self-signed certificates; not for production
        });

        const req = client.request({
            ':path': path,
            ':method': method,
            'content-type': 'application/json',
        });

        let responseData = '';

        req.setEncoding('utf8');
        req.on('data', (chunk) => {
            responseData += chunk;
        });

        req.on('end', () => {
            client.close();
            try {
                resolve(JSON.parse(responseData));
            } catch (err) {
                reject(err);
            }
        });

        req.on('error', (err) => {
            client.close();
            reject(err);
        });

        if (method === 'POST') {
            req.write(JSON.stringify(body));
        }

        req.end();
    });
}

// Individual methods for each request

export async function connect() {
    try {
        return await makeRequest('/connect', 'POST');
    } catch (err) {
        throw err;
    }

}

export async function createCollection(body: any) {
    try {
        const parsedBody = typeof body === 'string' ? JSON.parse(body) : body;
        return await makeRequest('/collection/create', 'POST', parsedBody);
    } catch (err) {
        throw err
    }

}

export async function truncateCollection(body: any){
    try {
        return makeRequest('/collection/truncate', 'POST', body);
    } catch (err) {
        throw err
    }
}

export async function deleteCollection(body: any) {
    try {
        return await makeRequest('/collection/delete', 'POST', body);
    } catch (err) {
        throw err
    }

}

export async function listCollections() {
    try {
        return await makeRequest('/collections/list', 'POST');
    } catch (err) {
        throw err
    }

}

export async function createDocument(collectionName: any, data: any) {
    try {
        const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
        return await makeRequest('/document/create', 'POST', { collectionName, data: parsedData });
    } catch (err) {
        throw err
    }

}

export async function deleteDocument(collectionName: any, query: any) {
    try {
        return await makeRequest('/document/delete', 'POST', { collectionName, query });
    } catch (err) {
        throw err
    }

}

export async function findOneDocument(collectionName: any, query: any) {
    try {
        return await makeRequest('/document/find-one', 'POST', { collectionName, query });
    } catch (err) {
        throw err
    }
}

export async function findAllDocuments(collectionName: any, query: any) {
    try {
        const parsedQuery = typeof query === 'string' ? JSON.parse(query) : query;
        return await makeRequest('/documents/find', 'POST', { collectionName, query: parsedQuery });
    } catch (err) {
        throw err
    }

}

export async function updateOneDocument(collectionName: any, query: any, updateData: any) {
    try {
        const parsedQuery = typeof query === 'string' ? JSON.parse(query) : query;
        const parsedUpdateData = typeof updateData === 'string' ? JSON.parse(updateData) : updateData;
        return await makeRequest('/document/update-one', 'POST', { collectionName, query: parsedQuery, updateData: parsedUpdateData });
    } catch (err) {
        throw err
    }

}

export async function callUnknownEndpoint() {
    try {
        return await makeRequest('/unknown-endpoint', 'POST');
    } catch (err) {
        throw err
    }

}
