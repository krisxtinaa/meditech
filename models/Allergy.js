const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const allergySchema = new Schema({
    patient: {
        type: String, 
        required: true
    },
    allergyID: {
        type: String,
        required: true
    },
    reaction: {
        type: String
    },
    severity: {
        type: String
    },
    date: {
        type: Date
    },
    substance: {
        type: String
    },
    code: {
        type: String
    },
    status: {
        type: String
    },
    criticality: {
        type: String
    },
    type: {
        type: String
    },
    system: {
        type: String
    }
});

module.exports = mongoose.model('Allergy', allergySchema);