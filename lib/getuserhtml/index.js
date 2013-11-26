var responses = require('../response')
var security = require('../security')
var express = require('express');
var dbConfig = require('../../config/database')
var log = require('../log')
var error = require('../error')

var app = module.exports = express();

app.post('/api/getuserhtml', function (req, res) {
    log.out('debug','Getting html for user:'+req.body.email)
    security.validateRequest(req, res, retrieveUserHtml);
});

function retrieveUserHtml(request, response, userid) {
      var pool = dbConfig

      pool.getConnection(function(err, connection) {
        connection.query("SELECT html, html_uuid, publish FROM html, users WHERE userid=? and userid=users.id",[userid], function(err, result) {
        if(err) {
           log.out('err',"Error retrieving user html "+err);
           connection.release();
           error.send('Error retrieving session info','',response);
        } else if(result[0]) {   
          log.out('info','Retrieving the html record'+result[0].html);         
          connection.release()
          var returnObj = {};
          returnObj.html = result[0].html;
          returnObj.html_uuid = result[0].html_uuid;
          returnObj.publish = result[0].publish;
          response.jsonp(200, responses.success(returnObj));
        } else {
          log.out('info','No html record'+request.body.email);   
          connection.release();
          response.jsonp(416, 'No html record available');
        }
    });
 });
}
