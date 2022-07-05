const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const immunizationSchema = new Schema({
    patient: {
        type: String, 
        required: true
    },
    immunizationID: {
        type: String,
        required: true
    },
    immunizationName: {
        type: String
    },
    status: {
        type: String
    },
    code: {
        type: String
    },
    system: {
        type: String
    },
    date: {
        type: Date
    },
    notGiven: {
        type: String
    }
});

module.exports = mongoose.model('Immunization', immunizationSchema);