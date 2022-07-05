require('dotenv').config();
const bcrypt = require("bcryptjs");
const Session = require("../models/Session");
const cookieParser = require("cookie-parser");
const config = require("config");
const _encode = require("../middleware/_encode");
const fetch = require("node-fetch");

const contentType = config.get("Content-Type");
const accept = config.get("Accept");

const User = require("../models/User");

const patientURI = config.get("patientURI");


// ------ dashboard ------- //
exports.dashboard_get = async (req, res) => {

    if (!req.session.id) return res.redirect("./");
  
    let patientID = req.session.patient;
    req.session.isAuth = true;
  
    let response = await fetch(`${patientURI}${patientID}`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${req.session.access_token}`}
    });
  
    //
    let patient = await response.json();

    let userID = patient.id;
    let given_name = patient.name[0].given;
    let family_name = patient.name[0].family;
    let telephone = patient.telecom[0].value;
    let birthDate = patient.birthDate;
    let gender = patient.gender;
    let street = patient.address[1].line;
    let city = patient.address[1].city;
    let state = patient.address[1].state;
    let postalCode = patient.address[1].postalCode;
    let country = patient.address[1].country;
    let language = patient.communication[0].language.coding[0].display;



      save_user = new User({
          patient: userID,
          familyNmae: family_name,
          givenName: given_name,
          gender: gender,
          dob: birthDate,
          street: street,
          city:city, 
          state: state,
          postalCode: postalCode,
          country: country, 
          phone: telephone,
          language: language
        });

        await save_user.save();
      
  
    res.render("dashboard", {
      patient : patient
    });
  
  };
  