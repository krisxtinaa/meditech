const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    patient: {
        type: String, 
        required: true
    },
    access_token: {
        type: String
    },
    refresh_token: {
        type: String
    }
});

module.exports = mongoose.model('User', userSchema);