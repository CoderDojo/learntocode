var logentries = require('node-logentries');

var log = logentries.logger({
  token: process.env['LOGENTRIES_TOKEN']
});

module.exports = log