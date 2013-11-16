var express = require('express')
var responses = require('../response')
var security = require('../security')
var dbConfig = require('../../config/database')
var log = require('../log')

var app = module.exports = express();

app.post('/api/login', function (req, res) {
    log.out('debug','Logging');
    var authenticate = {}
    authenticate.email = req.body.email;
    authenticate.password = security.hash(req.body.password);
    authenticateUser(authenticate,res)
});


function authenticateUser(authenticate, response) {
  log.out('debug','Authenicating user');
  var pool = dbConfig;
  pool.getConnection(function(err, connection) {
    connection.query("SELECT users.name, users.email, users.session_hash FROM users WHERE email=? and password=?",[authenticate.email, authenticate.password], function(err, result) {
      if(err) {
         log.out('err',"Error retrieving user "+err);
         connection.release();
         errorHandling('Error retrieving session info','',response);
      } else {
          log.out('info','result.length ' + authenticate.email + ' ' + result.length);
          if(result.length > 0) {            
            var user = result;
            connection.release();
            response.jsonp(200, user);
          } else {
            connection.release();
            errorHandling('Error logging in',['Invalid username or password'],response);
          }
      }
    });
 });
}


function errorHandling(messageText, errorList, response) {
    var obj = responses.error(messageText,errorList);
    log.out('err',messageText + ' ' + errorList);
    response.jsonp(500, obj);
}