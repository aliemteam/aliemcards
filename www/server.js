const express = require('express');
const app = express();
const compression = require('compression');
const path = require('path');
const api = require('./routes/api');

// gzip everything
app.use(compression());

// serve static files
app.use('/', express.static(path.join(__dirname, '/assets')));

// import api routes
app.use('/api', api);


// all other routes get served this
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'react-app', 'index.html'));
});

// run it
const serverPort = process.env.OPENSHIFT_NODEJS_PORT || 3000;
const serverIpAddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.listen(serverPort, serverIpAddress, () => {
  console.log('Example app listening on port 3000!');
});
