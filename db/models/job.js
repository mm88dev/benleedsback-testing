"use strict";

const mongoose = require("mongoose");

const JobSchema = mongoose.Schema({

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
    quantity: {
        type: Number
    },
    comment: {
        type: String
    },
    checked: {
        type: Boolean,
        required: true,
        default: false
    },
    workorderId: {
        type: mongoose.Schema.Types.ObjectId
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId
    }, 
    status: {
        type: String,
        required: true,
        default: "pending"
    },
    assignmentDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    finishedDate: {
        type: Date
    }
});

// export Job constructor function
const Job = module.exports = mongoose.model("job", JobSchema);

// admin gets all jobs
module.exports.getAllJobs = function(res, callback) {

    Job.find({})
    .then(jobs => {

        let data;
        if (jobs !== null) {
            data = jobs;
        } else {
            data = {
                error: "No workorders avalailable"
            };
        }
        data = JSON.stringify(data);
        callback(res, data);
    })
    .catch(err => {
        console.log("An error occured while getting jobs : " + err);
    });
};
// admin gets a single workorder
module.exports.getSingleJob = function(_id, res, callback) {

    Job.findById(_id)
    .then(job => {

        let data;
        if (job !== null) {
            data = job;
        } else {
            data = {
                error: "No job for that id"
            };
        }
        data = JSON.stringify(data);
        callback(res, data);
    })
    .catch(err => {
        console.log("An error occured while getting specific job : " + err);
    });
};


function workorderIdBased(workorder) {
    
    return new Promise((resolve, reject) => {

        Job.find({
            workorderId: mongoose.Types.ObjectId(workorder._id)
        })
        .then(jobs => {

            let data;
            if (jobs !== null) {
                data = {
                    workorder: workorder,
                    jobs: jobs
                };
            } else {
                data = {
                    workorder: workorder,
                    error: "There are no jobs associated with that workorder"
                };
            }
            resolve(data);
        })
        .catch(err => {
            console.log("An error occured while getting jobs associated with a specific workorder : " + err);
        });
    });
}


// admin/user on login gets jobs associated with an instance of a workorder
module.exports.getWorkorderJobs = async function(workorder, res, callback, loginAction) {

    let data;
    if (loginAction) {
        // getting workorder jobs following successfull user's login
        data = {
            user: workorder.user,
            workorders: []
        };
        for (let i = 0; i < workorder.workorders.length; i++) {
            const workorderJobs = await workorderIdBased(workorder.workorders[i]);
            data.workorders.push({
                status: workorderJobs.workorder.status,
                _id: workorderJobs.workorder._id,
                buildingNumber: workorderJobs.workorder.buildingNumber,
                apartmentNumber: workorderJobs.workorder.apartmentNumber,
                loginTime: workorderJobs.workorder.loginTime,
                completedTime: workorderJobs.workorder.completedTime,
                sendTime: workorderJobs.workorder.sendTime,
                comment: workorderJobs.workorder.comment,
                userId: workorderJobs.workorder.userId,
                totalPrice: workorderJobs.workorder.totalPrice,
                adress: workorderJobs.workorder.adress,
                questions: workorderJobs.workorder.questions,
                jobs: workorderJobs.jobs
            }); 
        }
        callback(data);
    } else {
        // getting jobs for a single job on the admin side 
        data = await workorderIdBased(workorder);
        data = JSON.stringify(data);
        callback(res, data);
    }
};

// following a workorder insert an array of jobs is inserted
module.exports.createJobs = function(workorderData, callback) {

    let NewJobs = [];
    for (let i = 0; i < workorderData.jobs.length; i++) {
        const newJob = Job(workorderData.jobs[i]);
        NewJobs.push(newJob);
    }
    Job.insertMany(NewJobs)
    .then(jobs => {

        let data;
        if (jobs !== null) {
            data = workorderData;
        } else {
            data = {
                error: "No jobs assocciated with that workorder"
            };
        }
        callback(data);
    })
    .catch(err => {

        console.log("An error occurred while inserting jobs " + err);
    });
};

// admin assigns job to a vendor
module.exports.assignJob = function(jobData, callback) {

    Job.findByIdAndUpdate(jobData.job._id, {
        $set : {
            vendorId: jobData.job.vendorId,
            status: jobData.job.status,
            assignmentDate: jobData.job.assignmentDate,
            endDate: jobData.job.endDate
        }
    },{
        new: true
    })
    .then(job => {

        let data;
        if (job !== null) {
            // job edited successfully, pass vendor and workorder data further along
            data = jobData;
        } else {
            data = {
                error: "An error occured while updating a job"
            };
        }
        callback(data);
    })
    .catch(err => {

        console.log("An error occured while updating a job " + err);
    });
};  
// admin declares job finished
module.exports.finishJob = function(jobData, res, callback) {

    Job.findByIdAndUpdate(jobData._id, {
        $set: {
            status: jobData.status,
            finishedDate: jobData.finishedDate
        }
    }, {
        new: true
    })
    .then(job => {
        
        let data;
        if (job !== null) {
            data = {
                success: "Ok"
            }; 
        } else {
            data = {
                error: "An error occurred while declaring a job finished"
            };
        }
        data = JSON.stringify(data);
        callback(res, data);
    })
    .catch(err => {

        console.log("An error occured while declaring a job finished " + err);
    }); 
};


// user gets jobs associated with latest workorder
module.exports.getLatestWorkorderJobs = function(workorderData, res, callback) {

    Job.find({
        workorderId: mongoose.Types.ObjectId(workorderData.workorder._id)
    })
    .then(jobs => {

        let data;
        if (jobs !== null) {  
            data = {
                workorder: workorderData.workorder,
                jobs: workorderData.jobs
            };
        } else {
            data = {
                workorder: workorderData.workorder,
                error: "Could not get jobs for that workorder"
            }
        }
        data = JSON.stringify(data);
        callback(res, data);
    })
    .catch(err => {

        console.log("An error has occurred while geting jobs related to the latest workorder of the logged user");
    });
};
















// function updateJobIdBased(job) {

    //     return new Promise((reject, resolve) => {
    
    //         Job.update({
    //             workorderId: job.workorderId 
    //         }, {
    //             $set: {
    //                 quantity: job.quantity, 
    //                 comment: job.comment, 
    //                 checked: job.checked
    //             }
    //         }, {
    //             new: true
    //         })
    //         .then(job => {
    
    //             let data;
    //             if (data !== null) {
    //                 data = job;
    //             } else {
    //                 data = {
    //                     error: "Could not update the job"
    //                 }
    //             }
    //             resolve();
    //         }) 
    //         .catch(err => {
    //             console.log("An error occured while updating a job " + err);
    //         })
    //         resolve();
    //     });
    // }
    
    // // user updates a workorder and jobs assocciated with it
    // module.exports.updateWorkorderJobs =  async function(workorderData, callback) {
    
    //     let data = {
    //         success: "ok"
    //     };
    //     let jobsReturn = [];
    //     for (let i = 0; i < workorderData.jobs.length; i ++) {
    //         const jobUpdated = await updateJobIdBased(workorderData.jobs[i]);
    //         jobUpdated.workorderId = workorderData.workorder.id || workorderData.workorder._id;
    //         jobsReturn.push(jobUpdated);
    //     }
    //     // check if some of the jobs encoutered trouble while being updated
    //     for (let i = 0; i < jobsReturn.length; i++) {
    //         if (jobsReturn[i].error !== undefined) {
    //             data = {
    //                 error: "Some of the jobs could not be updated"
    //             };
    //         }
    //     }
    //     callback(res, data);
    // };
