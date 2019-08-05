"use strict";

const mongoose = require("mongoose");

const BuildingSchema = mongoose.Schema({

    number: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    units: {
        type: String
    },
    managerName: {
        type: String
    },
    managerEmail: {
        type: String
    },
    managerPhone: {
        type: String
    }
});
// export Building constructor function
const Building = module.exports = mongoose.model("building", BuildingSchema);

// send all the buildings when app initializes
module.exports.getAllBuildings = function(res, callback) {

    Building.find({})
    .then(buildings => {
        let data;
        if (buildings !== null) {
            data = {
                buildings: buildings
            };
        } else {
            data = {
                error: "Could not get buildings"
            };
        }
        data = JSON.stringify(data);
        callback(res, data);
    })
};
// user gets a single instance of a building
module.exports.getSingleBuilding = function(number, res, callback) {

    Building.findOne({
        number: number
    })
    .then(building => {

        let data;
        if (building !== null) {
            data = building;
        } else {
            data = {
                error: "Building with that number does not exist in BenLeeds database"
            };
        }
        data = JSON.stringify(data);
        callback(res, data);
    })
    .catch(err => {
        console.log("An error occurred while searching for a specific building " + err);
    });
};


