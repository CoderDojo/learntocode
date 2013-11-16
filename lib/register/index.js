var express = require('express');
var responses = require('../response')
var validation = require('./validate')
var security = require('../security')
var dbConfig = require('../../config/database')
var log = require('../log')

var app = module.exports = express();

app.post('/api/register', function (req, res) {
    var user = {}
    user.email = req.body.email;
    user.password = security.hash(req.body.password);
    user.coderdojo = req.body.coderdojo;
    user.city = req.body.city;
    user.name = req.body.name;

    validateUser(user,res)
});

function validateUser(user,response) {
    log.out('debug',validation)
    validation.validate(user, response, success, errorHandling);
}

function success(user, response) {
    createUser(user, response);
}

function createUser(user, response) {
  var pool = dbConfig;
  user.session_hash = security.hashSessionKey(user.email)
  pool.getConnection(function(err, connection) {
    connection.query('INSERT INTO users SET ?',user , function(err, result) {
      if (err) {
        log.out('err',err); 
        connection.release()
        res.jsonp(500, err)
      } else {
        log.out('debug',"Create user result "+result)
        response.jsonp(200, user)
      }
    });
 });

}

function errorHandling(messageText, errorList, response) {
    var obj = responses.error(messageText,errorList);
    response.jsonp(500, obj);
}