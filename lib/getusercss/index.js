var responses = require('../response')
var security = require('../security')
var express = require('express');
var dbConfig = require('../../config/database')
var log = require('../log')

var app = module.exports = express();

app.post('/api/getusercss', function (req, res) {
    log.out('debug','Getting css for user:'+req.body.email)
    security.validateRequest(req, res, retrieveUserCss);
});

function retrieveUserCss(request, response, userid) {
      var pool = dbConfig

      pool.getConnection(function(err, connection) {
        connection.query("SELECT css FROM css WHERE userid=?",[userid], function(err, result) {
        if(err) {
           log.out('err',"Error retrieving user css "+err);
           connection.release();
           errorHandling('Error retrieving session info','',response);
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

function errorHandling(messageText, errorList, response) {
    var obj = responses.error(messageText,errorList);
    log.out('err',messageText + ' ' + errorList)
    response.jsonp(500, obj);
}