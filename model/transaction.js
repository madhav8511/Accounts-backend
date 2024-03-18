const mongoose = require('mongoose');
const { Schema } = mongoose;

const notesSchema = new Schema({
    user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    amount: {type: Number,required: true},
    description: {type: String, required: true},
    type: {type: String, require: true},
    date: {type: Date, default: Date.now}
  });

exports.Transaction = mongoose.model('Transaction', notesSchema);