const levelup = require('levelup');

const leveldown = require('leveldown');  // Low-level store

// Use leveldown as the storage engine for levelup
const db = levelup(leveldown('./mydb'));

// Use the levelup API to interact with the database
db.put('name', 'LevelDB Example', function (err: any) {
    if (err) return console.log('Error inserting data:', err);
    console.log('Data inserted');
});
