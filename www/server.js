var express = require('express');
var app = express();
var router = express.Router();
var compression = require('compression');
var api = require('./routes/api');

// gzip everything
app.use(compression());

// serve static files
app.use('/', express.static(__dirname + '/public'));

// import api routes
app.use('/api', api);

// all other routes get served this
app.get('*', function (req, res) {
  // res.sendFile(path.join(__dirname, 'public', 'index.html'))
  res.send("'ello guvnah.");
})

// run it
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
