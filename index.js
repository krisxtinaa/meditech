require('dotenv').config();
const axios = require('axios');
const express = require('express');
const path = require('path');
const url = require('url');
const cors = require('cors');

const app = express();

let accessToken = '';
let refreshToken = '';

app.use(express.static('static'));
app.use(cors());

app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, '/static/index.html'));
});


app.get('/auth', async (req, res) => {
  res.redirect(
    'https://greenfield-apis.meditech.com/oauth/authorize?response_type=code&client_id=TellHealth%40afb279147cf24726a1340157e1d8fb82&state=125624&scope=patient%2F*.read%20launch%2Fpatient&redirect_uri=https%3A%2F%2Ftell-health3000.loca.lt%2Fredirect-url'
    //`https://greenfield-apis.meditech.com/oauth/authorize?response_type=${process.env.response_type}&client_id=${process.env.client_id}&state=${process.env.state}&scope=${process.env.scope}&redirect_uri=${process.env.redirect_uri}`
    );
});

app.get('/redirect-url', async (req, res) => {
  const {code} = req.query;

  if(code) {
    try {
      const formData = new url.URLSearchParams({
        grant_type: process.env.grant_type,
        code: code.toString(),
        redirect_uri: process.env.redirect_uri,
        client_id: process.env.client_id, 
        client_secret: process.env.client_secret 
      });
      const response = await axios.post(
        'https://greenfield-apis.meditech.com/oauth/token',
        formData.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/fhir+json'
          },
        }
      )
      //.then((_res) => _res.data.access_token)
      // .then((token) => {
      //   console.log('My token:', token);
      //   token = token;
      //   res.redirect(`/?token=${token}`)});

      const {access_token, refresh_token} = response.data;
      accessToken = access_token;
      refreshToken = refresh_token;
      res.send(response.data);
    } catch(err) {
      console.log(err) 
      res.sendStatus(400);
    }
  }
});


app.get('/user', async (req, res) => {
  try { 
    const response = await axios.get('https://greenfield-apis.meditech.com/v1/argonaut/v1/Patient/925293E8-3491-4E2B-9FE1-46310EE776C2', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/fhir+json'
      },
    });
    res.send(response.data)
  }catch(err) {
    res.sendStatus(400);
  }
});

app.get('/all_immunizations', async (req, res) => {
  try { 
    const response = await axios.get('https://greenfield-apis.meditech.com/v1/argonaut/v1/Immunization?patient=925293E8-3491-4E2B-9FE1-46310EE776C2', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/fhir+json'
      },
    });
    res.send(response.data)
  }catch(err) {
    res.sendStatus(400);
  }
});

app.get('/immunization', async (req, res) => {
  try { 
    const response = await axios.get('https://greenfield-apis.meditech.com/v1/argonaut/v1/Immunization/39978591-3362-424b-d6a6-7dd01d9ba78c', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/fhir+json'
      },
    });
    res.send(response.data)
  }catch(err) {
    res.sendStatus(400);
  }
});



// app.get('/redirect-url', async ({ query: { code } }, res) => {
//   const body = { 
//     grant_type: process.env.grant_type,
//     code,
//     redirect_uri: process.env.redirect_uri,
//     client_id: process.env.client_id, 
//     client_secret: process.env.client_secret 
//   };
//   const opts = { headers: { accept: 'application/json' } };
//   axios
//     .post('https://greenfield-apis.meditech.com/oauth/token', body, opts)
//     .then((_res) => _res.data.access_token)
//     .then((token) => {
//       console.log('My token:', token);
//       token = token;
//       res.redirect(`/?token=${token}`);
//     })
//     .catch((err) => res.status(500).json({ err: err.message }));
// });

app.listen(8000);
console.log('App listening on port 8000');