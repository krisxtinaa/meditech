const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    patient: {
        type: String, 
        required: true
    },
    familyName: {
        type: Array
    },
    givenName: {
        type: Array
    },
    gender: {
        type: String
    },
    dob: {
        type: Date
    },
    street: {
        type: Array
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    postalCode: {
        type: String
    },
    country: {
        type: String
    },
    phone: {
        type: String
    },
    language: {
        type: String
    },
});


module.exports = mongoose.model('User', userSchema);