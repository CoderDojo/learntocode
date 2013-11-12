var log = require('../log')
var dbConfig = require('../../config/database')

module.exports = {
	
	hash: function(value) {  
	    var crypto = require('crypto');
	    var hash = crypto.createHash('md5').update(value).digest("hex");
	    log.debug("returned-hash " + hash);
	    return hash;
	},
	hashSessionKey: function(emailAddr) {
	    var curTime = new Date().getTime();
	    var random = Math.random();
	    return this.hash(curTime + random + emailAddr);
	},

	validateRequest: function(request, response, successCallback) {
		
		if(session_hash && email) {
			verifyUser(request, response,successCallback)
		} else {
			log.error("No session information passed in " + request);
			securityFailed(response)
		}
	}
}


function verifyUser(request, response, successCallback) {

  log.debug('Verifying the user');
  
  var session_hash = req.body.session_hash;
  var email = req.body.email;
			
  var pool = dbConfig;
  pool.getConnection(function(err, connection) {
    connection.query("SELECT users.id FROM users WHERE email=? and session_hash=?",[email, session_hash], function(err, result) {
      if(err) {
         log.error("Error verifying user "+err);
         connection.release();
         securityFailed(response);
      } else {
          log.info('result.length ' + authenticate.email + ' ' + result.length);
          if(result.length > 0) {            
            var user = result;
            connection.release();
            successCallback(request, user.id);
          } else {
            connection.release();
			securityFailed(response);	          }
      }
    });
 });
}

function securityFailed(response) {
    var obj = responses.error("You are not authorized to complete this action");
    response.jsonp(401, obj);
}