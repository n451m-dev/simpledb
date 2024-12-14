import http2 from "http2";
import fs from "fs";
import path from "path";
import { requestHandler } from "./request-handler";
const PORT = 50051;
// Load SSL/TLS certificates (required for HTTP/2)
const serverOptions = {
    key: fs.readFileSync(path.resolve(__dirname, 'certs/key.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, 'certs/cert.pem')),
};

// Create the HTTP/2 server
const server = http2.createSecureServer(serverOptions);

// Define routes
server.on('stream', (stream, headers) => {
    const method = headers[':method'];
    const urlpath = headers[':path'];
    requestHandler(stream, method, urlpath);
});

// Start the server

server.listen(PORT, () => {
    console.log(`simpledb is running on port: ${PORT}`);
});
