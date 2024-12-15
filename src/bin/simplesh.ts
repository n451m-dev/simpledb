#!/usr/bin/env node
import readline from 'readline';
import { performOperation } from '../simplesh/perform-operation';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'simplesh> ',
});

// Manually write the prompt
// process.stdout.write('simplesh> ');
rl.prompt()

// Use an async wrapper to handle the line event
rl.on('line', async (line: string) => {
    const input = line.trim();
    if (input) {
        try {
            const output = await performOperation(input);
            console.log(output);
        } catch (err) {
            console.error(err.message);
        }
    }

    // process.stdout.write('simplesh> ');
    rl.prompt()
});

rl.on('close', () => {
    console.log('simplesh exited.');
    process.exit(0);
});
