var express = require('express');
var responses = require('../response')
var dbConfig = require('../../config/database')
var log = require('../log')

var app = module.exports = express();

app.post('/api/authenticate', function (req, res) {
    log.debug('authenticating ...');
    var authenticate = {}
    authenticate.email = req.body.email;
    authenticate.session_hash = req.body.session_hash;
    authenticateUser(authenticate,res)
});

function authenticateUser(authenticate, response) {
  var pool = dbConfig;

  pool.getConnection(function(err, connection) {
    connection.query("SELECT * FROM users WHERE email=? and session_hash=?",[authenticate.email, authenticate.session_hash], function(err, result) {
      if(err) {
         log.err("Error retrieving user "+err);
         if(connection)
           connection.release();
         errorHandling('Error retrieving session info','',response);
      } else {
          var user = result;
          connection.release();
          response.jsonp(200, user);
      }
    });
 });
}


function errorHandling(messageText, errorList, response) {
    var obj = responses.error(messageText,errorList);
    log.err(messageText + ' ' + errorList)
    response.jsonp(500, obj);
}