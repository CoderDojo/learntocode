var responses = require('../response')
var security = require('../security')
var express = require('express');
var dbConfig = require('../../config/database')
var log = require('../log')
var error = require('../error')
var parse = require('../parse')

var app = module.exports = express();

app.post('/api/getusercss', function (req, res) {
    log.out('debug','Getting css for user:'+req.body.email)
    security.validateRequest(req, res, retrieveUserCss);
});

app.post('/api/getuserjsoncss', function (req, res) {
    log.out('debug','Getting json for user:'+req.body.email)
    security.validateRequest(req, res, retrieveUserJsonCss);
});

function retrieveUserCss(request, response, userid) {
      var pool = dbConfig

      pool.getConnection(function(err, connection) {
        connection.query("SELECT css FROM css WHERE userid=?",[userid], function(err, result) {
        if(err) {
           log.out('err',"Error retrieving user css "+err);
           connection.release();
           error.send('Error retrieving session info','',response);
        } else if(result[0]) {   
          log.out('info','Retrieving the css record'+result[0].css);         
          connection.release()
          response.jsonp(200, responses.success(result[0].css));
        } else {
          log.out('info','No css record available for '+request.body.email);   
          connection.release();
          response.jsonp(416, 'No css record available');
        }
    });
 });
}


function retrieveUserJsonCss(request, response, userid) {
      var pool = dbConfig

      pool.getConnection(function(err, connection) {
        connection.query("SELECT json as css FROM css WHERE userid=?",[userid], function(err, result) {
        if(err) {
           log.out('err',"Error retrieving user json css "+err);
           connection.release();
           error.send('Error retrieving session info','',response);
        } else if(result[0]) {   
          log.out('info','Retrieving the json css record'+result[0].css);   
          result = parse.cssToJson(result);  
          connection.release()
          response.jsonp(200, responses.success(result[0].css));
        } else {
          log.out('info','No css record available for '+request.body.email);   
          connection.release();
          response.jsonp(416, 'No css record available');
        }
    });
 });
}