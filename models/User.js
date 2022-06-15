const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    patient: {
        type: String, 
        required: true
    },
    gender: {
        type: String
    },
    dob: {
        type: Date
    },
});

module.exports = mongoose.model('User', userSchema);
