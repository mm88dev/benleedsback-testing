"use strict";

const mongoose = require("mongoose");

const ItemSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    subCategory: {
        type: String,
        required: true
    },
    room: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    link: {
        type: String
    },
    status: {
        type: String,
        required: true
    }
});
// export Item constructor
const Item = module.exports = mongoose.model("item", ItemSchema);


// send all the items when app initializes
module.exports.getAllItems = function(res, callback) {

    Item.find({})
    .then(items => {
        
        let data;
        if (items !== null) {
            data = {
                items: items
            };
        } else {
            data = {
                error: "Could not get items"
            };
        }
        callback(res, data);
    })
    .catch(err => {

        console.log("An error occurred while getting the items " + err);
    });
};
// admin gets one instance of each item with status extra
module.exports.getAllExtraItems = function(res, callback) {

    Item.find({
        status: "extra",
        room: "Living Room"
    })
    .then(extraItems => {

        let data;
        if (extraItems != null) {
            data = {
                items: extraItems,
                room: {
                    name: "extra"
                }
            };
        } else {
            data = {
                error: "Could not get extra items"
            };
        }
        data = JSON.stringify(data);
        callback(res, data);
    })
    .catch(err => {

        console.log("An error occurred while getting all the extra items " + err);
    });
};
// user or admin gets items assocciated with an instance of a room
module.exports.getRoomItems = function (roomData, res, callback) {

    Item.find({
        room: roomData.name
    })
    .then(items => {
            
        let data;
        if (items !== null) {
            data = {
                items: items,
                room: roomData
            };
        } else {
            data = {
                room: roomData,
                errorMsg: "There are no items associated with that room"
            }
        }
        data = JSON.stringify(data);
        callback(res, data);
    })
    .catch(err => {

        console.log("An error occurred while searching for items within a specific room " + err);
    });
};

// for CRUD on items with extra status
const roomNames = [
    "Entrance",
    "Living Room",
    "Kitchen",
    "Hallway",
    "Hallway Bathroom",
    "Dining Room",
    "Master Bedroom",
    "Guest Bedroom",
    "Master Bathroom",
    "Guest Bathroom",
    "Laundry",
    "Patio",
    "Balcony",
    "Other"
];

// admin creates a new item
module.exports.createItem = async function(item, res, callback) {

    const status = item.status;
    let data;
    if (status === "regular") {
        // regular item
        const NewItem = Item(item);
        NewItem.save()
        .then(item => {
    
            if (item !== null) {
                data = {
                    success: "Ok"
                };
            } else {
                data = {
                    error: "Unsuccessfull attempt to insert a new item"
                };
            }
            data = JSON.stringify(data);
            callback(res, data);
        })
        .catch(err => {
    
            console.log("An error occurred while attempting to insert a new item " + err);
        });
    } else {
        // extra items
        let newExtraItems = [];
        for (let i = 0; i < roomNames.length; i++) {
            let newExtraItem = item;
            newExtraItem.room = roomNames[i];
            newExtraItem = Item(newExtraItem);
            newExtraItems.push(newExtraItem);
        }
        Item.insertMany(newExtraItems)
        .then(extraItems => {

            let data;
            if (extraItems !== null) {
                data = {
                    success: "ok"
                };
            } else {
                data = {
                    error: "An error has occured while creating new extra items"
                };
            }
            data = JSON.stringify(data);
            callback(res, data);
        })
        .catch(err => {

            console.log("An error has occured while creating new extra items "  + err);
        })
        data = JSON.stringify(data);
        callback(res, data);
    }       
};

function deleteSingleItem(item) {

    return new Promise((resolve, reject) => {

        Item.findOneAndRemove({
            name: item.name, 
            subCategory: item.subCategory,
            price: item.price,
            status: item.status
        })
        .then(removedExtraItem => {

            let data;
            if (removedExtraItem !== null) {
                data = {
                    success: "ok"
                };
            } else {
                data = {
                    error: "An error occurred while deleting an extra item"
                };
            }
            resolve(data);
        })
        .catch(err => {

            console.log("An error occurred while deleting an extra item " + err);
        });
    });
}; 

