require('dotenv').config();
const config = require("config");
const _encode = require("../middleware/_encode");
const fetch = require("node-fetch");

const contentType = config.get("Content-Type");
const accept = config.get("Accept");

const Condition = require("../models/Condition");

const conditionsURI = config.get("conditionsURI");
const conditionURI = config.get("conditionURI");

// ------ conditions ------- //
exports.conditions_get = async (req, res) => {

    if (!req.session.id) return res.redirect("./");
  
    let patientID = req.session.patient;  
    req.session.isAuth = true;
  
      const response = await fetch(`${conditionsURI}${patientID}`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${req.session.access_token}`}
      });
  
      let json = await response.json();
      res.render('conditions', { 
        conditions : json.entry
      });
  };
  
  // ------ condition ------- //
  exports.condition_get = async (req, res) => {
  
    let conditionID = req.params.id
  
    req.session.isAuth = true;
  
    const response = await fetch(`${conditionURI}${conditionID}`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${req.session.access_token}`}
    });

    let condition = await response.json();

    let patient = condition.patient.display;
    let condition_id = condition.id;
    let condition_name = condition.code.coding[0].display;
    let status = condition.clinicalStatus;
    let date = condition.dateRecorded;
    let category_name = condition.category.coding[0].display;
    let system = condition.code.coding[0].system;
    let code = condition.code.coding[0].code;


      save_condition = new Condition({
          patient: patient,
          conditionID: condition_id,
          conditionName: condition_name,
          status: status,
          date: date,
          category: category_name,
          system: system,
          code: code
        });
      
        await save_condition.save();


    res.render('conditionSingle', { 
      condition : condition
    });
  };