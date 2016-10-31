var express = require('express');
var app = express();
var router = express.Router();
var compression = require('compression');
var path = require('path');
var api = require('./routes/api');
//var dbapi = require('./routes/dbapi');

// gzip everything
app.use(compression());

// serve static files
app.use('/', express.static(__dirname + '/assets'));

// import api routes
app.use('/api', api);
//app.use('/dbapi', dbapi);

// all other routes get served this
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'react-app', 'index.html'));
})

// run it
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
