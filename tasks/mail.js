"use strict";
const nodemailer = require("nodemailer"); 
require('dotenv').config();


// regional sends mail to admin and him/herself
exports.userSendMail = function(data, res, cb) {
    
    const email = data.user.email;
    const emailPassword = data.user.emailPassword;
    const emailHost = "mail." + email.split("@")[1];
    // email transport config
    const transporter = nodemailer.createTransport({
        host:  emailHost,
        secure: true,
        port: 465,
        auth: {
            user: email,
            pass: emailPassword
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    // mail contents
    const subject = "New workorder has ben submitted for building : " + data.workorder.buildingNumber 
                    + " at address " + data.workorder.address;
    const content = "<div style='margin-bottom: 12px;'> Building Number : " + data.workorder.buildingNumber + "</div>" +
                    "<div style='margin-bottom: 12px;'> Apartment Number : " + data.workorder.apartmentNumber + "</div>" +
                    "<div style='margin-bottom: 12px;'> Login Time : " + data.workorder.loginTime.toString() + "</div>" +
                    "<div style='margin-bottom: 12px;'> Completed Time : " + data.workorder.completedTime.toString() + "</div>" +
                    "<div style='margin-bottom: 12px;'> Send Time : " + data.workorder.sendTime.toString() + "</div>" +
                    "<div style='margin-bottom: 12px;'> Regional Manager : " + data.user.name + "/<div>";
    const mailOptions = {
        from: email,
        to: process.env.ADMIN_EMAIL,
        subject: subject,
        html: content
    };
    let responseData;
    // trigger mail sending
    transporter.sendMail(mailOptions, function(err, info) {

        if (err) {
            responseData = {
                error: "An error has occured while attempting to send an email from regional to admin"
            };
            responseData = JSON.stringify(responseData);
            cb(res, responseData); 
            console.log("An error occurred : " + err);
            transporter.close();
        } else {
            // mail contents
            const subject2 = "You have submitted a new workorder for building : " + data.workorder.buildingNumber 
                            + " at address " + data.workorder.address;
            const content2 = "<div style='margin-bottom: 12px;'> Building Number : " + data.workorder.buildingNumber + "</div>" +
                            "<div style='margin-bottom: 12px;'> Apartment Number : " + data.workorder.apartmentNumber + "</div>" +
                            "<div style='margin-bottom: 12px;'> Login Time : " + data.workorder.loginTime.toString() + "</div>" +
                            "<div style='margin-bottom: 12px;'> Completed Time : " + data.workorder.completedTime.toString() + "</div>" +
                            "<div style='margin-bottom: 12px;'> Send Time : " + data.workorder.sendTime.toString() + "</div>" +
                            "<div style='margin-bottom: 12px;'> Regional Manager : " + data.user.name + "/<div>";                
            const mailOptions2 = {
                from: email,
                to: email,
                subject: subject2,
                html: content2
            };            
            // trigger mail sending
            transporter.sendMail(mailOptions2, function(err, info) {

                if (err) {
                    responseData = {
                        error: "An error has occured while attempting to send an email from regional to admin"
                    };
                    responseData = JSON.stringify(responseData);
                    cb(res, responseData); 
                    console.log("An eror occurred : " + err);
                } else {
                    responseData = {
                        success: "ok"
                    };
                    responseData = JSON.stringify(responseData);
                    cb(res, responseData);
                    console.log("User " + data.user.firstName +  " " + data.user.lastName + " has submitted a workorder.");
                }
                transporter.close();
            })
        }
    });
};

// admin mails vendor after assigning him a job
exports.adminSendMail = function(data, cb) {

    const email = process.env.ADMIN_EMAIL;
    const emailPassword = process.env.ADMIN_EMAIL_PASSWORD;
    const emailHost = process.env.ADMIN_EMAIL_HOST;
    // email transport config
    const transporter = nodemailer.createTransport({
        host: emailHost,
        port: 465,
        secure: true,
        auth: {
            user: email,
            pass: emailPassword
        },
        tls : {
            rejectUnauthorized: false
        }
    });
    // mail contents
    const subject =  "You just recieved a new job assignment from BenLeeds at address : " + data.workorder.adress;
    const content = "<div style='margin-bottom= 12px;'>Building Number : " + data.workorder.buildingNumber + "</div>"
                    + "<div style='margin-bottom= 12px;'>Apartment Number : " + data.workorder.apartmentNumber + "</div>"
                    + "<div style='margin-bottom= 12px;'>Assignment : " + data.job.name + "</div>"
                    + "<div style='margin-bottom= 12px;'>Room : " + data.job.room + "</div>"
                    + "<div style='margin-bottom= 12px;'>Description : " + data.job.comment + "</div"
                    + "<div style='margin-bottom= 12px;'>Quantity : " + data.job.quantity + "</div>";
    const mailOptions = {

        from: email,
        to: data.vendor.email,
        subject: subject,
        html: content
    };
    let responseData;
    // trigger mail sending
    transporter.sendMail(mailOptions, function(err, info) {

        if (err) {
            responseData = {
                error: "An error has occured while attempting to send email from admin to vendor"
            }
            console.log("An error occurred : " + err);
        } else {
            responseData = data;
            console.log("Everything is ok : " + info);
        }
        cb(responseData);
        transporter.close();
    });
};