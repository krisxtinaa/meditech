const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const conditionSchema = new Schema({
    patient: {
        type: String, 
        required: true
    },
    conditionID: {
        type: String,
        required: true
    },
    conditionName: {
        type: String
    },
    status: {
        type: String
    },
    date: {
        type: Date
    },
    category: {
        type: String
    },
    system: {
        type: String
    },
    code: {
        type: String
    }
});

module.exports = mongoose.model('Condition', conditionSchema);