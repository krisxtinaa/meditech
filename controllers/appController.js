require('dotenv').config();
const bcrypt = require("bcryptjs");

const axios = require('axios');
const urls = require('url');

const User = require("../models/User");
const config = require("config");
const authURI = config.get("authURI");
const tokenURI = config.get("tokenURI");
const patientURI = config.get("patientURI");
const _encode = require("../middleware/_encode");
const contentType = config.get("Content-Type");
const accept = config.get("Accept");

const fetch = require("node-fetch")

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
  var code = req.query.code;

  let data = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: process.env.GRANT_TYPE,
    code: code,
    redirect_uri: process.env.REDIRECT_URI,
    scope: process.env.SCOPE,
  };

  params = _encode(data);

  var response = await fetch(tokenURI, {
      method: "POST",
      headers: { "Content-Type": contentType, "Accept": accept },
      body: params,
  });
  
  var json = await response.json();

  req.session.access_token = json.access_token;
  req.session.refresh_token = json.refresh_token;
  req.session.patient = json.patient;
  req.session.isAuth = true;

  let patient = json.patient;

  let user = await User.findOne({ patient });
  let hasdAccessToken = await bcrypt.hash(json.access_token, 12);
  let hasdRefreshToken = await bcrypt.hash(json.refresh_token, 12);

      if (user) {
        user = User.updateMany({
          //patient,
           $set: { "access_token" : hasdAccessToken } ,
           $set: { "refresh_token" : hasdRefreshToken } ,
        });
        return res.redirect("dashboard");
      }
    
      user = new User({
        patient,
        access_token: hasdAccessToken,
        refresh_token: hasdRefreshToken
      });
    
      await user.save();

  res.redirect("dashboard");
};


// ------ dashboard ------- //
exports.dashboard_get = async (req, res) => {

    if (!req.session.patient) return res.redirect("./");

    var response = await fetch(patientURI, {
      method: "GET",
      headers: { "Authorization": req.session.access_token }
    });
  
    var json = await response.json();

    req.session.gender = json.gender;
    req.session.birthDate = json.birthDate;

    res.render("dashboard", {
      patient: req.session.patient,
      gender: req.session.gender,
    });

};


// ------ logout ------- //
exports.logout_post = (req, res) => {
    req.session.destroy((err) => {
      if (err) throw err;
      res.redirect("/");
    });
};