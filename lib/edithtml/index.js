var responses = require('../response')
var validation = require('./validate')
var security = require('../security')
var dbConfig = require('../../config/database')
var log = require('../log')

var app = module.exports = express();

app.post('/api/savehtml', function (req, res) {
    security.validateRequest(req, res, updateHtml);
});


function updateHtml(request, userid) {
  var pool = dbConfig;

  var html = request.body.html
  var timestamp = new Date().getTime();

  pool.getConnection(function(err, connection) {
    connection.query("INSERT into html (userid, html, timestamp) VALUES (?,?,?) ON DUPLICATE KEY UPDATE user=?",[userid, html, timestamp, useid], function(err, result) {
      if(err) {
         log.error("Error saving html "+err);
         connection.release();
         errorHandling('Error retrieving session info','',response);
      } else {
          connection.release();
          response.jsonp(200, '');
      }
    });
 });
}


function errorHandling(messageText, errorList, response) {
    var obj = responses.error(messageText,errorList);
    log.error(messageText + ' ' + errorList)
    response.jsonp(500, obj);
}