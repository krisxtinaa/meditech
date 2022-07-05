require('dotenv').config();
const config = require("config");
const _encode = require("../middleware/_encode");
const fetch = require("node-fetch");

const contentType = config.get("Content-Type");
const accept = config.get("Accept");

const Order = require("../models/Order");

const medicationOrderURI = config.get("medicationOrderURI");
const orderURI = config.get("orderURI");


// ------ medication orders ------- //
exports.orders_get = async (req, res) => {

    if (!req.session.id) return res.redirect("./");
    req.session.isAuth = true;
  
    let patientID = req.session.patient;  
  
      const response = await fetch(`${medicationOrderURI}${patientID}`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${req.session.access_token}`}
      });
  
      let json = await response.json();
      res.render('orders', { 
        orders : json.entry
      });
  };
  
  // ------ medication ------- //
  exports.order_get = async (req, res) => {
  
    let orderID = req.params.id
  
    req.session.isAuth = true;
  
    const response = await fetch(`${orderURI}${orderID}`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${req.session.access_token}`}
    });
  
    let order = await response.json();

    let patient = order.patient.display;
    let medification_ref = order.medicationReference.reference;
    let status = order.status;
    let contains = order.contained[0].code.text;
    let product =  order.contained[0].product[0].form.text;
    let system = order.contained[0].code.coding[0].system;
    let date = order.dateWritten;


        save_order = new Order({
            patient: patient,
            medificationRef: medification_ref,
            status: status,
            system: system,
            contains: contains,
            date: date,
            product: product
          });
      

          await save_order.save();

    res.render('orderSingle', { 
      order : order
    });
  };
  