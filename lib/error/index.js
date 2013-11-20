var responseObj = require('../response')
var log = require('../log')

var send = {
	send: function(messageText, errorList, response) {
    	var obj = responseObj.error(messageText,errorList);
    	log.out('err',messageText + ' ' + errorList)
    	response.jsonp(500, obj);
	}
}

module.exports = send