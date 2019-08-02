"use strict";
require('dotenv').config();

const accountSID = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSID, authToken);

module.exports.sendSMS = function(data) {

    const smsBody = "BenLeeds has assigned you to a new job. Address is " + data.workorder.adress;
    client.messages
    .create({
        body: smsBody,
        from: process.env.TWILIO_NUMBER,
        to: data.vendor.phone
    })
    .then(message => {
        console.log("Message sent successfully "  + message);
    })
    .catch(err => {
        console.log("An error orrucrred while attempting to send a SMS message : " + err);
    }); 
};