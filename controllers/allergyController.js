require('dotenv').config();
const config = require("config");
const _encode = require("../middleware/_encode");
const fetch = require("node-fetch");

const meditechUser = require("../models/User");

const allergiesURI = config.get("allergiesURI");
const allergyURI = config.get("allergyURI");
const Allergy = require("../models/Allergy");

// ------ allergies ------- //
exports.allergies_get = async (req, res) => {

    if (!req.session.id) return res.redirect("/");
    req.session.isAuth = true;
  
    let patientID = req.session.patient;  
  
      const response = await fetch(`${allergiesURI}${patientID}`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${req.session.access_token}`}
      });
  
      let json = await response.json();
    

      res.render('allergies', { 
        allergies : json.entry
      });
  };
  
  // ------ allergy ------- //
  exports.allergy_get = async (req, res) => {
  
    let allergyID = req.params.id
  
    req.session.isAuth = true;
  
    const response = await fetch(`${allergyURI}${allergyID}`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${req.session.access_token}`}
    });
  
    let allergy = await response.json();

    let patient = allergy.patient.display;
    let allergy_id = allergy.id;
    let reaction = allergy.reaction[0].manifestation[0].text;
    let substance_code = allergy.substance.coding[0].code;
    let substance_name = allergy.substance.text;
    let system = allergy.substance.coding[0].system;
    let severity = allergy.reaction.severity; 
    let status = allergy.status;
    let date = allergy.recordedDate;
    let criticality = allergy.criticality;
    let type = allergy.type;


      save_allergy = new Allergy({
          patient: patient,
          allergyID: allergy_id,
          reaction: reaction,
          severity: severity,
          date: date,
          substance: substance_name,
          code:substance_code, 
          status: status,
          criticality:  criticality,
          type: type, 
          system: system
        });
      

    res.render('allergySingle', { 
      allergy : allergy
    });
  };