const mongoose = require('mongoose');
const { Schema } = mongoose;

const billSchema = new Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    quantity: {type: Number, required: true}

});

exports.Bill = mongoose.model('Bill', billSchema);