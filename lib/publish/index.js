var security = require('../security')
var express = require('express');
var dbConfig = require('../../config/database')
var log = require('../log')
var error = require('../error')

var app = module.exports = express();

app.post('/api/publish', function (req, res) {
    log.out('debug','publishing for user:'+req.body.email)
    security.validateRequest(req, res, publish);
});

function publish(request, response, userid) {
  log.out('debug','Updating publish for ' + userid);
  var pool = dbConfig;

  pool.getConnection(function(err, connection) {
    connection.query("UPDATE users set publish = !publish where id=?;",[userid], function(err, result) {
      if(err) {
         log.out('err',"Error saving html "+err + " for userid: " + userid);
         connection.release();
         error.send('Error retrieving session info','',response);
      } else {
          connection.release();
          response.jsonp(200, 'Successfully updated publish / unpublish');
      }
    });
 });
}