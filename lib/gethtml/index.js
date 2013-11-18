var responses = require('../response')
var security = require('../security')
var express = require('express');
var dbConfig = require('../../config/database')
var log = require('../log')

var app = module.exports = express();

app.post('/api/gethtml', function (req, res) {
      retrieveHtml(req, res);
});

function retrieveUserHtml(request, response) {
      var pool = dbConfig

      pool.getConnection(function(err, connection) {
        connection.query("SELECT user.name, user.coderdojo, user.city, html.html_uuid, html.html, css.json FROM html html, css css, users user WHERE user.id=css.userid and user.id=html.userid", function(err, result) {
        if(err) {
           log.out('err',"Error retrieving user html "+err);
           connection.release();
           errorHandling('Error retrieving session info','',response);
        } else {
            log.out('info','Result for html '+result);
            if(result[0]) {   
              log.out('info','Retrieving the html'+result);         
              connection.release()
              response.jsonp(200, responses.success(result));
            } else {
              log.out('info','No html records found');   
              connection.release();
              response.jsonp(416, 'No html record available');
            }
        }
    });
 });
}

function errorHandling(messageText, errorList, response) {
    var obj = responses.error(messageText,errorList);
    log.out('err',messageText + ' ' + errorList)
    response.jsonp(500, obj);
}