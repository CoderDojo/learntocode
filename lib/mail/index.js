var nodemailer = require("nodemailer");
var log = require('../log')
var mail = require('../../config/mail')

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("Gmail",mail.config());


module.exports = {
    
    send: function(email,subject, content) { 
        var config = mail.config();
        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: config.auth.user, // sender address
            to: email, // list of receivers
            subject: subject+" ✔", // Subject line
            text: content, // plaintext body
            html: "<p>"+content+"</p>" // html body
        }

        // send mail with defined transport object
        smtpTransport.sendMail(mailOptions, function(error, response){
            console.log(response)
            if(error){
                console.log(error);
            }else{
                console.log("Message sent: " + response.message);
            }
            // if you don't want to use this transport object anymore, uncomment following line
            //smtpTransport.close(); // shut down the connection pool, no more messages
        });
    }
}
