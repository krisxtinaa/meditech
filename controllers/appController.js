require('dotenv').config();
const bcrypt = require("bcryptjs");
const Session = require("../models/Session");
const cookieParser = require("cookie-parser");
//const cryptoJS = require("crypto-js");
const config = require("config");
const _encode = require("../middleware/_encode");
const fetch = require("node-fetch");

const contentType = config.get("Content-Type");
const accept = config.get("Accept");

const meditechUser = require("../models/User");

const authURI = config.get("authURI");
const tokenURI = config.get("tokenURI");
const patientURI = config.get("patientURI");

// ------ index ------- //
exports.index_page = async (req, res) => {
    res.render("index");
};

// ------ auth ------- //
exports.auth =  async (req, res) => {
    const error = req.session.error;
    delete req.session.error;
    res.redirect(authURI);
};

// ------ redirect ------- //
exports.redirect_url = async (req, res) => {
  if (!req.query.code) throw new Error("NoCodeProvided");
  let code = req.query.code;

  let data = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: process.env.GRANT_TYPE,
    code: code,
    redirect_uri: process.env.REDIRECT_URI,
    scope: process.env.SCOPE,
  };

  params = _encode(data);

  let response = await fetch(tokenURI, {
      method: "POST",
      headers: { "Content-Type": contentType, "Accept": accept },
      body: params,
  });
  
  let json = await response.json();

  req.session.access_token = json.access_token;
  req.session.refresh_token = json.refresh_token;
  req.session.patient = json.patient;
  req.session.isAuth = true;

  let patient = json.patient;

  let session = await Session.findOne({ patient });
  let hasdAccessToken = await bcrypt.hash(json.access_token, 12);
  let hasdRefreshToken = await bcrypt.hash(json.refresh_token, 12);

      if (session) {
        session = Session.findOneAndUpdate(({
          //patient,
           $set: { "access_token" :  hasdAccessToken} ,
           $set: { "refresh_token" : hasdRefreshToken } ,
        }));
        return res.redirect("dashboard");
      }
    
      session = new Session({
        patient,
        access_token: hasdAccessToken,
        refresh_token: hasdRefreshToken
      });
    
      await session.save();

  res.redirect("dashboard");
}; 


// ------ logout ------- //
exports.logout_post = (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("/");
  });
};