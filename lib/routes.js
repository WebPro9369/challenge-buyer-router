/**
 * Main application routes
 */

'use strict';
const _ = require('lodash')
let Cache = require('./db_redis')
let cacheInstance = new Cache()

// Post /buyers
function addBuyers(req, res) {

    let errorFields = _.filter([
        (!req.body.id) && 'id is not provided',
        (!req.body.offers || (req.body.offers && !req.body.offers.length)) && 'Invaild offers'
    ], x => x)

    if (errorFields.length > 0) {
        return res.status(400).json(errorFields.join())
    }

    return cacheInstance.addBuyer(req.body, (err, response) => {
        if (err) {
            return res.status(422).json({ "Error": err })
        } else {
            return res.status(201).json(response)
        }
    })
}

//Get /buyers/:id
function getBuyers(req, res) {

    if (!req.params.id) {
        return res.status(400).send('id should be provided')
    }

    return cacheInstance.getBuyer(req.params.id, (err, response) => {
        if (err) {
            return res.status(500).send({ "Error": err })
        } else {
            if (!response) {
                return res.status(404).send('No buyer found')
            } else {
                return res.status(200).json(response)
            }
        }
    })
}

//Get /route
function getRoute(req, res) {

    let timestamp = req.query.timestamp
    let device = req.query.device
    let state = req.query.state

    let errorFields = _.filter([
        (!device || (device && device == '')) && 'Invalid device',
        (!state || (state && state == '')) && 'Invalid state',
        (!timestamp || (timestamp && timestamp == '')) && 'Invalid timestamp'
    ], x => x)

    if (errorFields.length > 0) {
        return res.status(400).send(errorFields.join())
    }
    return cacheInstance.getRoute(timestamp, device, state, (err, response) => {
        if (err) {
            return res.status(500).send(err)
        } else {
            if (!response || response.length == 0) {
                return res.status(404)
            } else {
                res.set('location', response.location)
                return res.status(302).redirect(response.location)
            }
        }
    })
}

//Initialize redis db
function cleardb(req, res) {
    return cacheInstance.clearDB((err, response) => {
        if (err) {
            return res.status(500).send(err)
        } else {
            return res.status(200).send()
        }
    })
}


module.exports = {
    addBuyers,
    getBuyers,
    getRoute,
    cleardb
}
