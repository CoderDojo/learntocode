
if(process.env['APPDYNAMICS_KEY']) {
  var nodetime = require('nodetime').profile({
      accountKey: process.env['APPDYNAMICS_KEY'], 
      appName: 'learntocode.eu',
      features: {
        transactionProfiler: true,
        hostMetrics: true,
      },
      namedTransactions: {
        'api transactions': '/api'
      }
  });
}

var express = require('express')
var http = require('http')
var path = require('path')

var app = express()

app.use(express.bodyParser());
app.set('views', __dirname + '/public');
app.set('view engine', 'html');
app.set('port', process.env['APP_PORT']);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.methodOverride());
app.use(app.router);
app.use(express.errorHandler()); 
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./lib/register'))
app.use(require('./lib/authenticate'))
app.use(require('./lib/authenticate/login'))
app.use(require('./lib/edithtml'))
app.use(require('./lib/editcss'))
app.use(require('./lib/getuserhtml'))
app.use(require('./lib/getusercss'))
app.use(require('./lib/gethtml'))
app.use(require('./lib/publish'))
app.use(require('./lib/lostpassword'))
//app.use(require('./lib/userpreview'))

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    app.use(nodetime.expressErrorHandler());
    res.writeHead(200);
    res.end(data);
  });
}



var server = app.listen(app.get('port'), function(){
  console.log("learntocode.eu server listening on port " + app.get('port'));
});
