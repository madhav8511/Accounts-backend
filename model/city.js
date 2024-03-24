const mongoose = require('mongoose');
const { Schema } = mongoose;

const citySchema = new Schema({
    name: {type: String, required: true}
});

exports.City = mongoose.model('City', citySchema);