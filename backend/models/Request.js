
const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vehicleType: {
    type: String,
    enum: ['car', 'motorbike'],
    required: [true, 'Please specify vehicle type']
  },
  serviceType: {
    type: String,
    enum: ['flatTire', 'fuel', 'engine', 'spark', 'oilLeakage'],
    required: [true, 'Please specify service type']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description of the problem']
  },
  image: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'accepted','user have completed', 'mechanic have completed', 'completed', 'cancelled'],
    default: 'pending'
  },
  destination: {
    type: String,
    required: [true, 'Please provide a location']
  },
  source:{
    type: String,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mechanic'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Request', RequestSchema);
