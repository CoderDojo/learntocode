var security = require('../security')
var express = require('express');
var dbConfig = require('../../config/database')
var log = require('../log')
var error = require('../error')

var app = module.exports = express();

app.post('/api/savehtml', function (req, res) {
    log.out('debug','saving html user:'+req.body.email + ' html:' + req.body.html)
    security.validateRequest(req, res, validate);
});


function validate(request, response, userid) {
  var html = request.body.html;
  if(html.indexOf("<html>") > -1 || html.indexOf("<head>") > -1 
    || html.indexOf("<body>") > -1 || html.indexOf("<script>") > -1) {
      error.send('You cannot add html, head, body, or script tag','',response);
  } else {
    checkInsertUpdate(request, response, userid);
  }
}

function checkInsertUpdate(request, response, userid) {
      var pool = dbConfig

      pool.getConnection(function(err, connection) {
        connection.query("SELECT count(*) as count FROM html WHERE userid=?",[userid], function(err, result) {
        if(err) {
           log.out('err',"Error retrieving user "+err);
           connection.release();
           error.send('Error retrieving session info','',response);
        } else {
            log.out('info','result.count '+result[0].count);
            if(result[0].count == 0) {   
              log.out('info','Inserting the html record for '+request.body.email);         
              connection.release()
              insertHtml(request, response, userid)
            } else {
              log.out('info','Updating the html record for '+request.body.email);   
              connection.release();
              updateHtml(request, response, userid)
            }
        }
    });
 });
}


function insertHtml(request, response, userid) {
  log.out('debug','Updating html for ' + userid);
  var pool = dbConfig

  var html = request.body.html
  var html_uuid = "a"+security.hash(new Date().getTime(), userid)
  log.out('debug', 'Html uuid for ' + request.body.email + ' uuid:' +html_uuid)

  pool.getConnection(function(err, connection) {
    log.out('debug', 'insert html is set to ' + html + ' for user ' + userid)
    connection.query("INSERT into html (userid, html, html_uuid) VALUES (?,?,?)",[userid, html, html_uuid], function(err, result) {
      if(err) {
         log.out('err',"Error saving html "+err);
         connection.release();
         error.send('Error retrieving session info','',response);
      } else {
          connection.release();
          response.jsonp(200, 'Successfully saved html code');
      }
    });
 });
}

function updateHtml(request, response, userid) {
  log.out('debug','Updating html for ' + userid);
  var pool = dbConfig;

  var html = request.body.html

  pool.getConnection(function(err, connection) {
    log.out('debug', 'html is set to ' + html + ' for user ' + userid)
    connection.query("update html set html=? where userid=?;",[html, userid], function(err, result) {
      if(err) {
         log.out('err',"Error saving html "+err);
         connection.release();
         error.send('Error retrieving session info','',response);
      } else {
          connection.release();
          response.jsonp(200, 'Successfully saved html code');
      }
    });
 });
}