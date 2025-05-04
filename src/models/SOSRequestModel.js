import mongoose from 'mongoose'

const sosSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
  },
  driverLocation: {
    type: {
      type: String,
      enum: ['Point'],
      required: false,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: false,
    },
  },
  userLocation: {
    type: {
      type: String,
      enum: ['Point'],
      required: false,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: false,
    },
  },
  hospitalLocation: {
    type: {
      type: String,
      enum: ['Point'],
      required: false,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: false,
    },
  },
  status: {
    type: String,
    enum: ['active', 'resolved'],
    default: 'active',
  },



  

})

const SOS = mongoose.model('SOS', sosSchema)
export default SOS
