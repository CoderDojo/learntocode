var responses = require('../response')
var validation = require('./validate')
var security = require('../security')
var express = require('express');
var dbConfig = require('../../config/database')
var log = require('../log')

var app = module.exports = express();

app.post('/api/savehtml', function (req, res) {
    security.validateRequest(req, res, updateHtml);
});


function updateHtml(request, response, userid) {
  log.out('debug','Updating html for ' + userid);
  var pool = dbConfig;

  var html = request.body.html
  var timestamp = new Date().getTime();

  pool.getConnection(function(err, connection) {
    log.out('debug', userid)
    connection.query("INSERT into html (userid, html) VALUES (?,?) ON DUPLICATE KEY UPDATE userid=?",[userid, html, userid], function(err, result) {
      if(err) {
         log.out('err',"Error saving html "+err);
         connection.release();
         errorHandling('Error retrieving session info','',response);
      } else {
          connection.release();
          response.jsonp(200, 'Saved html code');
      }
    });
 });
}

function errorHandling(messageText, errorList, response) {
    var obj = responses.error(messageText,errorList);
    log.out('err',messageText + ' ' + errorList)
    response.jsonp(500, obj);
}