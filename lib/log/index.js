var logentries = require('node-logentries');

var logger = logentries.logger({
  token: process.env['LOGENTRIES_TOKEN']
});

var out = {
	out: function(level, message) {
		console.log( level + ' ' + message );
		logger[level](message)
	}	
}

module.exports = out