// admin deletes an existing item
module.exports.deleteItem = async function (item, res, callback) {

    let data;
    if (item.status === "regular") {
        // regular item
        Item.findByIdAndRemove(item._id)
        .then(result => {
            
            if (result !== null) {
                data = {
                    success: "Ok"
                };
            } else {
                data = {
                    error: "An error occured while trying to delete a single item"
                };
            }
            data = JSON.stringify(data);
            callback(res, data);
        })
        .catch(err => {
    
            console.log("An error occured while deleting specific item : " + err);
        });    
    } else {
        // extra item
        let removeResults = [];
        for (let i = 0; i < roomNames.length; i++) {
            let extraItemToBeRemoved = item;
            extraItemToBeRemoved.room = roomNames[i];
            const result = await deleteSingleItem(extraItemToBeRemoved);
            removeResults.push(result);
        }
        let errCount = 0;
        for (let i = 0; i < removeResults.length; i++) {
            if (removeResults[i].error !== undefined) {
                errCount++;
            }
        }
        if (errCount === 0) {
            data = {
                success: "ok"
            };
        } else {
            data = {
                error: "Failed to remove " + errCount + " occurrences of an extra item"
            };
        }
        data = JSON.stringify(data);
        callback(res, data);
    } 
};

function editSingleItem(item) {
    
    return new Promise((resolve, reject) => {
        
        Item.updateOne({
            name: item.old.name,
            subCategory: item.old.subCategory,
            price: item.old.price,
            status: item.old.status,
            link: item.old.link,
            room: item.old.room            
        }, {
            $set: {
                name: item.new.name,
                subCategory: item.new.subCategory,
                price: item.new.price,
                status: item.new.status,
                link: item.new.link
            },
        }, {
            new: true
        })
        .then(updatedItem => {

            let data;
            if (updatedItem !== null) {
                data = {
                    success: "ok"
                };
            } else {
                data = {
                    error: "An error occurred while updating an extra item"
                };
            }
            resolve(data);
        })
        .catch(err => {

            console.log("An error occurred while updating an extra item " + err);
        })
    });
};


// admin edits existing item
module.exports.editItem = async function (item, res, callback) {
    
    let data;
    if (item.old.status === "regular") {
        // regular item
        Item.findByIdAndUpdate(item.old._id, {
            $set: {
                name: item.new.name,
                subCategory: item.new.subCategory,
                room: item.new.room,
                price: item.new.price,
                link: item.new.link,
                status: item.new.status
            }
        }, {
            new: true
        })
        .then(updatedItem => {
         
            if (updatedItem !== null) {
                data = {
                    success: "Ok"
                };
            } else {
                data = {
                    error: "An error occured while updating an item"
                };
            }
            data = JSON.stringify(data);
            callback(res, data);
        })
        .catch(err => {
    
            console.log("An error occured while updating an item " + err);
        });
    } else {
        // extra items
        let updateResults = [];
        for (let i = 0; i < roomNames.length; i++) {
            let extraUpdatedItem = item;
            extraUpdatedItem.room = roomNames[i];
            const result = await editSingleItem(extraUpdatedItem);
            updateResults.push(result);
        }
        let errCount = 0;
        for (let i = 0; i < updateResults.length; i++) {
            if (updateResults[i].error !== undefined) {
                errCount++;
            }
        }
        if (errCount !== 0) {
            data = {
                error: "Failed to update " + errCount + " extra items"
            };
        } else {
            data = {
                success: "ok"
            };
        }
        data = JSON.stringify(data);
        callback(res, data);
    }
};

// user gets items from the jobs of the autosaved workorder
module.exports.getAutosaveItems = function(autosavedWorkorder, res, callback) {
    
    Item.find()
    .then(items => {

        let data;
        if (items !== null) {

            data = {
                workorder: autosavedWorkorder,
                items: []
            };
            items.forEach(item => {

                const itemId =  item._id.toString();
                let foundAt = null;
                for (let i = 0; i < autosavedWorkorder.jobs.length; i++) {
                    if (itemId === autosavedWorkorder.jobs[i]._id) {
                        foundAt = i;
                    }
                }
                // check if 
                if (foundAt === null) {
                    // push regular item
                    data.items.push(item);
                } else {
                    // push modified item for front end rendering
                    const modifiedItem = {
                         _id: item._id,
                        room: item.room,
                        subCategory: item.subCategory,
                        name: item.name,
                        price: item.price,
                        status: item.status,
                        quantity: autosavedWorkorder.jobs[foundAt].quantity,
                        comment: autosavedWorkorder.jobs[foundAt].comment,
                        checked: true
                    };
                    data.items.push(modifiedItem);
                }
            });
        } else {
            data = {
                error: "An error occurred while getting the items per autosave"
            };
        }
        callback(res, data);
    })
    .catch(err => {

        console.log("An error occurred while getting the items per autosave " + err);
    });
};