const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {type: String, required: true},
    mobileno: {type: Number, require: true, length: 10},
    address: {type: String, required: true}
});

exports.User = mongoose.model('User', userSchema);