var security = require('../security')
var express = require('express');
var dbConfig = require('../../config/database')
var log = require('../log')
var cssparser = require("cssparser")
var error = require('../error')

// create new instance of Parser
var parser = new cssparser.Parser();

var app = module.exports = express();

app.post('/api/savecss', function (req, res) {
    log.out('debug','saving css user:'+req.body.email + ' css:' + req.body.css)
    security.validateRequest(req, res, checkInsertUpdate);
});

function checkInsertUpdate(request, response, userid) {
      var pool = dbConfig

      pool.getConnection(function(err, connection) {
        connection.query("SELECT count(*) as count FROM css WHERE userid=?",[userid], function(err, result) {
        if(err) {
           log.out('err',"Error retrieving user "+err);
           connection.release();
           error.send('Error retrieving session info','',response);
        } else {
            log.out('info','result.count '+result[0].count);
            if(result[0].count == 0) {   
              log.out('info','Inserting the css record for '+request.body.email);         
              connection.release()
              insertCss(request, response, userid)
            } else {
              log.out('info','Updating the css record for '+request.body.email);   
              connection.release();
              updateCss(request, response, userid)
            }
        }
    });
 });
}


function insertCss(request, response, userid) {
  log.out('debug','############## Updating css for userid:' + userid);
  var pool = dbConfig
  var css = request.body.css
  var json = jsonCss(request.body.css)
  json = json.replace(/(\n|\r|\r\n)$/, '')
  
  log.out('debug','parsed css for user '+request.body.email + ' css:'+css);

  pool.getConnection(function(err, connection) {
    log.out('debug', 'insert css is set to ' + css + ' for user ' + userid)
    connection.query("INSERT into css (userid, css, json) VALUES (?,?,?)",[userid, css, json], function(err, result) {
      if(err) {
         log.out('err',"Error saving css "+err);
         connection.release();
         error.send('Error retrieving session info','',response);
      } else {
          connection.release();
          response.jsonp(200, 'Successfully saved css code');
      }
    });
 });
}

function updateCss(request, response, userid) {
  log.out('debug','Updating css for ' + userid);
  var pool = dbConfig;
  var css = request.body.css;
  var json = jsonCss(request.body.css)
  json = json.replace(/(\n|\r|\r\n)$/, '')

  pool.getConnection(function(err, connection) {
    log.out('debug', 'css is set to ' + css + ' for user ' + userid)
    connection.query("update css set css=?, json=? where userid=?;",[css, json, userid], function(err, result) {
      if(err) {
         log.out('err',"Error saving css "+err);
         connection.release();
         error.send('Error retrieving session info','',response);
      } else {
          connection.release();
          response.jsonp(200, 'Successfully saved css code');
      }
    });
 });
}

function jsonCss(css) {

  // create new instance of Parser
  var parser = new cssparser.Parser();

  // parse & getting json
  css = parser.parse( css );
  console.log(JSON.stringify(css, null, 2));
  return JSON.stringify(css, null, 5);
}