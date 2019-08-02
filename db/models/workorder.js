"use strict";

const mongoose = require("mongoose");
// create workorder Schema
const workorderSchema = mongoose.Schema({

    buildingNumber: {
        type: Number,
        required: true
    },
    apartmentNumber: {
        type: Number,
        required: true
    },
    adress: {
        type: String,
        required: true
    },
    loginTime: {
        type: String,
        required: true
    },
    completedTime: {
        type: Date,
        required: true
    },
    sendTime: {
        type: Date,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    totalPrice: {
        type: Number,
        required: true
    },
    comment: {
        type: String
    },
    status: {
        type: String,
        required: true,
        default: "pending"
    },
    squareFeet: {
        type: String
    },
    level: {
        type: String
    }
});
// export Workorder constructor 
const Workorder = module.exports = mongoose.model("workorder", workorderSchema);

// admin gets all workorders
module.exports.getAllWorkorders = function (callback) {

    Workorder.find({})
    .then(workorders => {
    
        let data;
        if (workorders !== null) {
            data = workorders;
        } else {
            data = {
                error: "Could not get workorders"
            };
        }
        callback(data);
    })
    .catch(err => {

        console.log("An error occurred while getting workorders : " + err);
    });
};
// user gets all workorders
module.exports.getAllWorkordersUser = function (res, callback) {

    Workorder.find({})
    .then(workorders => {
            
        let data;
        if (workorders !== null) {
            data = workorders;
        } else {
            data = {
                error: "Could not get workorders"
            };
        }
    callback(res, data);
    })
    .catch(err => {
        console.log("An error occurred while getting workorders : " + err);
    });
};
// admin gets a single workorder
module.exports.getSingleWorkorder = function(_id, callback) {

    Workorder.findById(_id)
    .then(workorder => {
    
        let data;
        if (workorder !== null) {
            data = workorder;
        } else {
            data = {
                error: "No workorder for that id"
            };
        }
        callback(data);
    })
    .catch(err => {
    
        console.log("An error occurred while getting specific workorder : " + err);
    });
};
// admin gets workorders associated with an instance of a user
module.exports.getUserWorkorders = function (user, res, callback) {

    Workorder.find({
        userId: mongoose.Types.ObjectId(user._id)
    })
    .then(workorders => {

        let data;
        if (workorders !== null) {
            data = {
                user: user,
                workorders: workorders
            };
        } else if (workorders.length === 0) {
            data = {
                user: user,
                workorders: "User has no workorders"
            };
        } else {
            data = {
                user: user,
                error: "Could not get workorders associated with that user"
            };
        }
        data = JSON.stringify(data);
        callback(res, data);
    })
    .catch(err => {
            
        console.log("An error occurred while getting workorder associated with a specific user " + err);
    });
};
// user gets workorders associated with an instance of a user
module.exports.getUserWorkordersLogin = function(user, callback) {

    Workorder.find({
        userId: mongoose.Types.ObjectId(user._id)
    })
    .then(workorders => {

        let data;
        if (workorders !== null) {
            data = {
                user: user,
                workorders: workorders
            };
        } else if (workorders.length === 0) {
            data = {
                user: user,
                workorders: "User has no workorders"
            };
        } else {
            data = {
                user: user,
                error: "Could not get workorders associated with that user"
            };
        }
        callback(data);
    })
    .catch(err => {
        console.log("An error occurred while getting workorder associated with a specific user " + err);
    });
};

// user inserts new workorder
module.exports.createWorkorder = function (workorderData, callback) {

    const NewWorkorder = Workorder(workorderData.workorder);
    NewWorkorder.save()
    .then(workorder => {
            let data;

        if (workorder !== null) {
            // add jobs to data passed further
            data = workorderData;
            // add workorederId to each joobs
            data.jobs.forEach(job => {
                job.workorderId = workorder._id
            });
        } else {
            data = {
                error: "Unsuccessfull attempt to insert a new workorder"
            };
        }
        callback(data);
    })
    .catch(err => {

        console.log("An error occurred while inserting new workorder " + err);
    });
};

// admin edits existing workorder
module.exports.editWorkorder = function (jobData, res, callback) {

    Workorder.findByIdAndUpdate(jobData.workorder._id, {
        $set: {
            status: jobData.workorder.status
        }
    }, {
        new: true
    })
    .then(workorder => {

        let data;
        if (workorder !== null) {
            data = {
                success: "Ok"
            };
        } else {
            data = {
                error: "An error occured while updating a workorder"
            };
        }
        data = JSON.stringify(data);
        callback(res, data);
        // send email to vendor with job details and date he's been assigned to
        const MailTask = require("../../tasks/mail");
        MailTask.adminSendMail(jobData);
        // send sms to vendor 
        const SmsTask = require("../../tasks/sms");
        SmsTask.sendSMS(jobData);        
    })
    .catch(err => {

        console.log("An error occured while updating a workorder " + err);
    });
};

// user updates an existing workorder
module.exports.updateWorkorder = function (workorderData, callback) {

    Workorder.findByIdAndUpdate(workorderData.workorder._id, {
        $set: {
            status: workorderData.workorder.status,
            loginTime: workorderData.workorder.loginTime,
            completedTime: workorderData.workorder.completedTime,
            sendTime: workorderData.workorder.sendTime,
            comment: workorderData.workorder.comment,
            totalPrice: workorderData.workorder.totalPrice,
        }
    }, {
        new: true
    })
    .then(workorder => {
            
        let data;
        if (workorder !== null) {
            data = workorderData;
        } else {
            data = {
                error: "An error occurred while updating a saved workorder"
            };
        }
        callback(data);
    })
    .catch(err => {
            
        console.log("An error occurred while updating a saved workorder " + err);
    });
};

// regional gets his/hers sent workorders
module.exports.getAllRegionalWorkorders = function(userId, res, callback) {

    Workorder.find({
        userId: mongoose.Types.ObjectId(userId)
    })
    .then(workorders => {

        let data = workorders;
        if (data !== null) {
            data = JSON.stringify(data);
        }
        callback(res, data);
    })
    .catch(err => {

        console.log("An error occurre while getting all the regional's workorders " + err);
    }); 
};
