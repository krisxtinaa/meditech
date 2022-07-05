require('dotenv').config();
const config = require("config");
const fetch = require("node-fetch");

const Immunization = require("../models/Immunization");


const immunizationsURI = config.get("immunizationsURI");
const immunizationURI = config.get("immunizationURI");

// ------ immunizations ------- //
exports.immunizations_get = async (req, res) => {

    if (!req.session.id) return res.redirect("./");
  
    let patientID = req.session.patient;  
    req.session.isAuth = true;
  
      const myImmunizations = await fetch(`${immunizationsURI}${patientID}`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${req.session.access_token}`}
      });
  
      let response = await myImmunizations.json();

      res.render('immunizations', { 
        immunizations : response.entry
      });
  };
  
  // ------ immunization ------- //
exports.immunization_get = async (req, res) => {
    
    let immunizationID = req.params.id
  
    req.session.isAuth = true;
  
    const response = await fetch(`${immunizationURI}${immunizationID}`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${req.session.access_token}`}
    });
  
    let immunization = await response.json();

    let patient = immunization.patient.display;
    let immunization_id = immunization.id;
    let immunization_name = immunization.vaccineCode.coding[0].display;
    let status = immunization.status;
    let immunization_code = immunization.vaccineCode.coding[0].code;
    let system =  immunization.vaccineCode.coding[0].system;
    let date = immunization.date;
    let notGiven = immunization.wasNotGiven;

   

        save_immunization = new Immunization({
            patient: patient,
            immunizationID: immunization_id,
            immunizationName: immunization_name,
            status: status,
            code: immunization_code,
            system: system,
            date: date,
            notGiven: notGiven
          });
      



    res.render('immunizationSingle', { 
        immunization : immunization
      });


};  