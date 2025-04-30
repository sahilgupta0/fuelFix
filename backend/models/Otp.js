
const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  otp: {
    type: Number,
  },
  verified : {
    type : Boolean,
    default : false
  }
});

module.exports = mongoose.model('Otp', OtpSchema);
