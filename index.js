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
    'https://greenfield-apis.meditech.com/oauth/authorize?client_id=TellHealth@afb279147cf24726a1340157e1d8fb82',
  );
});

app.get('/oauth-callback', ({ query: { code } }, res) => {
  const body = {
    client_id: 'TellHealth@afb279147cf24726a1340157e1d8fb82',
    client_secret: '5a1H0gJGTgSKux3LWqxc3g==',
    code,
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
// eslint-disable-next-line no-console
console.log('App listening on port 3000');
