const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    patient: {
        type: String, 
        required: true
    },
    medificationRef: {
        type: String
    },
    status: {
        type: String
    },
    system: {
        type: String
    },
    contains: {
        type: String
    },
    date: {
        type: Date
    },
    product: {
        type: String
    }
});

module.exports = mongoose.model('Order', orderSchema);