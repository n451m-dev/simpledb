# SimpleDB

SimpleDB is a lightweight, document-based database built on top of leveldb. It aims to provide a simple, JSON-based applications, focusing on CRUD operations and multiple document management, created for learning purposes.

---

## Features

- **Document Storage**: Store and manage multiple JSON-based documents.
- **CRUD Operations**: Create, Read, Update, and Delete support for documents.
- **Collections**: Organize documents into collections.
- **Built on levelDB**: Leveraging leveldb for fast and efficient key-value storage.

---

## Installation And Usage

1. Clone the repository:
   ```bash
   git clone https://github.com/nasim-coder/simple-db.git


2. **Methods**:
   ```bash
   Coonect:
   curl -k --http2 -X POST https://localhost:50051/connect -d '{}' -H "Content-Type: application/json"

**Create a collection**
   ```bash
   curl -k --http2 -X POST https://localhost:50051/collection/create -d '{"collectionName": "myCollection"}' -H "Content-Type: application/json"
   
   ```bash
   curl -k --http2 -X POST https://localhost:50051/collection/find -d '{"collectionName": "myCollection"}' -H "Content-Type: application/json"

**Delete a collection**
   ```bash
   curl -k --http2 -X POST https://localhost:50051/collection/delete -d '{"collectionName": "myCollection"}' -H "Content-Type: application/json"

**Collection list**
   ```bash
   curl -k --http2 -X POST https://localhost:50051/collections/list -d '{}' -H "Content-Type: application/json"

**Create document**
   ```bash
   curl -k --http2 -X POST https://localhost:50051/document/create -d '{"collectionName": "myCollection", "data": {"name": "John", "age": 30}}' -H "Content-Type: application/json"

**Delete document**:
   ```bash
   curl -k --http2 -X POST https://localhost:50051/document/delete -d '{"collectionName": "myCollection", "query": {"name": "John"}}' -H "Content-Type: application/json"

**Find one document**:
   ```bash
   curl -k --http2 -X POST https://localhost:50051/document/find-one -d '{"collectionName": "myCollection", "query": {"name": "John"}}' -H "Content-Type: application/json"

**Find all**
   ```bash
   curl -k --http2 -X POST https://localhost:50051/documents/find -d '{"collectionName": "myCollection", "query": {"age": 30}, "options": []}' -H "Content-Type: application/json"

   ```bash
   curl -k --http2 -X POST https://localhost:50051/unknown-endpoint -d '{}' -H "Content-Type: application/json"

3. **generate key**

   ```bash
   openssl req -x509 -newkey rsa:2048 -nodes -keyout key.pem -out cert.pem -days 365




