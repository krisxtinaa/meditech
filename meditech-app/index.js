require('dotenv').config();
const axios = require('axios');
const express = require('express');
const path = require('path');

const app = express();

app.use(express.static('static'));

app.get('/meditech-app/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/meditech-app/auth', (req, res) => {
  res.redirect(
    `https://greenfield-apis.meditech.com/oauth/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&state=125624&patient/*.readlaunch/patient&redirect_uri=https://api.tell.health/oauth/redirect-url`,
  );
});

app.get('/meditech-app/oauth-callback', ({ query: { code } }, res) => {
  const body = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.GLIENT_SECRET,
    code,
  };
  const opts = { headers: { accept: 'application/json' } };
  axios
    .post('https://greenfield-apis.meditech.com/oauth/token', body, opts)
    .then((_res) => _res.data.access_token)
    .then((token) => {
      // eslint-disable-next-line no-console
      console.log('My token:', token);

      res.redirect(`/?token=${token}`);
    })
    .catch((err) => res.status(500).json({ err: err.message }));
});

app.listen(3000);
// eslint-disable-next-line no-console
console.log('App listening on port 3000');