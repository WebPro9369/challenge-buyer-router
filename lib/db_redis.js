'use strict';

var redis = require("redis"),
    client = redis.createClient();

class Cache {
    constructor() {
        this.client = redis.createClient();
        this.client.select(1, () => {
            return this.client.on("error", (err) => {
                console.log("Error " + err);
            });
        });
    }

    addBuyer(body, callback) {
        this.client.hmset('buyers', body.id, JSON.stringify(body), (err, reply) => {
            if (err) {
                console.log("Error", err)
            }

            return callback(err, reply)
        })

    }

    getBuyer(id, callback) {
        this.client.hget('buyers', id, (err, object) => {
            if (err) {
                console.log('Error', err)
            }

            return callback(err, JSON.parse(object))
        });
    }

    getRoute(timestamp, device, state, callback) {

        let offers = []
        this.client.hgetall('buyers', (err, objects) => {
            if (err) {
                console.log('Error', err)
                return callback(err)
            }
            if (!objects || objects.length == 0) {
                return callback({ "Error": "not found" });
            }

            for (let key in objects) {
                let value = JSON.parse(objects[key]).offers
                value.forEach(i => {
                    offers.push(i)
                })
            }

            let filtered = offers.filter(offer => {
                return offer.criteria.device.includes(device) && offer.criteria.state.includes(state) && offer.criteria.hour.includes(new Date(timestamp).getUTCHours())
            })
            filtered.sort((a, b) => b.value - a.value)
            return callback(null, filtered[0])
        })
    }

    clearDB(callback) {
        this.client.flushdb(function(err, succeeded) {
            console.log(succeeded); // will be true if successfull
            return callback(null, succeeded)
        })

    }

}

module.exports = Cache;
