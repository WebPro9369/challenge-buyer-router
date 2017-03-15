'use strict';
// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const port = 3000

let server = require('./lib/server')()

// Start server
server.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log('Express server listening on port %d', port);
});
