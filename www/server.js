const express = require('express');
const app = express();
const compression = require('compression');
const path = require('path');
const bodyParser = require('body-parser');
const api = require('./routes/api');


// gzip everything
app.use(compression());

// handle body parsing
app.use(bodyParser.json());

// serve static files
app.use('/', express.static(path.join(__dirname, 'assets')));

// import api routes
app.use('/api', api);

app.post('/contacthandler', (req, res) => {
  console.log(req.body);
  res.send({ status: 'success', data: 'some' });
});

// all other routes get served this
app.get('*', (req, res) => {
  res.set('X-UA-Compatible', 'IE=edge');
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// run it
// use OpenShift environmental variables, or set development defaults
const serverPort = process.env.OPENSHIFT_NODEJS_PORT || 3000;
const serverIpAddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.listen(serverPort, serverIpAddress, () => {
  console.log('Example app listening on port 3000!');
});
