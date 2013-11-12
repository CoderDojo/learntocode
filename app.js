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
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./lib/register'))
app.use(require('./lib/authenticate'))
app.use(require('./lib/authenticate/login'))

require('nodetime').profile({
    accountKey: process.env['APPDYNAMICS_KEY'], 
    appName: 'learntocode.eu'
});

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);
  });
}

var server = app.listen(app.get('port'), function(){
  console.log("learntocode.eu server listening on port " + app.get('port'));
});
