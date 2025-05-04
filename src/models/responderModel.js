import mongoose from 'mongoose'

const responderSchema = new mongoose.Schema({
  name: String,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  available: {
    type: Boolean,
    default: true,
  },
})

// 2dsphere index is required for geospatial queries
responderSchema.index({ location: '2dsphere' })

const Responder = mongoose.model('Responder', responderSchema)
module.exports = Responder
