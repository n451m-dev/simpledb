# SimpleDB

**SimpleDB** is a lightweight, document-based database built on top of leveldb. It provides efficient storage and retrieval of documents using a simple interface.

## Features

- Lightweight and fast
- Document-based storage
- Built on top of leveldb for high-performance read write.

## Getting Started

### Prerequisites

- **Ubuntu** (or other Linux distributions)
- **Node.js** (bundled with the SimpleDB package)
- **Systemd** for service management

## Installation

1. **Download and Install SimpleDB**
  
   Download the `.deb` package for AMD64 Machine from the GitHub release page and install.

2. **Starting the service**

   
   <code> 
     sudo systemctl start simpledb
   </code>
   

4. **Enable to start on boot**
   
   <code> 
     sudo systemctl enable simpledb
   </code>

   
## Try it on


1. **Open terminal and type simplesh**

   <code> 
      simplesh
   </code>

   <p> 
   It will open the shell to connect to the database, there is no authentication implemented, so it is not recommended to use in production environmnet, just to test it out.
   </p>

   <p> 
   Once connected to the shell you can perform crud operations.
   </p>

   <strong> Create Collection</strong>


   <code>collection.create({collectionName: "users"}) </code>


   <strong> List Collections</strong>


   <code>collection.listCollection() </code>


   <strong> Delete Collection</strong>


   <code>collection.delete({collectionName: "users"}) </code>


   <strong> Create document</strong>


   <code>users.createOne({name: "John Doe"}) </code>


   <strong> Read one document</strong>


   <code>users.findOne({name: "John Doe"}) </code>


   <strong> Read all document(arg optional)</strong>


   <code>users.find({name: "John Doe"}) </code>


   <strong>Update document</strong>


   <code>users.updateOne({name: "John Doe"}, {name: "Doe John"}) </code>


   <strong> Delete document</strong>


   <code>users.deleteOne({name: "Doe John"})</code>
