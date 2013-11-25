var responses = require('../response')
var security = require('../security')
var express = require('express');
var dbConfig = require('../../config/database')
var log = require('../log')
var error = require('../error')
var mail = require('../mail')

var app = module.exports = express();

var charList = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","v","w","x","y","z","1","2","3","4","5","6","7","8","9","0"];

app.post('/api/lostpassword', function (req, res) {
    log.out('debug','Lost password for user:'+req.body.email)
    resetPassword(req, res);
});

function resetPassword(request, response) {
      var pool = dbConfig
      var email = request.body.email;
      var password = generateNewPassword();
      var hashPassword = security.hash(password);
      log.out("debug", "New password " + password);
      pool.getConnection(function(err, connection) {
        connection.query("UPDATE users set password=? where email=?",[hashPassword,email], function(err, result) {
        console.log(result)
        if(err) {
           log.out('err',"Error updating password "+err);
           connection.release();
           error.send('Error retrieving session info','',response);
        } else if(result.changedRows > 0) {   
          mail.send(email,"Your learntocode password reset", "Hi,<br/> Your new password is: "+password + " <br/> Kind Regards, <br/>learntocode.eu");
          log.out('info','Updated password for '+email);         
          connection.release()
          response.jsonp(200, responses.success("Password reset"));
        } else {
          log.out('info','No user record found'+email);   
          connection.release();
          response.jsonp(416, 'No password reset');
        }
    });
 });
}

function generateNewPassword() {
  var password = "";
  for(var passwordElement = 0; passwordElement < 6; passwordElement++) {
    var charPosn = Math.floor(Math.random()*(charList.length-1))
    password += charList[charPosn];
  }
  console.log("Reset password "+password)
  return password;
}
