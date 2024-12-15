export function parseQuery(query: string) {
    try {
        
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
        let updatedata: Record<string, any>;

        const objarr = args?.split(',')
        // Parse args if provided
        if (objarr[0].trim()) {
            try {
                // Ensure keys are properly double-quoted
                const sanitizedArgs = objarr[0].trim().replace(/(\w+)\s*:/g, '"$1":');
                parsedArgs = JSON.parse(sanitizedArgs);

                const sanitizedupdateData = objarr[1].trim().replace(/(\w+)\s*:/g, '"$1":');
                updatedata = JSON.parse(sanitizedupdateData);

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
        }
    } catch (err) {
        throw err;
    }
}
