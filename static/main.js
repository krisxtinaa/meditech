const { response } = require("express");

const URL_PARAMS = new URLSearchParams(window.location.search);
const TOKEN = URL_PARAMS.get('token');
//const PATIENT = URL_PARAMS.get('patient');

// Show an element
const show = (selector) => {
  document.querySelector(selector).style.display = 'block';
};

// Hide an element
const hide = (selector) => {
  document.querySelector(selector).style.display = 'none';
};


if (TOKEN) {
  hide('.content.unauthorized');
  show('.content.authorized');
}

const myHeaders = new Headers({
  'Content-Type': 'application/fhir+json',
  'Authorization': `Bearer ${TOKEN}`,
});

const patient_info = document.querySelector('#patient_info')
fetch (`https://greenfield-apis.meditech.com/v1/argonaut/v1/Immunization/39978591-3362-424b-d6a6-7dd01d9ba78c`, {
  method: 'GET',
  headers: myHeaders,
})
  .then(response => {return response.json()})
  //.then(data => console.log(data))
  .then(data => {return data.json()})
  
  .then (data => { 
    data.forEach(immunization => {
      const id = `<h4>`+ immunization.id `<h4>`
      patient_info.insertAdjacentHTML("beforeend", id)
    })

  })
 
  .catch(err => console.log(err))