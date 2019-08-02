"use strict";

const nodemailer = require("nodemailer"); 
require('dotenv').config();

exports.userSendMail = function(data) {
    // sender email config
    const email = data.user.email;
    const emailPassword = data.user.emailPassword;
    const emailHost = "mail." + email.split("@")[1];
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
    // finally send mail
    transporter.sendMail(mailOptions, function(err, info) {

        if (err) {
            console.log("An error occurred : " + err);
            transporter.close();
        }
        if (info) {
            
            const subject2 = "You have submitted a new workorder for building : " + data.workorder.buildingNumber 
                            + " at address " + data.workorder.address;
            const mailOptions2 = {
                from: email,
                to: email,
                subject: subject2,
                html: content
            };            
            transporter.sendMail(mailOptions2, function(err, info) {

                if (err) {
                    console.log("An eror occurred : " + err);
                } 
                if (info) {
                    console.log("User " + data.user.firstName +  " " + data.user.lastName + " has submitted a workorder.");
                }
                transporter.close();
            })
        }
    });
};


exports.adminSendMail = function(data) {

    // sender email config
    const email = process.env.ADMIN_EMAIL;
    const emailPassword = process.env.ADMIN_EMAIL_PASSWORD;
    const emailHost = process.env.ADMIN_EMAIL_HOST;
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
    // finally send mail
    transporter.sendMail(mailOptions, function(err, info) {

        if (err) {
            console.log("An error occurred : " + err);
        }
        if (info) {
            console.log("Everything is ok : " + info);
            transporter.close();
        }
    });
};