export function parseQuery(query: string) {
    try {
        // Trim the query and remove any trailing semicolon
        query = query.trim().replace(/;$/, '');

        // Regular expression to match the expected pattern
        const regex = /^([\w]+)\.([\w]+)\((.*)\)$/;

        // Match the query with the expected pattern
        const match = query.match(regex);

        if (!match) {
            throw new Error('Invalid query format. Expected format: collection.method({...}) or collection.method().');
        }

        const [, collection, method, args] = match;

        // Validate collection and method
        if (!collection || !method || !/^[a-zA-Z_][\w]*$/.test(collection) || !/^[a-zA-Z_][\w]*$/.test(method)) {
            throw new Error('Invalid collection or method name. Must be a valid string and not a number.');
        }

        let parsedArgs = null;
        let updatedata = null;

        // Pattern to match JavaScript objects in arguments
        const objectPattern = /{[^{}]+}/g;

        // Extract and parse objects from the arguments
        const matches = args.match(objectPattern);

        if (matches) {
            try {
                const sanitizedArgs = matches[0].trim().replace(/(\w+)\s*:/g, '"$1":');
                parsedArgs = JSON.parse(sanitizedArgs);

                if (matches[1]) {
                    const sanitizedUpdateData = matches[1].trim().replace(/(\w+)\s*:/g, '"$1":');
                    updatedata = JSON.parse(sanitizedUpdateData);
                }
            } catch (err) {
                console.error(err);
                throw new Error('Invalid JSON format in arguments.');
            }
        }

        return {
            collection,
            method,
            args: parsedArgs,
            updateData: updatedata
        };
    } catch (err) {
        throw err;
    }
}
