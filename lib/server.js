'use strict';


let express = require('express');
let bodyParser = require("body-parser");
let morgan = require("morgan");
let routes = require('./routes');


function createServer() {
    // Setup server
    let app = express();
    app.use(morgan('dev')); // Log every request to console
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use((req, res, next) => {
        req.headers['content-type'] = 'application/json'
        next()
    })
    app.use(bodyParser.json());
    app.use((err, req, res, next) => {
        res.status(400).send({ error: "Request body is invalid JSON format" })
    })
    app.post('/buyers', routes.addBuyers)
    app.get('/buyers/:id', routes.getBuyers)
    app.get('/route', routes.getRoute)
    app.use('/cleardb', routes.cleardb)
        // All undefined asset or api routes should return a 404
    app.route('/*')
        .get((req, res) => {
            let result = {
                status: 404
            };
            res.sendStatus(result.status);
        });
    let server = require('http').createServer(app);
    return server;
}

module.exports = createServer;
