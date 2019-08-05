"use strict";

const mongoose = require("mongoose");

const VendorSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    profession: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    calendar: {
        type: Array
    },
    status: {
        type: String,
        required: true,
        default: "active"
    }
});

// export Vendor constructor function
const Vendor = module.exports = mongoose.model("vendor", VendorSchema);

// admin get all vendors
module.exports.getAllVendors = function (res, callback) {

    Vendor.find({})
    .then(vendors => {

        let data;
        if (vendors !== null) {
            data = vendors;
        } else {
            data = {
                error: "Could not get vendors"
            };
        }
        data = JSON.stringify(data);
        callback(res, data);
    })
    .catch(err => {
        console.log("An error occured while getting vendors " + err);
    });

};
// admin gets a single vendor
module.exports.getSingleVendor = function(_id, res, callback) {

    Vendor.findById(_id)
    .then(vendor => {

        let data;
        if (vendor !== null) {
            data = vendor;
        } else {
            data = {
                error: "No vendor for that id"
            };
        }
        data = JSON.stringify(data);
        callback(res, data);
    })
    .catch(err => {
        console.log("An error occured while getting specific vendor : " + err);
    });
};
// admin inserts new vendor
module.exports.createVendor = function(createdVendor, res, callback) {


    const NewVendor = Vendor(createdVendor)
    NewVendor.save()
    .then(vendor => {

        let data;
        if (vendor._id !== undefined) {
            data = {
                success: "Ok"
            };
        } else {
            data = {
                error: "Unsuccessfull attempt to insert a new vendor"
            };
        }
        data = JSON.stringify(data);
        callback(res, data);
    })
    .catch(err => {

        console.log("An error occured while creating a new vendor " + err);
    });
};

// admin deletes an existing vendor
module.exports.deleteVendor = function(_id, res, callback) {

    Vendor.findOneAndRemove({
        _id: mongoose.Types.ObjectId(_id)
    })
    .then(result => {

        let data;
        if (result !== null) {
            data = {
                success: "Ok"
            };
        } else {
            data = {
                error: "An error occured while trying to delete a single vendor" 
            };
        }
        data = JSON.stringify(data);
        callback(res, data);
    })
    .catch(err => {

        console.log("An error occured while deleting specific vendor : " + err);
    });
};
// admin edits existing vendor
module.exports.editVendor = function(editedVendor, res, callback) {

   Vendor.findByIdAndUpdate(editedVendor._id, {
    $set: {
        name: editedVendor.name,
        email: editedVendor.email,
        profession: editedVendor.profession,
        phone: editedVendor.phone,
        status: editedVendor.status
    }}, {
        new: true
    })
    .then(vendor => {

        let data;
        if (vendor !== null) {
            data = {
                success: "Ok"
            };
        } else {
            data = {
                error: "An error occured while editing a specific vendor"
            };
        }
        data = JSON.stringify(data);
        callback(res, data);
    })
    .catch(err => {

        console.log("An error occurred while editing a vendor " + err);
    });
};
// admin assign job to a vendor
module.exports.assignVendor = function(jobData, callback) {

    Vendor.findByIdAndUpdate(jobData.vendor._id, {
        $set : {
            name: jobData.vendor.name,
            email: jobData.vendor.email,
            profession: jobData.vendor.profession,
            phone: jobData.vendor.phone,
            status: jobData.vendor.status
        }
    },{
        new: true
    })
    .then(vendor => {
        
        let data;
        if (vendor !== null) {
            data = jobData;
        } else {
            data = {
                error: "An error occured while updating a vendor"
            };
        }
        callback(data);
    })
    .catch(err => {

        console.log("An error occured while assigning a job to a vendor " + err);
    });
}; 
