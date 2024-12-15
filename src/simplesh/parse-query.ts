export function parseQuery(query: string) {
    try {
        console.log('parse-query');
        
        // Trim the query and remove any trailing semicolon if present
        query = query.trim().replace(/;$/, '');

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

        let parsedArgs: Record<string, any> | null = null;

        // Parse args if provided
        if (args.trim()) {
            try {
                // Ensure keys are properly double-quoted
                const sanitizedArgs = args.trim().replace(/(\w+)\s*:/g, '"$1":');

                // Parse the sanitized JSON
                parsedArgs = JSON.parse(sanitizedArgs);
            } catch (err) {
                console.error(err);
                throw new Error('Invalid JSON format in arguments.');
            }
        }


        return {
            collection,
            method,
            args: parsedArgs, // Null if no arguments are provided
        };
    } catch (err) {
        throw err;
    }
}
