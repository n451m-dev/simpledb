var levelup = require('levelup');
var leveldown = require('leveldown'); // Low-level store
// Use leveldown as the storage engine for levelup
var db = levelup(leveldown('./mydb'));
// Use the levelup API to interact with the database
db.put('name', 'LevelDB Example', function (err) {
    if (err)
        return console.log('Error inserting data:', err);
    console.log('Data inserted');
});
