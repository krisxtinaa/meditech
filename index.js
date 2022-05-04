require('dotenv').config();
const axios = require('axios');
const express = require('express');
const path = require('path');

const app = express();

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/static/index.html'));
});

app.get('/auth', (req, res) => {
  res.redirect(
    'https://greenfield-apis.meditech.com/oauth/authorize?response_type=code&client_id=TellHealth%40afb279147cf24726a1340157e1d8fb82&state=125624&scope=patient%2F*.read%20launch%2Fpatient&redirect_uri=https%3A%2F%2Fapi.tell.health%2Foauth%2Fredirect-url'
  );
});

app.get('/oauth-callback', ({ query: { code } }, res) => {
  const body = {
    grant_type: 'authorization_code',
    code,
    redirect_uri: 'https://api.tell.health/oauth/redirect-url',
    client_id:  'TellHealth@afb279147cf24726a1340157e1d8fb82',
    //client_secret: process.env.client_secret
  };
  const opts = { headers: { accept: 'application/json' } };
  axios
    .post('https://greenfield-apis.meditech.com/oauth/token', body, opts)
    .then((_res) => _res.data.access_token)
    .then((token) => {
      console.log('My token:', token);

      res.redirect(`/?token=${token}`);
    })
    .catch((err) => res.status(500).json({ err: err.message }));
});

app.listen(3000);
console.log('App listening on port 3000');