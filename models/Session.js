const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
    patient: {
        type: String, 
        required: true
    },
    access_token: {
        type: String,
        required: true
    },
    refresh_token: {
        type: String,
        required: true
    }
    // expires_in: {
    //     type: Number
    // }
});

module.exports = mongoose.model('Session', sessionSchema);