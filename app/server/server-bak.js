const express = require('express');
const compression = require('compression');
const path = require('path');
const bodyParser = require('body-parser');
const api = require('./api');
const axios = require('axios');

const app = express();

// gzip everything
app.use(compression());

// handle body parsing
app.use(bodyParser.json());

// serve static files
app.use('/', express.static(path.join(__dirname, '..', 'client', 'assets')));

// import api routes
app.use('/api', api);

app.post('/contacthandler', (req, res) => {
  console.log(req.body.data);
  axios({
    method: 'post',
    url: 'https://aliem-slackbot.herokuapp.com/aliemcards/messages/contact-form',
    data: req.body,
    headers: { ALIEM_API_KEY: process.env.ALIEM_API_KEY },
  })
  .then((resp) => {
    console.log(resp);
    res.send({ status: 'success', data: 'sent' });
  })
  .catch((error) => {
    console.log(error);
    res.send({ status: 'error', data: 'not sent' });
  });
});

app.get('*', (req, res) => {
  res.set('X-UA-Compatible', 'IE=edge');
  res.sendFile(path.join(__dirname, '..', 'client', 'assets', 'index.html'));
});

const serverPort = process.env.OPENSHIFT_NODEJS_PORT || 3000;
const serverIpAddress = process.env.OPENSHIFT_NODEJS_IP || 'localhost';

app.listen(serverPort, serverIpAddress, () => {
  console.log(`Server listening on port ${serverPort}!`);
});
