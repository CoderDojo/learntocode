var dbConfig = require('../../config/database')
var log = require('../log')

var messages = new Array();

function mandatoryRule(user, response) {
	console.log(user)
    mandatory("Name", user.name)
    mandatory("Email", user.email)
    mandatory("Password", user.password)
    mandatory("City", user.city)
    mandatory("CoderDojo", user.coderdojo)
}

function mandatory(name, value) {
	if(!value) {
		messages[messages.length] = name + " must be populated"
	}
}

function uniqueFields(user, response, callbackSuccess, callbackFailure) {
  var pool = dbConfig;

  pool.getConnection(function(err, connection) {
    connection.query("SELECT * FROM users WHERE email=?",user.email , function(err, result) {
      log.debug("Validate fields result "+result)
      if(err)
     	  log.error("Error checking uniqueFields "+err);
      
      if(result && result != "") {
      	log.debug("Email address found" +  result);
      	messages[messages.length] =  "Email address is already registered"
      }
      
      connection.release();
      handleResponse(user,response, callbackSuccess, callbackFailure);
   
    });
 });
}

function handleResponse(user, response, callbackSuccess, callbackFailure) {
	if(messages.length > 0) {
    	callbackFailure('Error registering user', messages, response);
      }
      else {
	    callbackSuccess(user, response)
      }
}

var validate = {
	validate: function(user, response, callbackSuccess, callbackFailure) {
		messages = new Array();
		log.debug("Validating " + messages);
		mandatoryRule(user)
		uniqueFields(user,response,callbackSuccess,callbackFailure)
	}
}

module.exports = validate